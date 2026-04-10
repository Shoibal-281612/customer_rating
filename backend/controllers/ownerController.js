const { Store, Rating, User } = require('../models');
const sequelize = require('../config/db');

exports.getDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({ where: { owner_id: req.user.id } });
    if (!store) return res.status(404).json({ error: 'No store assigned to you' });

    const avgResult = await Rating.findOne({
      where: { store_id: store.id },
      attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']],
      raw: true
    });
    const averageRating = avgResult?.averageRating || 0;

    const usersWhoRated = await Rating.findAll({
      where: { store_id: store.id },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      attributes: ['rating']
    });

    res.json({
      store,
      averageRating,
      ratings: usersWhoRated.map(r => ({
        user: r.User,
        rating: r.rating
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};