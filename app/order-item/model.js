const { model, Schema } = require('mongoose');

const OrderItemSchema = Schema({
  name: {
    type: String,
    required: [true, 'Nama wajib diisi'],
    minlength: [5, 'Minimal panjang karakter nama adalah 5']
  },

  price: {
    type: Number,
    required: [true, 'Harga item harus diisi']
  },

  qty: {
    type: Number,
    min: [1, 'Kuantitas minimal 1']
  },

  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },

  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }
});

const OrderItem = model('OrderItem', OrderItemSchema);

module.exports = OrderItem;
