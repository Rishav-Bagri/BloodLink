import express from 'express';
import router from './routes/route.js';
import cors from "cors"

const app=express()

app.use(cors())
app.use(express.json())
app.use("/api/v1/",router)

app.get('/',(req,res)=>{
    

    res.send("q")
})


app.listen(3000)
