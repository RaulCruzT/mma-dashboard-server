import express from "express";
import * as UserController from "../controllers/user.controller";

const router = express.Router();

router.post("/", UserController.CreateUser);

export default router;