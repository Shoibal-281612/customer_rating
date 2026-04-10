const { Store, Rating } = require('../models');
const { Op } = require('sequelize');

exports.getStores = async (req, res) => {
  try {
    const { search, sortBy = 'name', order = 'ASC' } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } }
      ];
    }
    const stores = await Store.findAll({
      where,
      include: [{ model: Rating, attributes: ['rating', 'user_id'] }],
      order: [[sortBy, order.toUpperCase()]]
    });

    const result = stores.map(store => {
      const ratings = store.Ratings || [];
      const overall = ratings.length ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length : 0;
      const userRating = ratings.find(r => r.user_id === req.user.id)?.rating || null;
      return { ...store.toJSON(), overallRating: overall, userRating };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const storeId = req.params.storeId;
    const userId = req.user.id;

    const [ratingObj, created] = await Rating.upsert({
      user_id: userId,
      store_id: storeId,
      rating: rating
    });
    res.json({ message: created ? 'Rating submitted' : 'Rating updated', rating: ratingObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};