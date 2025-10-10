import express from 'express'
import { authMiddleware } from './middleware.js'
import cors from 'cors'
import {Prismaclient} from 'db/client'

const app = express()
app.use(express.json())
app.use(cors())
const PORT = 8080

//add the website in the database
app.post('/api/v1/website',authMiddleware, async(req,res) =>{
    const userId = req.userId!
    const {url} = req.body
   const data = await Prismaclient.website.create({
        data : {
          userId,
          url
        }
    })
    res.json({
        id : data.id
    })

})

//get the status of the website
app.get('/api/v1/website/status/',authMiddleware,async(req,res) => {
    const websiteId = req.query.websiteId! as unknown as string
    const userId = req.userId!
    const data = await Prismaclient.website.findFirst({
        where : {
            id : websiteId,
            userId,
            disabled : false
        },
        include : {
            ticks : true
        }
    })
    res.json(data)
})

//get all the websites
app.get('/api/v1/websites',authMiddleware,async(req,res) => {
    const userId = req.userId!
    console.log("user id is",userId)
    const data = await Prismaclient.website.findMany({
        where: {
            userId,
            disabled : false
        },
        include : {
            ticks : true
        }
    })
    console.log("this is the data that you need",data)
    res.json({
        websites : data
    })
})

//delete the website
app.delete('/api/v1/website',authMiddleware,async(req,res) => {
    const websiteId = req.query.websiteId! as unknown as string
    const userId = req.userId!
    await Prismaclient.website.update({
        where : {
            id : websiteId,
            userId
        },
        data : {
            disabled : true
        }
    })

    res.json({
        message : "Website deleted successfully"
    })
})
app.listen(PORT,() => {
    console.log(`server running on ${PORT}`)
})