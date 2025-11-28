// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import {User}  from "./models/userSchema.js";

// dotenv.config();

// const createAdmin = async () => {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGO_URL);
//     console.log(" Connected to MongoDB");

//     // Check if admin already exists
//     const existing = await User.findOne({ email: "admin@gmail.com" });
//     if (existing) {
//       console.log("Admin already exists with this email!");
//       process.exit(0);
//     }

//     // Create admin
//     const admin = await User.create({
//       firstName: "Admin",
//       lastName: "User",
//       email: "admin@gmail.com",
//       phone: "03001234567",
//       nic: "4220112345678",
//       dob: new Date("1990-01-01"),
//       gender: "Male",
//       password: "12345678", 
//       role: "Admin",
//     });

//     console.log(" Admin Created Successfully!\n");
//     console.log("Login Credentials:");
//     console.log("==================");
//     console.log("Email:", admin.email);
//     console.log("Password: 12345678");
//     console.log("Role: Admin");
//     console.log(" You can now login at /login\n");
    
//     process.exit(0);
//   } catch (error) {
//     console.error(" Error creating admin:", error.message);
//     process.exit(1);
//   }
// };

// createAdmin();


// run this in terminal 
// node createAdmin.js