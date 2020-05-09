const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const {
    check,
    validationResult
} = require('express-validator');
const User = require('../models/User')
const Contacts = require('../models/contacts')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
    try {
        const contacts = await Contacts.find({
            user: req.user.id
        }).sort({
            date: -1
        })
        res.json(contacts)

    } catch (err) {
        console.log(err)
        res.status(400).send('Internal Server Error')
    }

})

router.post('/', [auth, [
    check('name', 'please enter name').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    const {
        name,
        email,
        phone,
        type
    } = req.body
    try {
        const contact = new Contacts({
            name,
            email,
            phone,
            type,
            user: req.user.id
        })
        await contact.save()
        res.json(contact)
    } catch (err) {
        console.error(err.message)
        res.status(401).send("internal Server Error")
    }
})

router.put('/:id', (req, res) => {
    res.send('update contacts')
})

router.delete('/:id', (req, res) => {
    res.send('delete contacts')
})
module.exports = router