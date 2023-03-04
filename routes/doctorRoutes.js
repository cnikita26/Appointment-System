const express=require("express")
const { getDoctorInfoControler, updateProfileControler, getDoctorByIdController, doctorAppoinmentssController, updateStatusController } = require("../controllers/doctorCtrl")
const authMiddleware = require("../middlewares/authMiddleware")

const router=express.Router()

router.post("/getDoctorInfo", authMiddleware, getDoctorInfoControler)

router.post("/updateProfile", authMiddleware, updateProfileControler)

router.post("/getDoctorById", authMiddleware, getDoctorByIdController)

router.get("/doctor-appoinmentss", authMiddleware, doctorAppoinmentssController)

router.post("/update-status", authMiddleware, updateStatusController)

module.exports=router