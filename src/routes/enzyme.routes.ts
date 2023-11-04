import express from "express";
import * as EnzymeController from "../controllers/enzyme.controller";

const router = express.Router();

router.post("/", EnzymeController.CreateEnzyme);
router.get("/:id", EnzymeController.GetEnzymeById);
router.get("/",  EnzymeController.GetEnzymePagination);
router.patch("/:id", EnzymeController.EditEnzyme);
router.delete("/:id", EnzymeController.DeleteEnzyme);

export default router;