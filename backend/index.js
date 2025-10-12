import express from 'express';
import prisma from './DB/db.js';
const app=express()
app.get('/',(req,res)=>{
    

    res.send("q")
})
app.listen(3000)
