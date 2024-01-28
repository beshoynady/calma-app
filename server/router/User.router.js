const express = require("express");
const { createuser, getoneuser, getallUsers, updateuser,updateUserStatus, deleteuser } = require('../controllers/User.controller.js')
// const verifyJWT = require('../middleware/verifyjwt');


const router = express.Router();

// router.use(verifyJWT)


router.route('/').post(createuser).get(getallUsers);
router.route('/:userid').get(getoneuser).put(updateuser).delete(deleteuser);
router.route('/update-status/:userid').put(updateUserStatus)
module.exports = router;

