const path = require('path');
const User = require('../models/User');

exports.home = (req, res) => {
    res.render('index');
};

exports.courses = (req, res) => {
    res.render('courses');
};

exports.lessonsPlan = (req, res) => {
    res.render('lessons-plan');
};

exports.checkout = (req, res) => {
    res.render('checkout');
};

exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, address, city, zip } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already registered. <a href="/checkout">Go back</a>');
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            zip
        });

        await newUser.save();
        res.send('Signup successful! User registered in Database. <a href="/">Go back to Home</a>');
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
};


