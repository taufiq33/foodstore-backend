const jwt = require('jsonwebtoken');
const User = require('../user/model');
const config = require('../config');
const getToken = require('../utils/get-token');

function decodeToken() {
  return async function (request, response, next){
    try {
      let token = getToken(request);

      if(!token) return next();

      request.user = jwt.verify(token, config.secretKey);
      console.table(request.user);
      let user = await User.findOne({
        token : {
          $in: token
        }
      });

      if(!user) {
        return response.json({
          error: 1,
          message: 'Token expired.'
        })
      }
      
    } catch (error) {
      if(error && error.name === 'JsonWebTokenError') {
        return response.json({
          error: 1,
          message: error.message,
        })
      }

      next(error);
    }

    next();
  }
}


module.exports = decodeToken;