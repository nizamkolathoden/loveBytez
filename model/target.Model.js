const mongoose = require("mongoose")

const {ObjectId} = mongoose.SchemaTypes;

const targetSchema = new mongoose.Schema({
    
    targetName:{
        type:String
    },
    targetCrush:{
        type:String
    },
    refral:{
        type:ObjectId,
        ref:'user'
    }
})

module.exports = mongoose.model("target",targetSchema)