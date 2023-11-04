import express from "express";
import * as ProcessedDataController from "../controllers/processeddata.controller";

const router = express.Router();

router.post("/", ProcessedDataController.CreateProcessedData);
router.get("/:id", ProcessedDataController.GetProcessedDataById);
router.get("/",  ProcessedDataController.GetProcessedDataPagination);
router.patch("/:id", ProcessedDataController.EditProcessedData);
router.delete("/:id", ProcessedDataController.DeleteProcessedData);

export default router;