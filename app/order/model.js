const {model, Schema, default: mongoose} = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const OrderSchema = Schema({
  status: {
    type: String,
    enum: ['waiting_payment', 'processing', 'in_delivery', 'delivered'],
    default: 'waiting_payment'
  },

  delivery_fee: {
    type: Number,
    default: 0,
  },

  delivery_address: {
    provinsi: {type: String, required: [true, 'Provinsi wajib diisi']},
    kabupaten: {type: String, required: [true, 'kabupaten wajib diisi']},
    kecamatan: {type: String, required: [true, 'kecamatan wajib diisi']},
    kelurahan: {type: String, required: [true, 'kelurahan wajib diisi']},
    detail: {type: String, required: [true, 'detail wajib diisi']},
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },

  order_items: [{
    type: Schema.Types.ObjectId,
    ref: 'OrderItem'
  }]
}, {timestamps: true});

OrderSchema.plugin(AutoIncrement, {
  inc_field: 'order_number',
});

OrderSchema.virtual('items_count').get(function() {
  return this.order_items.reduce((total, item) => {
    return total + parseInt(item.qty)
  }, 0);
})

const Order = model('Order', OrderSchema);

module.exports = Order;

