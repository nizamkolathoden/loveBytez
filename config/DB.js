const mongoose = require("mongoose")

const DB = () => {
    try {

        mongoose.connect(process.env.DB,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        },
             () => console.log('Connected To Db'))
    
    } catch (err) {
        
        console.error(err.message)
    }
}

module.exports = DB;