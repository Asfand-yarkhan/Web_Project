const Order = require('../models/Order');
const Product = require('../models/Product');

// Task 2: Coupon / Discount Middleware
exports.applyDiscount = (req, res, next) => {
    let total = 0;
    const cart = req.session.cart || [];
    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    req.orderTotal = total;
    req.discount = 0;

    const coupon = (req.query && req.query.coupon) || (req.body && req.body.coupon);
    if (coupon === 'SAVE10') {
        req.discount = total * 0.10;
    }

    req.finalTotal = total - req.discount;
    next();
};

exports.addToCart = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });
        if (!product) return res.status(404).send('Product not found');

        if (!req.session.cart) req.session.cart = [];
        
        req.session.cart.push({
            productId: product.id,
            name: product.name,
            price: 100, // Static price since model doesn't have it, or you can add it
            quantity: 1
        });
        
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Task 1: Order Preview & Finalize
exports.getPreview = (req, res) => {
    const cart = req.session.cart || [];
    if (cart.length === 0) {
        return res.send('Your cart is empty. <a href="/">Go back</a>');
    }
    res.render('order-preview', {
        cart: cart,
        total: req.orderTotal,
        discount: req.discount,
        finalTotal: req.finalTotal
    });
};

exports.confirmOrder = async (req, res) => {
    try {
        const { email, coupon } = req.body;
        const cart = req.session.cart || [];
        
        if (!email) return res.status(400).send('Email is required');
        if (cart.length === 0) return res.send('Cart is empty');

        // Re-calculate discount for saving (using logic from middleware)
        let total = 0;
        cart.forEach(item => total += item.price * item.quantity);
        let discount = (coupon === 'SAVE10') ? total * 0.10 : 0;

        const newOrder = new Order({
            customerEmail: email,
            items: cart,
            totalAmount: total,
            discount: discount,
            finalAmount: total - discount,
            status: 'Placed'
        });

        await newOrder.save();
        req.session.cart = []; // Clear cart
        res.render('order-success', { order: newOrder });

    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Task 3: Customer Order History
exports.getMyOrdersPage = (req, res) => {
    res.render('my-orders', { orders: null });
};

exports.searchOrders = async (req, res) => {
    const { email } = req.body;
    const orders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });
    res.render('my-orders', { orders: orders, email: email });
};

// Task 4: Order Status Lifecycle (Admin)
exports.adminGetOrders = async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.render('admin-orders', { orders: orders });
};

exports.adminUpdateStatus = async (req, res) => {
    try {
        const { orderId, newStatus } = req.body;
        const order = await Order.findById(orderId);
        
        if (!order) return res.status(404).send('Order not found');

        const statusCycle = ['Placed', 'Processing', 'Delivered'];
        const currentIndex = statusCycle.indexOf(order.status);
        const nextIndex = statusCycle.indexOf(newStatus);

        // Prevent skipping states
        if (nextIndex !== currentIndex + 1) {
            return res.status(400).send(`Invalid status change! You can only go from ${order.status} to ${statusCycle[currentIndex + 1] || 'none'}.`);
        }

        order.status = newStatus;
        await order.save();
        res.redirect('/order/admin');

    } catch (err) {
        res.status(500).send(err.message);
    }
};
