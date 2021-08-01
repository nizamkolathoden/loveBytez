const router = require("express").Router();

const Target = require("../model/target.Model")

const { verifyAcessToken } = require("../config/jwt.config")

router.get("/", verifyAcessToken, async (req, res) => {

    try {
        const userId = req.payload.aud;

        if (!userId)
            return res.json({ error: "Plz logged in" })

        const fools = await Target.find({ refral: userId })

        res.json({ target: fools })
    
    } catch (err) {

        console.error(err.message)
        res.status(500).json({ error: "Internal Server Error" })
    }



})

module.exports = router;