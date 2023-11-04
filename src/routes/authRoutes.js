import express from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  deleteUserController
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/Authmiddelware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//DELTE USER
router.delete("/delete/:U_id", deleteUserController);

//forget-password
//Forgot Password || POST
router.put("/forgot-password", forgotPasswordController);
export default router;