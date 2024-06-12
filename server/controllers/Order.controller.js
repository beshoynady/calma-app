const OrderModel = require('../models/Order.model');


// Create a new order
const createOrder = async (req, res) => {
    try {
        // Destructure the request body
        const {
            serial,
            ordernum,
            products,
            subTotal,
            tax,
            addition,
            discount,
            deliveryCost,
            total,
            table,
            user,
            createdBy,
            casher,
            name,
            address,
            phone,
            waiter,
            deliveryMan,
            help,
            helpStatus,
            status,
            orderType,
            isActive,
            payment_status,
            payment_method,
            payment_date
        } = req.body;

        // Validate required fields
        if (!serial || !products || !subTotal || !total) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create a new order
        const newOrder = await OrderModel.create({
            serial,
            ordernum,
            products,
            subTotal,
            tax,
            addition,
            discount,
            deliveryCost,
            total,
            table,
            user,
            createdBy,
            casher,
            name,
            address,
            phone,
            waiter,
            deliveryMan,
            help,
            helpStatus,
            status,
            orderType,
            isActive,
            payment_status,
            payment_method,
            payment_date
        });

        // Check if the order was created successfully
        if (newOrder) {
            return res.status(201).json(newOrder);
        } else {
            throw new Error('Failed to create new order');
        }
    } catch (err) {
        // Differentiate between validation errors and other errors
        if (err.name === 'ValidationError') {
            return res.status(422).json({ error: 'Validation error', details: err.errors });
        }

        // General error handling
        res.status(500).json({ error: err.message });
    }
};


const getOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await OrderModel.findById(orderId)
            .populate('products.productid')
            .populate('products.sizeId')
            .populate('products.extras.extraDetails.extraId')
            .populate('table')
            .populate('user')
            .populate('createdBy')
            .populate('cashier')
            .populate('waiter')
            .populate('deliveryPerson');
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};



const getOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find()
            .populate('products.productid')
            .populate('products.sizeId')
            .populate('products.extras.extraDetails.extraId')
            .populate('table')
            .populate('user')
            .populate('createdBy')
            .populate('cashier')
            .populate('waiter')
            .populate('deliveryPerson');

        if (!orders || orders.length === 0) {
            return res.status(404).json({ error: 'No orders found' });
        }

        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        if (err.name === 'ValidationError') {
            res.status(422).json({ error: 'Invalid data format', details: err.errors });
        } else {
            res.status(500).json({ error: 'Internal server error', details: err.message });
        }
    }
};



// Get an order by ID
// const getOrder = async (req, res) => {
//     try {
//         const orderId = req.params.id;
//         const order = await OrderModel.findById(orderId)
//             .populate('products.productid')
//             .populate('products.sizeId')
//             .populate('products.extras.extraId')
//             .populate('table')
//             .populate('user')
//             .populate('createdBy')
//             .populate('casher')
//             .populate('waiter')
//             .populate('deliveryMan');
//         if (!order) {
//             return res.status(404).json({ error: 'Order not found' });
//         }
//         res.status(200).json(order);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// };

// // Get all orders
// const getOrders = async (req, res) => {
//     try {
//         // Fetch orders from the database with population of references
//         const orders = await OrderModel.find()
//             .populate('products.productid')
//             .populate('products.sizeId')
//             .populate('products.extras.extraId')
//             .populate('table')
//             .populate('user')
//             .populate('createdBy')
//             .populate('casher')
//             .populate('waiter')
//             .populate('deliveryMan');

//         // Check if there are any orders
//         if (!orders || orders.length === 0) {
//             return res.status(404).json({ error: 'No orders found' });
//         }

//         // Respond with success and the orders data
//         res.status(200).json(orders);
//     } catch (err) {
//         // Log the error for debugging purposes
//         console.error('Error fetching orders:', err);

//         // Check the type of error and respond with appropriate message
//         if (err.name === 'ValidationError') {
//             res.status(422).json({ error: 'Invalid data format', details: err.errors });
//         } else {
//             // Respond with a general error message for unexpected errors
//             res.status(500).json({ error: 'Internal server error', details: err.message });
//         }
//     }
// };


// Update an order by ID
const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete an order by ID
const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const deletedOrder = await OrderModel.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(deletedOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    createOrder,
    getOrder,
    getOrders,
    updateOrder,
    deleteOrder
};
