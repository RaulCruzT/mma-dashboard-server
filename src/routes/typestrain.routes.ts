import express from "express";
import * as TypeStrainController from "../controllers/typestrain.controller";

const router = express.Router();

router.post("/", TypeStrainController.CreateTypeStrain);
router.get("/:id", TypeStrainController.GetTypeStrainById);
router.get("/",  TypeStrainController.GetTypeStrainPagination);
router.patch("/:id", TypeStrainController.EditTypeStrain);
router.delete("/:id", TypeStrainController.DeleteTypeStrain);

export default router;