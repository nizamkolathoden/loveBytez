const router = require("express").Router()

const Target = require("../model/target.Model")

const User = require("../model/user.Model")

const Mail = require("../config/mail")

router.post("/:userId",async(req,res)=>{

    try {
        const {targetName,targetCrush} = req.body

    const refral = req.params.userId

    const admin = await User.findById(refral)

    if(!targetName,!targetCrush)
            return res.status(404).json({error:"enter Your Name/Crush Name"})

    const newTarget = Target({
        targetName,
        targetCrush,
        refral
    }).save()

    

    const subject = 'Target found Email';

                const text = `Hola ${admin.name} Your friend ${targetName} Sucessfuly fooled His/Her Crush Name ${targetCrush}  🤗`

                const html = `<h3> Hola ${admin.name} Your friend ${targetName} Sucessfuly fooled His/Her Crush Name ${targetCrush}  🤗</h3>
                <h3>🤗 voila</h3>
                   
                `

                const Useremail = admin.email;

                Mail(Useremail, subject, text, html)

                res.json(`Your Friend ${admin.name} is Sucessfully fooled You`)

    } catch (err) {

        console.error(err.message)
        res.status(500).json({error:"Internal Server Error"})
        
    }

    
})


module.exports = router;