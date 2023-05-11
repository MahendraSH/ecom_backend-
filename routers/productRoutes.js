const { getAllProducts
    , createProduct
    , updateProduct,
    getProductById,
    deleteProduct } = require('../controllers/ProductController');
const { isAuthenticatedUser, autherizedRoles } = require('../middlewares/auth');

const router = require('express').Router()

router.route('/all').get(getAllProducts);
router.route('/create').post(isAuthenticatedUser, autherizedRoles('admin'), createProduct);
router.route('/:id').get(getProductById)
    .put(isAuthenticatedUser, autherizedRoles('admin'),updateProduct)
    .delete (isAuthenticatedUser, autherizedRoles('admin'),deleteProduct);

module.exports = router;
