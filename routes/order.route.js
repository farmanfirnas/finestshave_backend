const express=require("express");
const { Authentication } = require("../middleware/Authentication");
const { Cartmodel } = require("../model/cart.model");
const { Ordermodel } = require("../model/order.model");

const orderRoute=express.Router();


// all orders of specific user

orderRoute.get("/",Authentication,async(req,res)=>{
   const userid=req.body.user;
   
   try
   {    
    const allorders=await Ordermodel.find({user:userid});
    res.status(200).send(allorders)
   }
   catch(err){
    res.status(404).send({"msg":err.message})
   }
})

// Adding item to order

orderRoute.post("/",Authentication,async(req,res)=>{
    const userid=req.body.userid;
    try{
        const alldata=await Cartmodel.find({user:userid})
        const Cartdata=await JSON.parse(alldata);
        let OrdersData=Cartdata.map((e)=>{
            return {product:e.product._id,user:userid}
        })
        const ParsedData=JSON.stringify(OrdersData)
        const newOrder=await Ordermodel.insertMany(ParsedData)
        Cartmodel.deleteMany({user:userid})
        res.status(200).send({"msg":"Order successfull"})
    }catch(err){
        res.status(404).send({"msg":err.message})
    }
})

module.exports={orderRoute}