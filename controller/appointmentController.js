import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new ErrorHandler("Please provide a valid email address!", 400));
  }

  if (phone.length !== 11 || !/^\d{11}$/.test(phone)) {
    return next(new ErrorHandler("Phone number must be exactly 11 digits!", 400));
  }

  if (nic.length !== 13 || !/^\d{13}$/.test(nic)) {
    return next(new ErrorHandler("NIC must be exactly 13 digits!", 400));
  }

  const dobDate = new Date(dob);
  const today = new Date();
  if (dobDate >= today) {
    return next(new ErrorHandler("Date of birth must be in the past!", 400));
  }

  const age = today.getFullYear() - dobDate.getFullYear();
  if (age < 1) {
    return next(new ErrorHandler("Patient must be at least 1 year old!", 400));
  }

  const appointmentDate = new Date(appointment_date);
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (appointmentDate < todayStart) {
    return next(new ErrorHandler("Appointment date cannot be in the past!", 400));
  }

  if (hasVisited !== undefined && hasVisited !== null) {
    if (typeof hasVisited === 'string') {
      if (hasVisited !== 'true' && hasVisited !== 'false') {
        return next(new ErrorHandler("hasVisited must be true or false!", 400));
      }
    }
  }

  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });

  if (isConflict.length === 0) {
    return next(new ErrorHandler("Doctor not found in this department!", 404));
  }

  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "Multiple doctors found with same name! Please contact through Email or Phone!",
        400
      )
    );
  }

  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;

  const existingAppointment = await Appointment.findOne({
    patientId,
    doctorId,
    appointment_date,
    status: { $ne: "Rejected" },
  });

  if (existingAppointment) {
    return next(
      new ErrorHandler(
        "You already have an appointment with this doctor on this date!",
        400
      )
    );
  }

  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited: hasVisited === 'true' || hasVisited === true,
    address,
    doctorId,
    patientId,
  });

  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment booked successfully!",
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});


export const getDoctorAppointments = catchAsyncErrors(async (req, res, next) => {
  const doctorId = req.user._id;
  
  const appointments = await Appointment.find({ doctorId });
  
  res.status(200).json({
    success: true,
    appointments,
    count: appointments.length,
  });
});

export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
      appointment,
    });
  }
);

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});