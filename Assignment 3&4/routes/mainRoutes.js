const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.get('/', mainController.home);
router.get('/courses', mainController.courses);
router.get('/lessons-plan', mainController.lessonsPlan);
router.get('/checkout', mainController.checkout);


module.exports = router;
