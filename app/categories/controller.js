const Category = require('./model');

const store = async (request, response, next) => {
  let payload = request.body;
  try {
    let category = new Category(payload);
    await category.save();
    response.json({
      status: 'success',
      message: 'Berhasil tambah kategori',
      data: category
    })
  } catch (error) {
    if (error && error.name == 'ValidationError') {
      response.json({
        error: 1,
        message: error.message,
        fields: error.errors
      })
    }

    next(error);
  }
}

const index = async (request, response, next) => {
  let { limit = 4, skip = 0 } = request.query;
  try {
    let categories = await Category
      .find()
      .limit(limit)
      .skip(skip)
      ;

    response.json({
      status: 'success',
      message: 'Berhasil mengambil data kategori',
      limit: limit,
      skip: skip,
      data: categories
    })
  } catch (error) {
    if (error && error.name == 'ValidationError') {
      response.json({
        error: 1,
        message: error.message,
        fields: error.errors
      })
    }

    next(error);
  }
}

const single = async (request, response, next) => {
  const { categoryId } = request.params;

  try {
    let category = await Category.findOne({
      _id: categoryId,
    })

    response.json({
      status: 'success',
      message: 'Berhasil mengambil 1 data kategori',
      data: category
    });
  } catch (error) {
    if (error && error.name == 'ValidationError') {
      response.json({
        error: 1,
        message: error.message,
        fields: error.errors
      })
    }

    next(error);
  }
}

const update = async (request, response, next) => {
  const { categoryId } = request.params;
  const payload = request.body;

  console.log(payload);

  try {
    let category = await Category.findOneAndUpdate(
      { _id: categoryId },
      payload,
      { new: true, runValidators: true }
    );

    response.json({
      status: 'success',
      message: 'Berhasil mengupdate 1 data kategori',
      data: category
    });
  } catch (error) {
    if (error && error.name == 'ValidationError') {
      response.json({
        error: 1,
        message: error.message,
        fields: error.errors
      })
    }

    next(error);
  }
}

const deleteCategory = async (request, response, next) => {
  const { categoryId } = request.params;


  try {
    let category = await Category.findOneAndDelete(
      { _id: categoryId },
    );

    response.json({
      status: 'success',
      message: 'Berhasil menghapus 1 data kategori',
      data: category
    });
  } catch (error) {
    if (error && error.name == 'ValidationError') {
      response.json({
        error: 1,
        message: error.message,
        fields: error.errors
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
  deleteCategory,
}