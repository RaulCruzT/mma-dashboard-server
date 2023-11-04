import express from "express";
import * as CultureMediumController from "../controllers/culturemedium.controller";

const router = express.Router();

router.post("/", CultureMediumController.CreateCultureMedium);
router.get("/:id", CultureMediumController.GetCultureMediumById);
router.get("/",  CultureMediumController.GetCultureMediumPagination);
router.patch("/:id", CultureMediumController.EditCultureMedium);
router.delete("/:id", CultureMediumController.DeleteCultureMedium);

export default router;