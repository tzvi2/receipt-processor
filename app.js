const express = require("express")
const cors = require('cors')

const receiptsRoutes = require('./routes/receiptsRoutes')

const app = express()
app.use(express.json())
app.use(cors())

app.use('/receipts', receiptsRoutes)

app.listen(3000, () => console.log('Listening on port 3000.'))