const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const config = require('config')
const User = require('../models/User')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const {
    check,
    validationResult
} = require('express-validator');

router.get('/', auth, async (req, res) => {
    const users = await User.findById(req.user.id).select('password')
    res.json(users)
})
router.post('/', [
    check('email', 'please enter email').isEmail(),
    check('password', 'please enter password').exists(),
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    const {
        email,
        password
    } = req.body
    try {
        let user = await User.findOne({
            email
        })
        if (!user) {
            res.status(400).send("Invalid  Credentails")
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(400).send("Invalid Credentails for password")
        }
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
        console.log(err.message)
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router