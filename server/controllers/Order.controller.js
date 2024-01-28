const OrderModel = require('../models/Order.model');

// Create a new order
const createOrder = async (req, res) => {
    try {
        const {
            serial,
            ordernum,
            products,
            subTotal,
            tax,
            deliveryCost,
            total,
            table,
            user,
            createBy,
            casher,
            name,
            address,
            phone,
            waiter,
            deliveryMan,
            help,
            helpStatus,
            status,
            order_type,
            isActive,
            payment_status,
            payment_method,
            payment_date // Include if available in req.body
        } = req.body;

        const newOrder = await OrderModel.create({
            serial,
            ordernum,
            products,
            subTotal,
            tax,
            deliveryCost,
            total,
            table,
            user,
            createBy,
            casher,
            name,
            address,
            phone,
            waiter,
            deliveryMan,
            help,
            helpStatus,
            status,
            order_type,
            isActive,
            payment_status,
            payment_method,
            payment_date // Include if available in req.body
        });

        // io.emit('newOrderNotification', newOrder);
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get an order by ID
const getOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await OrderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

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
