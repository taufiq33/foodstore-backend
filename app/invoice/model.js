const {model, Schema} = require('mongoose');

const InvoiceSchema = Schema({
  sub_total: {
    type: Number,
    required: [true, 'sub_total harus diisi']
  },
  delivery_fee: {
    type: Number,
    required: [true, 'delivery_fee harus diisi']
  },
  delivery_address: {
    provinsi: {type: String, required: [true, 'Provinsi wajib diisi']},
    kabupaten: {type: String, required: [true, 'kabupaten wajib diisi']},
    kecamatan: {type: String, required: [true, 'kecamatan wajib diisi']},
    kelurahan: {type: String, required: [true, 'kelurahan wajib diisi']},
    detail: {type: String, required: [true, 'detail wajib diisi']},
  },
  total: {
    type: Number,
    required: [true, 'total harus diisi']
  },
  payment_status : {
    type: String, 
    enum: ['waiting_payment', 'paid'],
    default: 'waiting_payment'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
});

const Invoice = model('Invoice', InvoiceSchema);

module.exports = Invoice;
