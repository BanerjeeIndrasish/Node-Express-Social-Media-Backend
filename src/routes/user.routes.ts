import { Router } from "express";
import userController from "../controllers/user.controller";
import { authorize, protect } from "../middlewares/auth";

const router = Router();

router.use(protect)

router.get("/", userController.getUsers);
router.get("/me", userController.getMe);
router.put("/edit", userController.editUser);
router.delete("/delete/:id", userController.deleteUser);


export default router;