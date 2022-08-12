const path = require('path');
const { createReadStream, createWriteStream, unlinkSync } = require('fs');
const Product = require('./model');
const Category = require('../categories/model');
const Tag = require('../tag/model');
const { getFileExtension, deleteFile } = require('../../helper/file_helper');
const { uploadPath } = require('../config');

const store = async (request, response, next) => {
  let payload = request.body;

  if (payload.category) {
    let category = await Category.findOne(
      {
        name: new RegExp(payload.category, 'i')
      }
    );

    if (category) {
      payload = {
        ...payload,
        category: category["_id"]
      }
    } else {
      delete payload.category
    }
  }

  if(payload.tags && payload.tags.length) {
    let tags = await Tag.find({
      name: {
        $in: payload.tags
      }
    });

    if(tags.length) {
      payload = {...payload, tags: tags.map(tag => tag._id)}
    }
  }

  try {
    if (request.file) {
      let tempfile = request.file.path;
      let extension = getFileExtension(request.file.originalname);
      let filename = `${request.file.filename}.${extension}`;
      let target = path.join(uploadPath, filename);

      let src = createReadStream(tempfile);
      let dest = createWriteStream(target);

      src.pipe(dest);
      src.on('end', async () => {
        try {
          let newProduct = new Product({
            ...payload,
            imageUrl: filename,
          })
          await newProduct.save();
          response.json({
            status: 'success',
            message: 'berhasil tambah data',
            data: newProduct
          });
        } catch (error) {
          unlinkSync(target);

          if (error && error.name === 'ValidationError') {
            response.json({
              error: 1,
              message: error.message,
              fields: error.errors
            });
          }

          next(error);
        }
      });

      src.on('error', (error) => next(error))

    } else {
      let product = new Product(payload);
      await product.save();

      return response.json({
        status: 'success',
        message: 'berhasil tambah data',
        data: product
      });
    }

  } catch (error) {
    if (error && error.name === 'ValidationError') {
      response.json({
        error: 1,
        message: error.message,
        fields: error.errors
      });
    }

    next(error);
  }

}

const index = async (request, response, next) => {
  let { limit = 4, skip = 0, q = '', category = '', tags = []} = request.query;

  let kriteria = {};

  if (q.length) {
    kriteria = {
      ...kriteria,
      name: new RegExp(q, 'i')
    }
  }

  if (category.length) {
    let categoryObj = await Category.findOne({
      name: new RegExp(category, 'i'),
    })

    if(categoryObj) {
      kriteria = {
        ...kriteria,
        category: categoryObj._id
      }
    }
  }

  if(tags.length) {
    let tagsArray = await Tag.find({
      name: {
        $in: tags
      }
    })

    if(tagsArray.length) {
      kriteria = {
        ...kriteria,
        tags: {$in: tagsArray.map(tag => tag._id)}
      }
    }
  }
  
  try {
    const count = await Product.find(kriteria).countDocuments();

    const products = await Product
      .find(kriteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('category')
      .populate('tags')
      .select('-__v')
      ;

    return response.json({
      status: 'success',
      message: 'berhasil mengambil semua data',
      limit: limit,
      skip: skip,
      count: count,
      data: products
    });
  } catch (error) {
    if (error && error.name === 'ValidationError') {
      response.json({
        error: 1,
        message: error.message,
        fields: error.errors
      });
    }

    next(error);
  }
};

const update = async (request, response, next) => {
  const { productId } = request.params;

  let payload = request.body;

  if (payload.category) {
    let category = await Category.findOne(
      {
        name: new RegExp(payload.category, 'i')
      }
    );

    if (category) {
      payload = {
        ...payload,
        category: category["_id"]
      }
    } else {
      delete payload.category
    }
  }

  if(payload.tags && payload.tags.length) {
    let tags = await Tag.find({
      name: {
        $in: payload.tags
      }
    });

    if(tags.length) {
      payload = {...payload, tags: tags.map(tag => tag._id)}
    }
  }

  try {
    if (request.file) {
      let tempfile = request.file.path;
      let extension = getFileExtension(request.file.originalname);
      let filename = `${request.file.filename}.${extension}`;
      let target = path.join(uploadPath, filename);

      let src = createReadStream(tempfile);
      let dest = createWriteStream(target);

      src.pipe(dest);
      src.on('end', async () => {
        try {
          let currentProduct = await Product.findOne({
            _id: productId,
          });

          console.log(currentProduct)

          if (currentProduct.imageUrl) {
            deleteFile(path.join(uploadPath, currentProduct.imageUrl));
          }

          let product = await Product.findOneAndUpdate(
            { _id: productId },
            { ...payload, imageUrl: filename },
            { new: true, runValidators: true }
          );

          return response.json({
            status: 'success',
            message: 'berhasil update 1 data',
            data: product
          });

        } catch (error) {
          unlinkSync(target);

          if (error && error.name === 'ValidationError') {
            response.json({
              error: 1,
              message: error.message,
              fields: error.errors
            });
          }

          next(error);
        }
      });

      src.on('error', (error) => next(error))

    } else {
      let product = await Product.findOneAndUpdate({ _id: productId }, payload, { new: true, runValidators: true });

      return response.json({
        status: 'success',
        message: 'berhasil update 1 data',
        data: product
      });
    }

  } catch (error) {
    if (error && error.name === 'ValidationError') {
      response.json({
        error: 1,
        message: error.message,
        fields: error.errors
      });
    }

    next(error);
  }

}

const single = async (request, response, next) => {
  const { productId } = request.params;

  try {
    let product = await Product.findById(productId);
    return response.json({
      status: 'success',
      message: 'berhasil get 1 data',
      data: product
    });

  } catch (error) {
    if (error && error.name === 'ValidationError') {
      response.json({
        error: 1,
        message: error.message,
        fields: error.errors
      });
    }

    next(error);
  }
}

const deleteProduct = async (request, response, next) => {
  const { productId } = request.params;

  try {
    let product = await Product.findOneAndDelete({
      _id: productId
    });
    deleteFile(path.join(uploadPath, product.imageUrl));
    return response.json({
      status: 'success',
      message: 'berhasil delete 1 data',
      data: product
    });

  } catch (error) {
    if (error && error.name === 'ValidationError') {
      response.json({
        error: 1,
        message: error.message,
        fields: error.errors
      });
    }

    next(error);
  }
}

module.exports = {
  store,
  index,
  update,
  single,
  deleteProduct,
}