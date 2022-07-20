const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const ProductSchema = Schema({
  name: {
    type: String,
    minlength: [3, 'Panjang nama makanan minimal 3 karakter'],
    maxlength: [255, 'Panjang nama makanan maksimal 255 karakter'],
    required: [true, 'nama makanan wajib diisi'],
  },
  description: {
    type: String,
    maxlenght: [1000, 'Maksimal deskripsi makanan 1000 karakter'],
  },

  price: {
    type: Number,
    default: 0,
  },

  imageUrl: {
    type: String,
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },

  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ]

}, { timestamps: true });

const Product = model('Product', ProductSchema);

module.exports = Product;