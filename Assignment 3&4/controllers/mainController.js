const path = require('path');

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


