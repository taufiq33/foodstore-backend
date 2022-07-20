const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {model, Schema} = mongoose;

const HASH_ROUND = 10;

let userSchema = Schema({
  full_name: {
    type: String,
    required: [true, 'Nama harus diisi'],
    maxlength: [255, 'Panjang nama antara 3 - 255 karakter'],
    minlength: [3, 'Panjang nama antara 3 - 255 karakter'],
  },

  customer_id: {
    type: Number,
  },

  email: {
    type: String,
    required: [true, 'Email harus diisi'],
    maxlength: [255, 'Panjang email maksimal 255 karakter'],
  },

  password: {
    type: String,
    require: [true, 'Password harus diisi'],
    maxlength: [255, 'panjang password maksimal 255 karakter'],
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  token: [String],
}, {
  timestamps: true
});

userSchema.path('email').validate(function(value) {
  const EMAIL_REGEX = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return EMAIL_REGEX.test(value);
}, attr => `${attr.value} harus merupakan email yang valid!`);

userSchema.path('email').validate(async function(value) {
  try{
    const count = await this.model('User').count({
      email: value
    });

    return !count;
  } catch(error) {
    throw error;
  }
}, attr => `${attr.value} sudah terdaftar.`);

userSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

userSchema.plugin(AutoIncrement, {
  inc_field: 'customer_id'
});

const User = model('User', userSchema);

module.exports = User;
