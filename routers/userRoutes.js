
const { registor,
    getAllusers,
    getUserById,
    updateUser,
    deleteUser,
    login,
    logout,
    forgotPassword,
    restPassword } = require('../controllers/userController');
const { isAuthenticatedUser, autherizedRoles } = require('../middlewares/auth');
const router = require('express').Router();

router.route('/register').post(registor)
router.route('/login').post(login)
router.route('/forgot').post(forgotPassword)
router.route('/reset/:link').post(restPassword)
router.route('/logout').get(isAuthenticatedUser, logout)


// admin routes
router.route('/all').get(isAuthenticatedUser,autherizedRoles('admin'), getAllusers)
router.route('/:id').get(isAuthenticatedUser,autherizedRoles('admin'), getUserById)
    .put(isAuthenticatedUser,autherizedRoles('admin'), updateUser)
    .delete(isAuthenticatedUser,autherizedRoles('admin'), deleteUser);


module.exports = router;
