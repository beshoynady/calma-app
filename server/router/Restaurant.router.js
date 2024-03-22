const express = require('express');
const router = express.Router();
const {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/Restaurant.controller');

const authenticateToken = require('../utlits/authenticate')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = new Date().toISOString().replace(/:/g, "-");
    cb(null, uniqueSuffix + file.originalname);
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 ,
  },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, JPG, and PNG file types are allowed."));
    }
  },
});


router.route('/')
  .post(authenticateToken,upload.single("image"), createRestaurant)
  .get(authenticateToken, getAllRestaurants);

router.route('/:id')
  .get(authenticateToken, getRestaurantById)
  .put(authenticateToken, upload.single("image"), updateRestaurant)
  .delete(authenticateToken, deleteRestaurant);

module.exports = router;
