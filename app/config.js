const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const targetDirUpload = 'public/uploads';

module.exports = {
  serviceName: process.env.SERVICE_NAME,
  servicePort: process.env.PORT,

  databaseHost: process.env.DB_HOST,
  databasePort: process.env.DB_PORT,
  databaseName: process.env.DB_NAME,
  databaseUser: process.env.DB_USER,
  databasePassword: process.env.DB_PASSWORD,
  databaseAuthSource: process.env.DB_AUTHSOURCE,

  uploadPath: path.join(path.resolve(__dirname, '..'), targetDirUpload),
}