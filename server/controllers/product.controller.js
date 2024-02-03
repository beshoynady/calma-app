const ProductModel = require('../models/Product.model.js');

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { productname, productprice, productdescription, productcategoryid ,avaliable} = req.body;
    const image = req.file.filename;

    const newProduct = await ProductModel.create({
      name: productname,
      description: productdescription,
      price: productprice,
      image: image,
      category: productcategoryid,
      avaliable
    });

    res.status(200).json(newProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};

// Add a recipe to a product
const addRecipe = async (req, res) => {
  try {
    const productId = req.params.productid;
    const { Recipe, totalcost } = req.body;

    const productRecipe = await ProductModel.findByIdAndUpdate(
      { _id: productId },
      { Recipe, totalcost }
    );

    res.status(200).json({ Recipe: productRecipe });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Retrieve all products
const getAllProducts = async (req, res) => {
  try {
    const allProducts = await ProductModel.find({});
    res.status(200).json(allProducts);
  } catch (err) {
    res.status(400).json(err);
  }
};

// Retrieve products by category
const getProductByCategory = async (req, res) => {
  try {
    const categoryid = req.params.categoryid;
    const products = await ProductModel.find({ category: categoryid });
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

// Retrieve a single product by its ID
const getOneProduct = async (req, res) => {
  try {
    const productid = req.params.productid;
    const oneProduct = await ProductModel.findById(productid);
    res.status(200).json(oneProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};

// Update a product by its ID
const updateProduct = async (req, res) => {
  try {
    const productid = req.params.productid;
    const {
      productname,
      productprice,
      productdescription,
      productcategoryid,
      productdiscount,
      sales,
      avaliable
    } = req.body;

    const image = req.file.filename;
    const priceAfterDiscount =productdiscount>0? productprice - productdiscount:0;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      { _id: productid },
      {
        name: productname,
        description: productdescription,
        price: productprice,
        category: productcategoryid,
        discount: productdiscount,
        priceAfterDiscount: priceAfterDiscount,
        sales: sales,
        image: image,
        avaliable
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};

// Update a product by its ID without changing the image
const updateProductWithoutImage = async (req, res) => {
  try {
    const productid = req.params.productid;
    const {
      productname,
      productprice,
      productdescription,
      productcategoryid,
      productdiscount,
      sales,
      avaliable
    } = req.body;

    const priceAfterDiscount =productdiscount>0? productprice - productdiscount:0;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      { _id: productid },
      {
        name: productname,
        description: productdescription,
        price: productprice,
        category: productcategoryid,
        discount: productdiscount,
        priceAfterDiscount: priceAfterDiscount,
        sales: sales,
        avaliable
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};

// Delete a product by its ID
const deleteProduct = async (req, res) => {
  try {
    const productid = req.params.productid;
    const productdelete = await ProductModel.findByIdAndDelete(productid);
    res.status(200).send("Product deleted successfully").json(productdelete);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  createProduct,
  addRecipe,
  getAllProducts,
  getProductByCategory,
  getOneProduct,
  updateProduct,
  updateProductWithoutImage,
  deleteProduct
};
