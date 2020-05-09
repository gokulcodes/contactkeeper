const express = require('express')
const app = express()
const connectDB = require('./config/db')

connectDB();

//init middlewares
app.use(express.json({
    extended: false
}))

//routes
app.use('/api/users', require('./routes/users'))
app.use('/api/contacts', require('./routes/contacts'))
app.use('/api/auth', require('./routes/auth'))


//port
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})