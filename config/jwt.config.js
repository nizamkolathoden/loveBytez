
const jwt = require("jsonwebtoken")

module.exports = {

    siginAccessToken: (userId) => {

        return new Promise((resolve, reject) => {

            const secret = process.env.Acces_Token_Secret

            // const secret = process.env.Acess_Token_Secret
            const payload = {
                aud: userId
            }


            const options = {
                issuer: "LoveBytes"
            }

            jwt.sign(payload, secret, options, (err, token) => {

                if (err) {
                    console.error(err.message)
                    reject({ message: 'Un Authrized User', code: 401 })
                }

                resolve(token);
            })
        })

    },

    verifyAcessToken:(req, res, next) => {

        try {
            const authHeader = req.headers['authorization'];

            // console.log(authHeader)

            const secret = process.env.Acces_Token_Secret;

            if (!authHeader) return res.status(401).json({ error: "Un Authrized User" });

            const bearerToken = authHeader.split(' ');

            const token = bearerToken[1];

            jwt.verify(token, secret, (err, payload) => {

                if (err) {

                    const message = err.name = 'JsonWebTokenError' ? 'Un Authrized User' : err.message;

                    return res.status(401).json({ error: message });
                }

                req.payload = payload;

                next();
            })
        } catch (err) {
            console.error(err.message)
        }

    },
    siginForgotToken: (userId,secret) => {

        return new Promise((resolve, reject) => {

            

            // const secret = process.env.Acess_Token_Secret
            const payload = {
                aud: userId
            }


            const options = {
                issuer: "LoveBytes",
                expiresIn: '2h',

            }

            jwt.sign(payload, secret, options, (err, token) => {

                if (err) {
                    console.error(err.message)
                    reject({ message: 'Un Authrized User', code: 401 })
                }

                resolve(token);
            })
        })

    },


    verifyPasswordToken: (passwordToken,secret) => {

        // const secret =process.env.Verfiy_Email_Secret

        return new Promise((resolve, reject) => {


            jwt.verify(passwordToken, secret, (err, payload) => {

                if (err) {

                    console.log(err.message);
                    reject({ message: 'Link Expired', code: 401 });

                }
                const userId = payload.aud;
                resolve(userId)


            })
        })

    },

}