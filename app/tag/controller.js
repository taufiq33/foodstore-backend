const Tag = require('./model');

const store = async (request, response, next) => {
  let payload = request.body;
  try {
    let tag = new Tag(payload);
    await tag.save();

    response.json({
      status: 'success',
      message: 'berhasil tambah 1 data tag',
      data: tag,
    });

  } catch (error) {
    if (error && error.name == 'ValidationError') {
      response.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      })
    }

    next(error);
  }
}

const index = async (request, response, next) => {
  let { limit = 4, skip = 0 } = request.query;
  try {
    let tags = await Tag
      .find()
      .limit(limit)
      .skip(skip)
      ;
    response.json({
      status: 'success',
      message: 'berhasil ambil data tag',
      limit: limit,
      skip: skip,
      data: tags,
    });

  } catch (error) {
    if (error && error.name == 'ValidationError') {
      response.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      })
    }

    next(error);
  }
}

const single = async (request, response, next) => {
  let { tagId } = request.params;
  try {
    let tag = await Tag.findOne({
      _id: tagId
    });

    response.json({
      status: 'success',
      message: 'berhasil ambil 1 data tag',
      data: tag,
    });

  } catch (error) {
    if (error && error.name == 'ValidationError') {
      response.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      })
    }

    next(error);
  }
}

const update = async (request, response, next) => {
  let { tagId } = request.params;
  let payload = request.body;

  try {
    let tag = await Tag.findOneAndUpdate(
      { _id: tagId },
      payload,
      { new: true, runValidators: true }
    );

    response.json({
      status: 'success',
      message: 'berhasil update 1 data tag',
      data: tag,
    });

  } catch (error) {
    if (error && error.name == 'ValidationError') {
      response.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      })
    }

    next(error);
  }
}

const deleteTag = async (request, response, next) => {
  let { tagId } = request.params;

  try {
    let tag = await Tag.findOneAndDelete(
      { _id: tagId }
    );

    response.json({
      status: 'success',
      message: 'berhasil delete 1 data tag',
      data: tag,
    });

  } catch (error) {
    if (error && error.name == 'ValidationError') {
      response.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      })
    }

    next(error);
  }
}

module.exports = {
  store,
  index,
  single,
  update,
  deleteTag
}