import express from "express";
import * as ActinobacteriaController from "../controllers/actinobacteria.controller";

const router = express.Router();

router.post("/", ActinobacteriaController.CreateActinobacteria);
router.get("/:id", ActinobacteriaController.GetActinobacteriaById);
router.get("/",  ActinobacteriaController.GetActinobacteriaPagination);
router.patch("/:id", ActinobacteriaController.EditActinobacteria);
router.delete("/:id", ActinobacteriaController.DeleteActinobacteria);
export default router;