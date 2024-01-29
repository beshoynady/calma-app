const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const connectdb = require('./database/connectdb.js');


const routecategory = require('./router/Category.router.js');
const routecategoryStock = require('./router/CategoryStock.router.js');
const routeproduct = require('./router/Product.router.js');
const routeuser = require('./router/User.router.js');
const routeemployee = require('./router/Employee.router.js');
const routesalarymovement = require('./router/EmployeeSalary.router.js');
const routetable = require('./router/Table.router.js');
const routeorder = require('./router/Order.router.js');
const routeauth = require('./router/Auth.router.js');
const routestockitems = require('./router/StockItem.router.js');
const routestockmanag = require('./router/StockMang.router.js');
const routekitchenconsumption = require('./router/kitchenConsumption.router.js');
const routeexpense = require('./router/Expense.router.js');
const routedailyexpense = require('./router/DailyExpense.router.js');
const routecashRegister = require('./router/CashRegister,router.js');
const routecashMovement = require('./router/CashMovement,router.js');


dotenv.config();
connectdb();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin : 'https://caviar-demo.vercel.app',
  methods : ['GET', 'POST', 'PUT' , 'UPDATE', 'DELETE'],
  credentials: true 
}));
app.use(cookieParser());
app.use(express.json());
app.use('/',express.static("public"));
app.use('/',express.static("images"));

app.get('/',(req, res) => {
    res.send('beshoy')
})

// app.get('/', function (req, res) {
//     // Cookies that have not been signed
//     console.log('Cookies: ', req.cookies)
  
//     // Cookies that have been signed
//     console.log('Signed Cookies: ', req.signedCookies)
//   })


//ROUTER
app.use('/api/product', routeproduct)
app.use('/api/category', routecategory);
app.use('/api/user', routeuser);
app.use('/api/employee', routeemployee);
app.use('/api/salarymovement', routesalarymovement);
app.use('/api/table', routetable );
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

const port = process.env.PORT|| 8000;

app.listen(port, (req, res) => {
    console.log(`listening on port ${port}`);
});





// const http = require('http');
// const express = require('express');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = require("socket.io")(server, {
//   cors: {
//     origin: "https://caviar-demo.vercel.app",
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });

// io.on('connection', (socket) => {
//   console.log('New client connected');
//   socket.on('newOrder', (data) => {
//     console.log('New order received:', data);
//     io.emit('newOrderNotification', data); 
//   });
//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// server.listen(port, () => {
//   console.log(`listening on port ${port}`);
// });