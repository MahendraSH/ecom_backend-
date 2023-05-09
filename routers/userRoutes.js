
const { registor
    , getAllusers,
    getUserById,
    updateUser } = require('../controllers/userController')
const router = require('express').Router();

router.route('/register').post(registor)
router.route('/all').get(getAllusers)
router.route('/:id').get(getUserById).put(updateUser);

module.exports= router;
