const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const helmet = require('helmet'); // Security middleware
const cookieParser = require('cookie-parser');
// const http = require('http');
// const socketIo = require('socket.io');


const connectdb = require('./database/connectdb.js');



// Import all route files
const routecategory = require('./router/Category.router.js');
const routecategoryStock = require('./router/CategoryStock.router.js');
const routeproduct = require('./router/Product.router.js');
const routerecipe = require('./router/Recipe.router.js');
const routeuser = require('./router/User.router.js');
const routeemployee = require('./router/Employee.router.js');
const routeshift = require('./router/Shift.router.js');
const routesalarymovement = require('./router/EmployeeSalary.router.js');
const routetable = require('./router/Table.router.js');
const routeorder = require('./router/Order.router.js');
const routeauth = require('./router/Auth.router.js');
const routestockitems = require('./router/StockItem.router.js');
const routestockmanag = require('./router/StockMang.router.js');
const routekitchenconsumption = require('./router/kitchenConsumption.router.js');
const routeexpense = require('./router/Expense.router.js');
const routedailyexpense = require('./router/DailyExpense.router.js');
const routecashRegister = require('./router/CashRegister.router.js');
const routecashMovement = require('./router/CashMovement.router.js');
const routereservation = require('./router/Reservation.router.js');


dotenv.config();
connectdb();

const app = express();
const frontEnd = process.env.FRONR_END

// Security middleware
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));


// Set up middleware
app.use(express.json({
  limit:"100kb"
}));
app.use(cookieParser());

app.set('trust proxy', true);

app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: `${frontEnd}`,
  methods: ['GET', 'POST', 'PUT', 'UPDATE', 'DELETE'],
  credentials: true
}));

// Serve static files
app.use('/', express.static("public"));
app.use('/images', express.static("images"));


// Simple test endpoint to check if the server is running
app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

// Apply the rate limiting middleware to all requests.
app.use("/api",limiter)

// Route requests to appropriate routers
app.use('/api/product', routeproduct)
app.use('/api/recipe', routerecipe)
app.use('/api/category', routecategory);
app.use('/api/user', routeuser);
app.use('/api/employee', routeemployee);
app.use('/api/salarymovement', routesalarymovement);
app.use('/api/shift', routeshift);
app.use('/api/table', routetable);
app.use('/api/order', routeorder);
app.use('/api/auth', routeauth);
app.use('/api/categoryStock', routecategoryStock);
app.use('/api/stockitem', routestockitems);
app.use('/api/stockmanag', routestockmanag);
app.use('/api/kitchenconsumption', routekitchenconsumption);
app.use('/api/expenses', routeexpense);
app.use('/api/dailyexpense', routedailyexpense);
app.use('/api/cashRegister', routecashRegister);
app.use('/api/cashMovement', routecashMovement);
app.use('/api/reservation', routereservation);



// const server = http.createServer(app);


// const io = socketIo(server, {
//   cors: {
//     origin: `${frontEnd}`,
//     methods: ["GET", "POST"],
//     allowedHeaders: ["content-type"]
//   },
// });


// io.on('connect', (socket) => {
//   console.log('New client connected');

//   // Listen for new order notifications
//   socket.on('sendorder', (notification) => {
//     console.log("Notification received:", notification); // تأكيد الاستقبال
//     // Emit the notification back to the client for testing purposes
//     socket.broadcast.emit('reciveorder', notification);
//   });

//   // Listen for disconnect event
//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });


const port = process.env.PORT || 8000;

// server.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



