import { Router } from "express";
import userController from "../controllers/user.controller";

const router = Router();

router.get("/", userController.getUsers);
router.get("/edit", userController.editUser);
router.delete("/delete/:id", userController.deleteUser);


export default router;