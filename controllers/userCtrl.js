const userModel=require("../models/UserModel")
const bcrypt=require('bcryptjs')
const UserModel = require("../models/UserModel")
const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
const doctorModel=require('../models/doctorModel')
const appointmentModel=require("../models/appointmentModel")
const moment= require("moment")

dotenv.config()






const registerController= async (req,res)=>{
// const abc=req.body
// console.log(abc)
    try{

        const existingUser= await userModel.findOne({email:req.body.email})
        if(existingUser){
            return res.status(200).send({message:"user already exists", success:false})
        }
        const password=req.body.password
        const salt =await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        req.body.password=hashedPassword
        const newUser=new UserModel(req.body)
        console.log(newUser,"...")
        await newUser.save()
        res.status(201).send({message:"register successfull", success:true})

    }
    catch(err){
        console.log(err)
        res.status(500).send({success:false, message:`Register controller ${err.message}`})
    }
}

const loginController=async (req,res)=>{
    try{
    const user =await UserModel.findOne({email:req.body.email})
    if(!user){
        return res.send({message:'user not found', success:false})
    }
    const isMatch=await bcrypt.compare(req.body.password, user.password)
    if(!isMatch){
        return res.status(200).send({message:"invalid credentials", success:false})
    }
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET, {expiresIn:"1d"})
    res.status(200).send({message:"login success", success:true,token})
    }
    catch(err){
        console.log(err)
        res.send({message:`Error in login CTRL ${err.message}`})
    }
    }
    

const authController=async(req,res)=>{
    try{
const user=await UserModel.findById({_id:req.body.userId})
user.password=undefined
if(!user){
    return res.status(200).send({message:"user not found",success:false})
}else{
    res.status(200).send({
        success:true, 
        data:user
    })
}
    }catch(err){
        console.log(err)
        res.send({message:'auth error', success:false,err})
    }
}

const applyDoctorController=async(req,res)=>{
try{
const newDoctor= await doctorModel({...req.body, status:"pending"})
await newDoctor.save()
const adminUser=await UserModel.findOne({isAdmin:true})
const notification=adminUser.notification
notification.push({
    type:"apply-doctor-request",
    message:`${newDoctor.firstName} ${newDoctor.lastName} has applied for doctor account`,
    data:{
        doctorId:newDoctor._id,
        name:newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath:"/admin/doctors"
    }
})
await UserModel.findByIdAndUpdate(adminUser._id,{notification})
res.status(201).send({
    success:true
,
message:"Doctor account applied succefully"})
}
catch(err){
    console.log(err)
    res.send({success:false, err, message:"error while applyng for doctor"})
}

}

const getAllNotificationController=async (req,res)=>{

    try{
const user=await UserModel.findOne({_id:req.body.userId})
const seennotification=user.seennotification
const notification=user.notification
seennotification.push(...notification)
user.notification=[]
user.seennotification=notification
const updatedUser=await user.save()
res.status(200).send({
    success:true,
    message:"all notification marked as read",
    data:updatedUser
})
    }
    catch(err){
        console.log(err)
        res.status(500).send({
            message:"Error in notification",
            success:false,
            err
        })
    }

}
const deleteAllNotificationController=async(req,res)=>{
    try{
        const user=await UserModel.findOne({_id:req.body.userId})
        user.notification=[]
        user.seennotification=[]
        const updatedUser= await user.save()
        updatedUser.password=undefined
        res.status(200).send({
            success:true,
            message:"notification deleted successfully",
            data:updatedUser
        })
    }catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            message:"unable to delete all notifications"
        })
    }

}

const getAllDoctorsListController=async(req,res)=>{
    try{
        const doctors= await doctorModel.find({status:"approved"})
        res.status(200).send({
            success:true,
            message:"doctors lists fetched successfully",
            data:doctors
        })
}catch(err){
    console.log(err)
    res.status(500).send({
        success:false,
        err,
        message:"error while fetching documents"
    })
}
}

const bookAppointmentController=async(req,res)=>{
try{
    req.body.date=moment(req.body.date,"DD-MM-YYYY").toISOString()
    req.body.time=moment(req.body.time,"HH:mm").toISOString()
req.body.status="pending"
const newAppointment= new appointmentModel(req.body)
await newAppointment.save()
const user= await UserModel.findOne({_id:req.body.doctorInfo.userId})
user.notification.push({
    type:"New-appointment-request",
    message:`A new Appoinment Request from ${req.body.userInfo.name}`,
    onClickPath:"/user/appointments"
})
await user.save()
res.status(200).send({
    success:true,
    message:"Appointment Book successFully",


})

}catch(err){
    console.log(err)
    res.status(500).send({
        success:false,
        err,
        message:"Errror while booking appoinment"
    })
}
}

const bookingAvailbilityController=async(req,res)=>{
try{
const date=moment(req.body.date,"DD-MM-YYYY").toISOString()
const fromTime=moment(req.body.time,"HH:mm").subtract(1,"hours").toISOString()
const toTime=moment(req.body.time,"HH:mm").add(1,"hours").toISOString()
const doctorId=req.body.doctorId
const appoinments= await appointmentModel.find({doctorId,date,time:{
    $gte:fromTime,$lte:toTime
}})
if(appoinments.length>0){
    return res.status(200).send({
        message:"Appointment Available",
        success:true
    })
}else{
    return res.status(200).send({
        success:true,
        message:"Appointment Available "
    })
}
}
catch(err){
    console.log(err)
    res.status(500).send({
        success:false,
        err,
        message:"error in booking"
    })
}
}
const userAppointmentsController=async(req,res)=>{
try{
const appointments= await appointmentModel.find({userId:req.body.userId})
res.status(200).send({
    success:true,
    message:"Users appointment get succcessfully ",
    data:appointments
})
}
catch(err){
    console.log(err)
    res.status(500).send({
        success:false,
        err,
        message:"Error in user appointments"
    })
}
}
module.exports={loginController, registerController, authController,applyDoctorController, getAllNotificationController, deleteAllNotificationController, getAllDoctorsListController, bookAppointmentController, bookingAvailbilityController, userAppointmentsController}