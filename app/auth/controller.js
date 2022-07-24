const passport = require('passport');
const LocalStrategy = require('passport-local');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { secretKey } = require('../config');
const User = require('../user/model');

async function localStrategy(email, password, done) {
  try {
    let user = await User.findOne({
      email
    })
    .select('-__v -createdAt -updatedAt -cart_items -token -full_name -role');

    if(!user) return done();

    if(bcrypt.compareSync(password, user.password)) {
      ( {password, ...userWithoutPassword} = user.toJSON() );
      return done(null, userWithoutPassword);
    } else {
      return done(null);
    }
  } catch (error) {
    done(error, null);
  }
}

passport.use(new LocalStrategy({usernameField: 'email'}, localStrategy));

async function register(request, response, next) {
  try {
    const payload = request.body;
    let user = new User(payload);

    await user.save();

    return response.json(user);
  } catch (error) {
    if(error && error.name === 'ValidationError'){
      return response.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }

    next(error);
  }
}

async function login(request, response, next) {
  passport.authenticate('local', async function(error, user){
    if(error) return next(error);

    if(!user) return response.json({
      error: 1, 
      message: 'Invalid email / password'
    });

    let signed = jwt.sign(user, secretKey);

    await User.findOneAndUpdate(
      {
        _id: user._id
      },
      {
        $push: {
          token: signed
        }
      },
      {
        new: true,
      }
    );

    return response.json({
      message: 'Login success,',
      user: user,
      token: signed
    });

  })(request, response, next);
}

async function me(request, response, next) {
  if(request.user) {
    return response.json(request.user);
  }

  return response.json({
    error: 1,
    message: 'You are not login / token expired / invalid token'
  })
}

module.exports = {
  register,
  login,
  me,
  localStrategy,
};

