const mongoose = require('mongoose');

const {
  databaseHost,
  databasePort,
  databaseUser,
  databasePassword,
  databaseName,
  databaseAuthSource
} = require('../app/config');

const connectionString = `mongodb://${databaseUser}:${databasePassword}@${databaseHost}:${databasePort}/${databaseName}?authSource=${databaseAuthSource}`;

console.log(connectionString)

mongoose.connect(
  connectionString,
);

const db = mongoose.connection;

db.on('connected', () => {
  console.log('berhasil terkoneksi dengan database');
})

db.on('error', (error) => {
  console.log(`error karena ${error}`);
})

module.exports = db;