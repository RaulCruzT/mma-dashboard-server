import express from "express";
import * as GeneraController from "../controllers/genera.controller";

const router = express.Router();

router.post("/", GeneraController.CreateGenera);
router.get("/:id", GeneraController.GetGeneraById);
router.get("/",  GeneraController.GetGeneraPagination);
router.patch("/:id", GeneraController.EditGenera);
router.delete("/:id", GeneraController.DeleteGenera);

export default router;