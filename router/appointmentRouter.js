import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  getDoctorAppointments,
  getPatientAppointments,  // ✅ Import
  postAppointment,
  updateAppointmentStatus,
} from "../controller/appointmentController.js";
import {
  isAdminAuthenticated,
  isDoctorAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isPatientAuthenticated, postAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.get("/doctor/my-appointments", isDoctorAuthenticated, getDoctorAppointments);
router.get("/patient/my-appointments", isPatientAuthenticated, getPatientAppointments);  // ✅ PATIENT ROUTE
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);

export default router