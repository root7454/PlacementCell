//userRoutes.js
import express from "express";
import { login, register, logout, getUser, updateUser, deleteUser, getUsersExceptTPO } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);
router.put("/update/:id", isAuthenticated, updateUser);
router.delete("/delete/:id", isAuthenticated, deleteUser);
router.post("/register", register);

// New route to get all users except TPO
router.get("/users-except-tpo", isAuthenticated, getUsersExceptTPO);

export default router;
