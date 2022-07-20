const { model, Schema } = require('mongoose');

const TagSchema = Schema({
  name: {
    type: String,
    minlength: [3, 'minimal panjang nama tag adalah 3 karakter'],
    maxlength: [20, 'maksimal panjang nama tag adalah 20 karakter'],
    required: [true, 'Nama Tag wajib diisi']
  }
}, { timestamps: true });

const Tag = model('Tag', TagSchema);

module.exports = Tag;