
const { registor,
    getAllusers,
    getUserById,
    updateUser,
    deleteUser,
    login,
    logout,
    forgotPassword,
    restPassword,
    myProfile,
    updateProfilePassword,
    updateProfile,
    updateUserRole } = require('../controllers/userController');
const { isAuthenticatedUser, autherizedRoles } = require('../middlewares/auth');
const router = require('express').Router();
//  authication routes
router.route('/register').post(registor)
router.route('/login').post(login)
router.route('/forgot').post(forgotPassword)
router.route('/reset/:link').post(restPassword)
router.route('/logout').get(isAuthenticatedUser, logout)

// user profile routes 

router.route('/me').get(isAuthenticatedUser, myProfile)
router.route('/me/update').put(isAuthenticatedUser, updateProfile)
router.route('/me/update/password').put(isAuthenticatedUser, updateProfilePassword)

// admin routes
router.route('/all').get(isAuthenticatedUser, autherizedRoles('admin'), getAllusers)
router.route('/:id')
    .get(isAuthenticatedUser, autherizedRoles('admin'), getUserById)
    .put(isAuthenticatedUser, autherizedRoles('admin'), updateUser)
    .delete(isAuthenticatedUser, autherizedRoles('admin'), deleteUser)
    
router.route('/role/:id')
    .put(isAuthenticatedUser, autherizedRoles('admin'), updateUserRole);


module.exports = router;
