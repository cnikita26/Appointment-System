const mongoose=require("mongoose")

const doctorSchema= new mongoose.Schema({
    userId:{
        type:String,
        
    },
    firstName:{
        type:String,
        required:[true, 'first name is required']

    },
    lastName:{
        type:String,
        required:[true,"last name is required"]
    },
    phone:{
        type:String,
        required:[true, "phone number is required"]
    },
    email:{
        type:String,
        required:[true, 'email is required']
    },
    website:{
        type:String,
        
    },
    address:{
        type:String,
        required:[true," address is required"]
    },
    specialization:{
        type:String,
        required:[true,"specialization is require"]
    },
    experience:{
        type:String,
        required:[true, 'experince is required']
    },
    feesPerCunsaltation:{
        type:Number,
        required:[true, 'fees is required']
    },
    status:{
        type:String,
      default:'pending'
    },
    timings:{
        type:Object,
        required:[true,"work timing is required"]
    }
},{timestamp:true})

const doctorModel=mongoose.model("doctors", doctorSchema)

module.exports=doctorModel