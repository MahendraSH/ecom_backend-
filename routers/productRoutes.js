const { getAllProducts
    , createProduct
    , updateProduct,
    getProductById,
    deleteProduct } = require('../controllers/ProductController');
 
    const router  =require('express').Router()

router.route('/all').get(getAllProducts);
router.route('/create').post(createProduct);
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);

module.exports = router;
