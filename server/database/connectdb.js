const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const url = process.env.MONGODB_URL;

const connectdb =()=>{
    mongoose.connect(url)
    .then((connection) => {console.log(`${connection} Connect success`)})
    .catch((error) => {console.log(`Error connecting to Mongoose server ${error}`)});
} 


module.exports = connectdb;