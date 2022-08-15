const policyFor = require('../policy/index');
const DeliveryAddress = require('./model');

const store = async (request, response, next) => {
  let policy = policyFor(request.user);
  if(!policy.can('create', 'DeliveryAddress')) {
    return response.json({
      error: 1,
      message: 'forbidden to access this resource'
    })
  }

  try {
    let user = request.user;
    let payload = request.body;
    let newAddress = new DeliveryAddress({...payload, user: user._id});
    await newAddress.save();
  
    return response.json(newAddress);  
  } catch (error) {
    if(error && error.name === 'ValidationError') {
      return response.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      })
    }

    next(error);
  } 
}


module.exports = {
  store,
}