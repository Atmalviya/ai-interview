const { Sequelize } = require('sequelize');
const config = require('./index');

const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    // Sync all models
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database & tables synced');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize; 