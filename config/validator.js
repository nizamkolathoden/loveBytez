const { body } = require('express-validator');
module.exports = {
    registerValidator: [
        body('email')
            .trim()
            .isEmail()
            .withMessage('Email must be a valid email')
            .normalizeEmail()
            .toLowerCase(),
        body('password')
            .trim()
            .isLength(3)
            .withMessage('Password length short, min 6 char required'),

    ],
};