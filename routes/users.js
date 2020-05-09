const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const config = require('config')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {
    check,
    validationResult
} = require('express-validator');

//register
router.post('/', [
    check('name', 'please enter name').not().isEmpty(),
    check('password', 'please enter password').isLength({
        min: 6
    }),
    check('email', 'please enter email').isEmail()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    const {
        name,
        password,
        email,
        date
    } = req.body;
    try {
        let user = await User.findOne({
            email
        })
        if (user) {
            return res.status(400).json({
                msg: 'user already exist'
            })
        }
        user = new User({
            name,
            email,
            password,
            date
        })
        const salt = await bcrypt.genSalt(5);
        user.password = await bcrypt.hash(password, salt)

        await user.save()
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 360000
        }, (err, token) => {
            if (err) throw err
            res.status(200).json({
                token
            })
        })

    } catch (err) {
        console.error(err.message)
        res.status(500).json({
            error: 'Server Error'
        })
    }
})

module.exports = router