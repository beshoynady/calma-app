const path = require("path");
const fs = require('fs');

const ProductModel = require('../models/Product.model.js');

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { productname, productprice, productdescription, productcategoryid ,avaliable ,hasSizes,sizes} = req.body;
    const image = req.file?req.file.filename: null;

    const newProduct = await ProductModel.create({
      name: productname,
      description: productdescription,
      price: productprice,
      image: image,
      category: productcategoryid,
      avaliable,
      hasSizes,
      sizes
    });

    res.status(200).json(newProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};



// Retrieve all products
const getAllProducts = async (req, res) => {
  try {
    const allProducts = await ProductModel.find({}).populate('category');
    res.status(200).json(allProducts);
  } catch (err) {
    res.status(400).json(err);
  }
};

// Retrieve products by category
const getProductByCategory = async (req, res) => {
  try {
    const categoryid = req.params.categoryid;
    const products = await ProductModel.find({ category: categoryid }).populate('category');
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

// Retrieve a single product by its ID
const getOneProduct = async (req, res) => {
  try {
    const productid = req.params.productid;
    const product = await ProductModel.findById(productid).populate('category');;
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Update a product by its ID
const updateProduct = async (req, res) => {
  try {
    const productid = req.params.productid;
    const {
      productname,
      productdescription,
      productcategoryid,
      productprice,
      productdiscount,
      priceAfterDiscount,
      avaliable,
      hasSizes,
      sizes
    } = req.body;

    if (req.file) {
      const image = req.file.filename;

      const product = await ProductModel.findById(productid);
      if (product && product.image) {
        const oldImagePath = path.join(__dirname, '..', 'images', product.image);
        fs.unlinkSync(oldImagePath);
        console.log('Old image deleted successfully');
      }
    }

    const existingProduct = await ProductModel.findById(productid);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      { _id: productid },
      {
        name: productname,
        description: productdescription,
        price: productprice,
        category: productcategoryid,
        discount: productdiscount,
        priceAfterDiscount,
        hasSizes,
        sizes,
        // استخدم الاسم الجديد للصورة إذا كانت موجودة
        image: req.file ? req.file.filename : existingProduct.image,
        avaliable
      },
      { new: true }
    );

    // إرجاع المنتج المحدث
    res.status(200).json(updatedProduct);
  } catch (error) {
    // معالجة الأخطاء
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
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
      priceAfterDiscount,
      avaliable,
      hasSizes,
      sizes,
  } = req.body;


    const updatedProduct = await ProductModel.findByIdAndUpdate(
      { _id: productid },
      {
        name: productname,
        description: productdescription,
        price: productprice,
        category: productcategoryid,
        discount: productdiscount,
        priceAfterDiscount,
        avaliable,
        hasSizes,
        sizes,
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
    const product = await ProductModel.findById(productid);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await ProductModel.findByIdAndDelete(productid);
    res.status(200).json({ message: 'Product deleted successfully', deletedProduct: product });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductByCategory,
  getOneProduct,
  updateProduct,
  updateProductWithoutImage,
  deleteProduct
};
