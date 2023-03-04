const appointmentModel = require("../models/appointmentModel")
const doctorModel=require("../models/doctorModel")
const UserModel = require("../models/UserModel")
const getDoctorInfoControler=async(req,res)=>{
try{
const doctor=await doctorModel.findOne({userId:req.body.userId})
res.status(200).send({
    success:true,
    message:"doctor data fetch successfully",
    data:doctor
})
}
catch(err){
    console.log(err)
    res.status(500).send({
        success:false,
        err,
        message:"error in fetching doctor details"
    })
}
}

const updateProfileControler=async(req,res)=>{
try{
const doctor= await doctorModel.findOneAndUpdate({userId:req.body.userId}, req.body)
res.status(200).send({
    success:true,
    message:"Doctor profile Update Issue",
    data:doctor
})
}catch(err){
    console.log(err)
    res.status(500).send({
        success:false,
        message:"Doctor profile update issue",
        err
    })
}
}

const getDoctorByIdController=async(req,res)=>{
try{
const doctor= await doctorModel.findOne({_id:req.body.doctorId})
res.status(200).send({
    success:true,
    message:"Single doc info fetched",
    data:doctor,
})
}
catch(err){
    console.log(err)
    res.status(500).send({
        success:false,
        err,
        message:"error in single doctor "
    })
}
}

const doctorAppoinmentssController=async(req,res)=>{
try{
    const doctor=await doctorModel.findOne({userId:req.body.userId})
const appoinments = await appointmentModel.find({doctorId:doctor._id})
res.status(200).send({
    success:true,
    message:"Doctor appoinment fetch successfully",
    data:appoinments
})
}
catch(err){
    console.log(err)
    res.status(500).send({
        success:false,
        err,
        message:"Error in doctor appoinments"
    })
}
}

const updateStatusController=async(req,res)=>{
try{
    
const {appointmentId, status}=req.body
const appointment=await appointmentModel.findByIdAndUpdate(appointmentId,{status})
const user= await UserModel.findOne({_id:appointment.userId})
const notification=user.notification
notification.push({
    type:"status-updated",
    message:`your appointment has been updated ${status}`,
    onClickPath:"/doctor-appoinmentss"
})
await user.save()
res.status(200).send({
    success:true,
    message:"Appointment status updated"
})
}catch(err){
    console.log(err)
    res.status(500).send({
        success:false,
        err,
        message:"Error in update status"
    })
}
}

module.exports={getDoctorInfoControler, updateProfileControler, getDoctorByIdController, doctorAppoinmentssController, updateStatusController}