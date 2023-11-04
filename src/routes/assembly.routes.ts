import express from "express";
import * as AssemblyController from "../controllers/assembly.controller";

const router = express.Router();

router.post("/", AssemblyController.CreateAssembly);
router.get("/:id", AssemblyController.GetAssemblyById);
router.get("/",  AssemblyController.GetAssemblyPagination);
router.patch("/:id", AssemblyController.EditAssembly);
router.delete("/:id", AssemblyController.DeleteAssembly);

export default router;