const { model, Schema } = require("mongoose");

const CartItemSchema = Schema({
  name: {
    type: String,
    minlength: [5, 'Panjang minimal nama adalah 5 karakter'],
    required: [true, 'Nama wajib diisi'],
  },
  qty: {
    type: Number,
    required: [true, 'qty wajib diisi'],
    min: [1, 'Besar qty minimal 1'],
    validate: {
      validator: function(value) {
        return value >= 1;
      },
      message: 'qty wajib minimal 1'
    }
  },
  price: {
    type: Number,
    default: 0,
  },
  image_url: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }
});

const CartItem = model('CartItem', CartItemSchema);

module.exports = CartItem;
