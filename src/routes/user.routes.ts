import express from "express";
import * as UserController from "../controllers/user.controller";

const router = express.Router();

router.get("/:id", UserController.GetUserById);
router.get("/",  UserController.GetUserPagination);
router.patch("/:id", UserController.EditUser);

export default router;