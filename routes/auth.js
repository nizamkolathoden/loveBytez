const router = require("express").Router();

const User = require("../model/user.Model")

const { validationResult } = require("express-validator")

const { registerValidator } = require("../config/validator")

const bcrypt = require("bcrypt")

const { siginAccessToken, siginForgotToken, verifyPasswordToken } = require("../config/jwt.config")

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

                res.json({ token, id: newUser._id })
            })
        })



    } catch (err) {
        console.error(err.message)
    }

})

//@route dns/auth/login
//@desc for login

router.post("/login", async (req, res) => {


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

        res.json({ token, id: userFound._id });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" })
    }


})

//@route dns/auth/forgot-password
//@desc for forgotpassword

router.post("/forgot-password", async (req, res) => {

    try {
        const { email } = req.body

        if (!email)
            return res.status(404).json({ error: "Enter Your Registered Email" })

        const userFound = await User.findOne({ email })

        if (!userFound)
            return res.status(404).json({ error: "Please Enter Your Registerd Email" })

        const jwtSecret = process.env.Forgot_Token
        const secret = jwtSecret + userFound.password;

        // console.log(secret)

        const token = await siginForgotToken(userFound._id, secret)
        // console.log(token)
        //change

        const url = `http://localhost:3000/change-password/${userFound._id}/${token}`

        console.log(url)

        const subject = 'Forgot Password';

        const text = `Hola ${userFound.name}  🤗`

        const html = `<h3> Hola ${userFound.name} if you forgot your password don't worry 🤗
                here is the rest link 
                </h3>
                <a href=${url}>Rest Password</a>
                   
                `
        Mail(userFound.email, subject, text, html)

        res.json(`Hey ${userFound.name} We Sent You Password Reset Link To Your Registerd Email`)


    } catch (err) {

        console.error(err)

        res.status(500).json({ error: "Internal Server Error " })
    }

})


//@route dns/auth/change-password/:id/:token
//@desc for changepassword


router.post("/change-password/:id/:token", async (req, res) => {

    try {
        const { password, password1 } = req.body;

        const { id, token } = req.params;



        if (!password || password !== password1)
            return res.status(406).json({ error: "Enter valid Password" })

        const userData = await User.findById(id)

        const secret = process.env.Forgot_Token + userData.password;

        const userId = await verifyPasswordToken(token, secret)


        const saltRound = 10;
            
        bcrypt.genSalt(saltRound, (err, salt) => {
                console.log(salt)
            if (err) {
                console.error("gen salt", err.message);
                return res.status(500).json({ error: "Internal Server Error" })
            }

            bcrypt.hash(password,salt, async (err, hashedPassword) => {

                if (err) {
                    console.error(err)
                    return res.status(500).json({ error: "Internal Server Error" })
                }

                const updateUserPassword = await User.findByIdAndUpdate(userId, {
                    password: hashedPassword

                })

                res.json('Sucessfuly Updated Your Password')
            })


        })


    } catch (err) {

        console.error(err.message)
        res.json({ error: err.message })
    }



})






module.exports = router;