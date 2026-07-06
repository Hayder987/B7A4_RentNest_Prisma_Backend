import { Router } from "express";
import { propertiesController } from "./property.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/properties", auth(Role.LANDLORD), propertiesController.createProperties);


export const landlordPropertiesRoutes = router;