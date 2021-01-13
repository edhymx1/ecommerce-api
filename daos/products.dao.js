const pool = require('../database');

const queries = {
  insert_product: 'INSERT INTO products(product_name, description, price, discount, stock) VALUES (?, ?, ?, ?, ?)',
  insert_pc: 'INSERT INTO product_categories(product_id, category_id) VALUES ?',
  insert_pp: 'INSERT INTO product_pictures(product_id, picture_id) VALUES ?',
  insert_picture: 'INSERT INTO pictures(url) VALUES(?)',
  getProductsByCategory: `SELECT p.* FROM products p
            LEFT JOIN product_categories pc ON p.product_id = pc.product_id
            JOIN categories c ON pc.category_id = c.category_id
                WHERE c.category_id = ? AND p.product_id > ? ORDER BY p.product_id ASC LIMIT 10`,
  getProductsLikeProductName: `SELECT p.* FROM products p
            WHERE p.product_name LIKE ? AND p.product_id > ? 
            ORDER BY p.product_id ASC LIMIT 10`,
  getPicturesByProductId: `SELECT pic.* FROM products p
            LEFT JOIN product_pictures pp ON p.product_id = pp.product_id
            JOIN pictures pic ON pp.picture_id = pic.picture_id
                WHERE p.product_id = ? ORDER BY pic.picture_id ASC`,
};

const create = async (data) => {
  return new Promise(async (resolve, reject) => {
    const conn = await pool.getConnection();
    try {
      // begin transaction
      await conn.beginTransaction();

      // insert data to create new product
      const result = await conn.query(queries.insert_product, [
        data.product_name,
        data.description,
        data.price,
        data.discount,
        data.stock,
      ]);

      // get insert_id
      const product_id = result[0].insertId;

      // prepare an array of prouct_categories and insert them
      let product_categories = [];
      for (var i = 0; i < data.categories.length; i++) {
        product_categories[i] = [product_id, data.categories[i]];
      }

      await conn.query(queries.insert_pc, [product_categories]);

      // prepare an array of product_pictures and insert them
      let product_pictures = [];
      for (var i = 0; i < data.pictures.length; i++) {
        const result = await conn.query(queries.insert_picture, data.pictures[i]);
        product_pictures[i] = [product_id, result[0].insertId];
      }

      await conn.query(queries.insert_pp, [product_pictures]);

      // commit transaction
      await conn.commit();

      // delete categories to input data
      // set product_id to input data
      delete data.categories;
      data.product_id = product_id;

      // return product data
      return resolve(data);
    } catch (error) {
      await conn.rollback();
      return reject(error);
    } finally {
      await conn.release();
    }
  });
};

const getProductsByCategory = async (category_id, last_id = 0) => {
  return new Promise(async (resolve, reject) => {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query(queries.getProductsByCategory, [category_id, last_id]);
      let products = result[0];
      for (var i = 0; i < products.length; i++) {
        const pictures_res = await conn.query(queries.getPicturesByProductId, products[i].product_id);
        let pictures = pictures_res[0];
        products[i].pictures = [];
        for (var j = 0; j < pictures.length; j++) {
          products[i].pictures[j] = pictures[j].url;
        }
      }
      return resolve(products);
    } catch (error) {
      return reject(error);
    } finally {
      await conn.release();
    }
  });
};

const getProductsLikeProductName = async (product_name, last_id = 0) => {
  return new Promise(async (resolve, reject) => {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query(queries.getProductsLikeProductName, [`%${product_name}%`, last_id]);
      let products = result[0];
      for (var i = 0; i < products.length; i++) {
        const pictures_res = await conn.query(queries.getPicturesByProductId, products[i].product_id);
        let pictures = pictures_res[0];
        products[i].pictures = [];
        for (var j = 0; j < pictures.length; j++) {
          products[i].pictures[j] = pictures[j].url;
        }
      }
      return resolve(products);
    } catch (error) {
      return reject(error);
    } finally {
      await conn.release();
    }
  });
};

module.exports = { create, getProductsByCategory, getProductsLikeProductName };
