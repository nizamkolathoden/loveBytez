const router = require("express").Router();

const User = require("../model/user.Model")

const { validationResult } = require("express-validator")

const { registerValidator } = require("../config/validator")

const bcrypt = require("bcrypt")

const {siginAccessToken} = require("../config/jwt.config")

const Mail = require("../config/mail")



//@route dns/auth/register
//@desc for registering

router.post("/register", registerValidator, async (req, res) => {

    try {
        const { name, email, password } = req.body

        if (!name || !email || !password)
            return res.status(404).json({ error: "Enter All reauired Fields" })

        const error = validationResult(req)
        console.log(error)

        if (!error.isEmpty())
            return res.json(error)

        const exsitingUserEmail = await User.findOne({ email })

        if (exsitingUserEmail)
            return res.status(409).json({ error: "User already Registerd" })

        const saltRound = 10;



        bcrypt.genSalt(saltRound, (err, salt) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            bcrypt.hash(password, salt, async (err, hashedPassword) => {
                if (err) {
                    console.log(err.message);
                    return res.status(500).json({ error: "Internal Sever Error" })
                }

                const newUser = await User({
                    name,
                    email,
                    password: hashedPassword
                }).save()

                const token = await siginAccessToken(newUser._id)

                const subject = 'Welcome Email';

                const text = `Hola ${name} Thanks For Register in loveBytez Prank Your friends 🤗`

                const html = `<h3> Hola ${name} Thanks For Register in LoveBytez</h3>
                <h3>Prank your Friends 🤗 voila</h3>
                   
                `

                const Useremail = newUser.email;

                Mail(Useremail, subject, text, html)
                
                res.json({token})
            })
        })



    } catch (err) {
        console.error(err.message)
    }

})

router.post("/login",async(req,res)=>{

    
        try {
            const { email, password } = req.body;

            if (!email || !password)
                return res.status(404).json({ error: "Enter email/Password" })


            const userFound = await User.findOne({ email });

            if (!userFound)
                return res.status(403).json({ error: "Wrong Email/Password" });

            const isMatch = await bcrypt.compare(password, userFound.password);

            if (!isMatch)
                return res.status(403).json({ error: "Wrong Email/Password" });

            // if (!userFound.isVerfiyed)
            //     return res.status(403).json({ error: "User Didn't verify the email" })

            
            // const refSecret = process.env.User_RefreshToken_Secret;

            const token = await siginAccessToken(userFound._id);
            
            res.json({token});

        } catch (err) {
            console.log(err.message);
            res.status(500).json({ error: "Internal Server Error"})
        }


})







module.exports = router;