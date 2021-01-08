const { Router } = require('express');
const { createProduct, getProductsByCategoryId } = require('../controllers/products.controller');

const router = Router();

router.post('/create', createProduct);
router.get('/by-category', getProductsByCategoryId);

module.exports = router;
