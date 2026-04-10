const { User, Store, Rating } = require('../module');
const { Op } = require('sequelize');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      order: [[sortBy, order.toUpperCase()]],
      attributes: { exclude: ['password_hash'] }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.role === 'store_owner') {
      const store = await Store.findOne({ where: { owner_id: user.id } });
      if (store) {
        const avgRating = await Rating.findOne({
          where: { store_id: store.id },
          attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']],
          raw: true
        });
        user.dataValues.rating = avgRating?.avgRating || null;
      }
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const user = await User.create({ name, email, password_hash: password, address, role });
    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    const store = await Store.create({ name, email, address, owner_id });
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', order = 'ASC' } = req.query;
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      order: [[sortBy, order.toUpperCase()]],
      include: [{ model: Rating, attributes: ['rating'] }]
    });

    const storesWithRating = stores.map(store => {
      const ratings = store.Ratings || [];
      const total = ratings.reduce((sum, r) => sum + r.rating, 0);
      const avg = ratings.length ? total / ratings.length : 0;
      return { ...store.toJSON(), overallRating: avg };
    });
    res.json(storesWithRating);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};