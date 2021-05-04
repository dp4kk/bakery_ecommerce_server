const express=require('express')
const cors=require('cors')
require("dotenv").config();

const stripe = require("stripe")(process.env.API_SEC_KEY);
const uuid=require('uuid').v4

const app=express()

console.log(process.env.API_SEC_KEY)
//middleware
app.use(express.json())
app.use(cors())


//route
app.get("/",(req,res)=>{
    res.send("CHECK CHECK CHECK")
})

app.post("/stripe",(req,res)=>{
    const{cartItems,token,totalAmount}=req.body;
    console.log(cartItems)
    

    const idempotencyKey=uuid()

    return stripe.customers.create({
        email:token.email,
        source:token.id
    })
    .then(customers =>{
        stripe.charges.create({
            amount:totalAmount,
            currency:'inr',
            customer:customers.id,
            description:'Ecommerce payment',
            address:{
                city:token.address_city,
                state:token.address_state,
                zip:token.address_zip,
                address:token.address_line1
                    
            }
            
        },{idempotencyKey})
    })
    .then(result=>res.status(200).json(result))
    .catch(err=>console.log(err))
})

//listen
app.listen(process.env.PORT || 4000,()=>{console.log('listening at port 4000')})