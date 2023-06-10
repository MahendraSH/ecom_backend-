const { getAllProducts
    , createProduct
    , updateProduct,
    getProductById,
    deleteProduct,
createProductReview,
getAllReviews } = require('../controllers/ProductController');
const { isAuthenticatedUser, autherizedRoles } = require('../middlewares/auth');

const router = require('express').Router()

// user product routes
router.route('/all').get(getAllProducts);

// reviews routes

router.route('/review').put(isAuthenticatedUser, createProductReview);

router.route('/reviews').get(getAllReviews);


// admin product routes 
router.route('/create').post(isAuthenticatedUser, autherizedRoles('admin'), createProduct);
router.route('/:id').get(getProductById)
    .put(isAuthenticatedUser, autherizedRoles('admin'),updateProduct)
    .delete (isAuthenticatedUser, autherizedRoles('admin'),deleteProduct);

module.exports = router;
