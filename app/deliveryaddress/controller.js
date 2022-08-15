const policyFor = require('../policy/index');
const DeliveryAddress = require('./model');
const { subject } = require('@casl/ability');

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

const update = async (request, response, next) => {
  let { deliveryAddressId } = request.params;
  let policy = policyFor(request.user);

  try {
    let {_id , ...payload} = request.body;
    let address = await DeliveryAddress.findOne({_id: deliveryAddressId});
    
    const subjectAddress = subject('DeliveryAddress', {...address, user_id: address.user})

    if(!policy.can('update', subjectAddress)) {
      return response.json({
        error: 1,
        message: 'Forbidden to access this resource',
      })
    }

    let updatedAddress = await DeliveryAddress.findOneAndUpdate(
      {_id: deliveryAddressId}, payload, {new: true}
    );

    return response.json(updatedAddress);
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

const destroy = async (request, response, next) => {
  let { deliveryAddressId } = request.params;
  let policy = policyFor(request.user);

  try {
    let address = await DeliveryAddress.findOne({_id: deliveryAddressId});

    if(!address){
      return response.json({
        error: 1,
        message: 'Address not found'
      })
    }
    
    const subjectAddress = subject('DeliveryAddress', {...address, user_id: address.user})

    if(!policy.can('delete', subjectAddress)) {
      return response.json({
        error: 1,
        message: 'Forbidden to access this resource',
      })
    }

    let deletedAddress = await DeliveryAddress.findOneAndDelete(
      {_id: deliveryAddressId}
    );

    return response.json(deletedAddress);
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

const index = async (request, response, next) => {
  let policy = policyFor(request.user);

  try {
    if(!policy.can('read', 'DeliveryAddress')) {
      return response.json({
        error: 1,
        message: 'forbidden to access this resource'
      })  
    }

    let {limit = 10, skip = 0} = request.query;
    let deliveryAddress = await DeliveryAddress
      .find({user: request.user._id})
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort('-createdAt');
    
    let count = await DeliveryAddress.find({user: request.user._id}).countDocuments();

    if(!deliveryAddress) {
      deliveryAddress = [];
    }

    return response.json({
      count, data: deliveryAddress, 
    })

  } catch (error) {
    next(error);
  }
}

module.exports = {
  store,
  update,
  destroy,
  index,
}