const User = require('./user');
const Store = require('./store');
const Rating = require('./rating');

// Associations
User.hasMany(Rating, { foreignKey: 'user_id' });
Rating.belongsTo(User, { foreignKey: 'user_id' });

Store.hasMany(Rating, { foreignKey: 'store_id' });
Rating.belongsTo(Store, { foreignKey: 'store_id' });

User.hasOne(Store, { foreignKey: 'owner_id' });
Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

module.exports = { User, Store, Rating };