const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// Task 1: Order Preview & Finalize
router.get('/preview', ordersController.applyDiscount, ordersController.getPreview);
router.post('/confirm', ordersController.confirmOrder);
router.post('/add-to-cart/:id', ordersController.addToCart);

// Task 3: Customer Order History
router.get('/my-orders', ordersController.getMyOrdersPage);
router.post('/my-orders/search', ordersController.searchOrders);

// Task 4: Admin routes
router.get('/admin', ordersController.adminGetOrders);
router.post('/admin/update-status', ordersController.adminUpdateStatus);

// Helper for testing: Add to cart
router.get('/add-test-item', (req, res) => {
    if (!req.session.cart) req.session.cart = [];
    req.session.cart.push({
        productId: 101,
        name: "Test Laptop",
        price: 1500,
        quantity: 1
    });
    res.send('Item added to cart! Go to <a href="/order/preview">Order Preview</a>');
});

module.exports = router;
