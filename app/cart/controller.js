const policyFor = require('../policy');
const Product = require('../products/model');
const CartItem = require('../cart-item/model');

const update = async(request, response, next) => {
  const policy = policyFor(request.user);

  if(!policy.can('update', 'Cart')) {
    return response.json({
      error: 1,
      message: 'Forbidden to access this resource'
    })
  }

  try {
    const { items } = request.body;
    const productIds = items.map(item => item.product._id);
    const products = await Product.find({
      _id: {
        $in: productIds
      }
    });

    let cartItems = items.map(item => {
      let relatedProduct = products.find(product => product._id.toString() === item.product._id);
      return {
        product: relatedProduct._id,
        price: relatedProduct.price,
        image_url: relatedProduct.image_url,
        name: relatedProduct.name,
        user: request.user._id,
        qty: item.qty
      }
    });

    await CartItem.deleteMany({user: request.user._id});

    await CartItem.bulkWrite(cartItems.map(item => {
      return {
        updateOne: {
          filter: {user: request.user._id, product: item.product},
          update: item,
          upsert: true,
          runValidators: true,
        }
      }
    }));

    return response.json(cartItems);
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

  if(!policy.can('read', 'Cart')){
    return response.json({
      error: 1,
      message: 'Forbidden to access this resource'
    });
  }

  try {
    let items = await CartItem.find({
      user: request.user._id
    }).populate('product');

    return response.json(items)
  } catch (error) {
    next(error);
  }
}

module.exports = {
  update,
  index,
}
