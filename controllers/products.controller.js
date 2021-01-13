const Validator = require('validatorjs');
const Product = require('../daos/products.dao');
const savePicture = require('../utils/savePicture');

const createProduct = async (req, res) => {
  try {
    let inputData = req.body;

    const rules = {
      product_name: 'required|max:45',
      description: 'required|max:2000',
      price: 'required|price',
      discount: 'required|discount',
      stock: 'required|stock',
      categories: 'array|min:1',
      pictures: 'array|min:1|max:3',
    };

    const validator = new Validator(inputData, rules, {
      required: 'required',
      max: { string: 'max of :max' },
      min: 'min of :min',
      array: 'the value is not an array',
    });

    if (validator.passes()) {
      let pictures = [];
      let errors_pictures = [];

      for (let i = 0; i < inputData.pictures.length; i++) {
        try {
          pictures[i] = await savePicture(inputData.pictures[i], 'products');
        } catch (error) {
          errors_pictures[i] = { index: i, message: error.message };
        }
      }

      if (errors_pictures.length > 0) {
        return res
          .status(400)
          .json({ status: 400, message: 'invalid input data', errors: { pictures: errors_pictures } });
      }

      inputData.pictures = pictures;

      const product = await Product.create(inputData);

      return res.status(200).json({ status: 200, message: 'product created successful', data: product });
    } else {
      const validatorErrors = validator.errors.errors;
      let errors = {};
      for (var error in validatorErrors) {
        if (validatorErrors.hasOwnProperty(error)) {
          errors[error] = validatorErrors[error][0];
        }
      }

      return res.status(400).json({ status: 400, message: 'invalid input data', errors });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getProductsByCategoryId = async (req, res) => {
  try {
    let { category_id, last_id } = req.query;

    if (!last_id) {
      last_id = 0;
    }

    const products = await Product.getProductsByCategory(category_id, last_id);

    if (products.length === 0) {
      return res.json({ status: 200, data: [], next: process.env.HOST + req.originalUrl });
    }

    const next_id = products[products.length - 1].product_id;
    const next_url =
      process.env.HOST + req.originalUrl.split('?').shift() + '?category_id=' + category_id + '&last_id=' + next_id;
    return res.status(200).json({ status: 200, data: products, next: next_url });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getProductsLikeProductName = async (req, res) => {
  try {
    let { product_name, last_id } = req.query;
    if (!last_id) {
      last_id = 0;
    }

    const products = await Product.getProductsLikeProductName(product_name, last_id);
    if (products.length === 0) {
      return res.json({ status: 200, data: [], next: process.env.HOST + req.originalUrl });
    }

    const next_id = products[products.length - 1].product_id;
    const next_url =
      process.env.HOST + req.originalUrl.split('?').shift() + '?product_name=' + product_name + '&last_id=' + next_id;
    return res.status(200).json({ status: 200, data: products, next: next_url });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = { createProduct, getProductsByCategoryId, getProductsLikeProductName };
