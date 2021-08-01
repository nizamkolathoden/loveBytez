const express = require("express");

const app = express()

const morgan = require("morgan")

app.use(morgan('dev'))

require("dotenv").config()

//DB
require("./config/DB")()

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`server running on Port ${PORT}`))