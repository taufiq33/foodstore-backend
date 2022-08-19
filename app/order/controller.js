const mongoose = require('mongoose');
const { subject } = require('@casl/ability');

const policyFor = require('../policy');

const Order = require('./model');
const OrderItem = require('../order-item/model');
const DeliveryAddress = require('../deliveryaddress/model');
const CartItem = require('../cart-item/model');

const store = async(request, response, next) => {
  const policy = policyFor(request.user);

  try {
    if(!policy.can('create', 'Order')) {
      return response.json({
        error: 1,
        message: 'forbidden to access this resource'
      })
    }

    let {delivery_fee, delivery_address } = request.body;
    let cartItems = await CartItem
      .find({user: request.user._id})
      .populate('product');
    
    if(!cartItems.length){
      return response.json({
        error: 1,
        message: 'Can\'t create order because you have no items in cart'
      });
    }

    let address = await DeliveryAddress.findOne({
      _id: delivery_address
    });

    let order = new Order({
      _id: new mongoose.Types.ObjectId(),
      status: 'waiting_payment',
      delivery_fee,
      delivery_address: {
        provinsi: address.provinsi,
        kabupaten: address.kabupaten,
        kecamatan: address.kecamatan,
        kelurahan: address.kelurahan,
        detail: address.detail,
      },
      user: request.user._id,
    })

    let orderItems = await OrderItem
      .insertMany(
        cartItems.map(item => {
          console.log(item);
          return {
            ...item,
            name: item.name,
            qty: parseInt(item.qty),
            price: parseInt(item.price),
            order: order._id,
            product: item.product._id
          }
        })
      );
    
    orderItems.forEach(item => order.order_items.push(item));

    await order.save();

    await CartItem.deleteMany({
      user: request.user._id
    });

    return response.json(order);
    
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
};

const index = async(request, response, next) => {
  const policy = policyFor(request.user);

  try {
    if(!policy.can('read', 'Order')){
      response.json({
        error: 1,
        message: 'Forbidden to access this resource'
      })
    }

    let {limit = 10, skip = 0} = request.query;

    let count = await Order.find({user: request.user._id}).countDocuments();
    let orders = await Order.find({
      user: request.user._id
    })
    .limit(parseInt(limit))
    .skip(parseInt(skip))
    .populate('order_items')
    .sort('-createdAt');

    return response.json({
      data: orders.map(order => order.toJSON({virtuals: true})),
      count
    })

  } catch (error) {
    next(error);
  }
}

module.exports = {
  store,
  index,
}
