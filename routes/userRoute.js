const express=require("express")

const { loginController, registerController, authController,applyDoctorController,getAllNotificationController, deleteAllNotificationController ,getAllDoctorsListController, bookAppointmentController, bookingAvailbilityController, userAppointmentsController} = require("../controllers/userCtrl")
const authMiddleware = require("../middlewares/authMiddleware")

const router=express.Router()


router.post("/login", loginController)
router.post('/register', registerController)
router.post("/getUserData",authMiddleware, authController)
router.post("/apply-doctor",authMiddleware, applyDoctorController)
router.post("/get-all-notification",authMiddleware, getAllNotificationController)
router.post("/delete-all-notification",authMiddleware, deleteAllNotificationController)


router.get("/getAllDoctorList", authMiddleware, getAllDoctorsListController)
router.post("/book-appointment", authMiddleware, bookAppointmentController)
router.post("/booking-availbility", authMiddleware, bookingAvailbilityController)


router.get("/user-appointments", authMiddleware, userAppointmentsController)
module.exports=router