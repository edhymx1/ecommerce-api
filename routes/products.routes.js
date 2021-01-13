const { Router } = require('express');
const {
  createProduct,
  getProductsByCategoryId,
  getProductsLikeProductName,
} = require('../controllers/products.controller');
const verifyToken = require('../middlewares/varify-token');
const { isAdmin } = require('../middlewares/verify-roles');

const router = Router();

router.post('/create', verifyToken, isAdmin, createProduct);
router.get('/by-category', verifyToken, getProductsByCategoryId);
router.get('/like-product-name', verifyToken, getProductsLikeProductName);

module.exports = router;
