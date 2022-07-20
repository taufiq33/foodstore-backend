const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const categorySchema = Schema({
  name: {
    type: String,
    maxlength: [20, 'panjang maksimal nama kategori 20 karakter'],
    minlength: [3, 'panjang minimal nama kategori 3 karakter'],
    required: [true, 'Nama kategori wajib diisi']
  }
}, { timestamps: true });

const Category = model('Category', categorySchema);

module.exports = Category;