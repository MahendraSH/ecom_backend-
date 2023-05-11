
const { registor
    , getAllusers,
    getUserById,
    updateUser, 
    login,
    logout} = require('../controllers/userController');
const { isAuthenticatedUser, isAdmin, autherizedRoles } = require('../middlewares/auth');
const router = require('express').Router();

router.route('/register').post(registor)
router.route('/login').post(login)
router.route('/logout').get(isAuthenticatedUser, logout)
router.route('/all').get(isAuthenticatedUser ,getAllusers)
router.route('/:id').get(getUserById).put(updateUser);

module.exports= router;
