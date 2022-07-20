const User = require('../user/model');

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

module.exports = {
  register,
};

