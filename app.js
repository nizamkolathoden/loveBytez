const express = require("express");

const app = express()

const morgan = require("morgan")

app.use(morgan('dev'))

require("dotenv").config()

//DB
require("./config/DB")()

app.use(express.json())

//routes
//auth
app.use("/auth",require("./routes/auth"))
app.use("/target",require("./routes/target"))
app.use("/user",require("./routes/user"))

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`server running on Port ${PORT}`))