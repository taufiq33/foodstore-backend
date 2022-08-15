const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const DeliveryAddressSchema = Schema({
  nama: {
    type: String,
    required: [true, 'Nama wajib diisi'],
    maxLength: [255, 'Panjang maksimal nama 255 karakter'],
  },

  kelurahan: {
    type: String,
    required: [true, 'kelurahan wajib diisi'],
    maxLength: [255, 'Panjang maksimal kelurahan 255 karakter'],
  },

  kecamatan: {
    type: String,
    required: [true, 'kecamatan wajib diisi'],
    maxLength: [255, 'Panjang maksimal kecamatan 255 karakter'],
  },

  kabupaten: {
    type: String,
    required: [true, 'kabupaten wajib diisi'],
    maxLength: [255, 'Panjang maksimal kabupaten 255 karakter'],
  },

  provinsi: {
    type: String,
    required: [true, 'provinsi wajib diisi'],
    maxLength: [255, 'Panjang maksimal provinsi 255 karakter'],
  },

  detail: {
    type: String,
    required: [true, 'detail alamat wajib diisi'],
    maxLength: [1000, 'Panjang maksimal detail alamat 1.000 karakter'],
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {timestamps: true});

const DeliveryAddress = model('DeliveryAddress', DeliveryAddressSchema);

module.exports = DeliveryAddress;