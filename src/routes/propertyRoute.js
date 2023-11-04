import express from "express";
import {
  createPropertyController,
  getPropertyController,
  getPropertyByPropertyIdController,
  updatePropertyController
} from "../controllers/propertyController.js";
import { isAdmin, requireSignIn } from "../middlewares/Authmiddelware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/create",createPropertyController);
router.get("/getAll",getPropertyController);
router.get("/getById",getPropertyByPropertyIdController)
router.put("/updateProperty",updatePropertyController)

export default router;