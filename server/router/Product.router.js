const express = require("express");
const path = require("path");
// const verifyJWT = require('../middleware/verifyjwt');
const authenticateToken = require('../utlits/authenticate')

const {
  createProduct,
  addRecipe,
  getAllProducts,
  getProductByCategory,
  getOneProduct,
  updateProduct,
  updateProductWithoutImage,
  deleteProduct
} = require("../controllers/product.controller");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = new Date().toISOString().replace(/:/g, "-");
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();



const fs = require('fs');

// Function to delete the old image
const deleteOldImage = (imagePath) => {
  try {
    fs.unlinkSync(imagePath); // Deleting the image using fs.unlinkSync
    console.log('Old image deleted successfully');
  } catch (err) {
    console.error('Error deleting old image', err);
  }
};

// Middleware to delete the old image before uploading the new one
const deleteOldImageMiddleware = async (req, res, next) => {
  try {
    // Replace this with a method to retrieve the product from your database or storage
    const product = await getProductById(req.params.productid);

    // Checking if the product and image exist
    if (product && product.image) {
      const oldImagePath = path.join(__dirname, '..', 'images', product.image);
      deleteOldImage(oldImagePath); // Calling the function to delete the old image
    }
    next();
  } catch (err) {
    console.error('Error deleting old image in middleware', err);
    next(err);
  }
};

// router.use(verifyJWT)

router.route('/')
  .post(upload.single("image"), createProduct)
  .get(getAllProducts);

router.route('/getproductbycategory/:categoryid').get(getProductByCategory)
router.route('/:productid').get(getOneProduct).put(deleteOldImageMiddleware, upload.single("image"), updateProduct).delete(authenticateToken, deleteProduct);
router.route('/withoutimage/:productid').put(updateProductWithoutImage)
router.route('/addrecipe/:productid').put(addRecipe)

module.exports = router;
