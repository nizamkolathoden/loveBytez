const router = require("express").Router();

const Target = require("../model/target.Model")

const User = require("../model/user.Model")


const { verifyAcessToken } = require("../config/jwt.config")

router.get("/", verifyAcessToken, async (req, res) => {

    try {
        const userId = req.payload.aud;

        if (!userId)
            return res.json({ error: "Plz logged in" })
        
        const userData = await User.findById(userId,{name:1,_id:1}) 
        
        const fools = await Target.find({ refral: userId }).populate('refral',{name:1})

        res.json({ target: fools,user:userData })
    
    } catch (err) {

        console.error(err.message)
        res.status(500).json({ error: "Internal Server Error" })
    }



})

module.exports = router;