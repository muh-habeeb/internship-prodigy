import { Router } from "express";
const router = Router();
import { authorized, authorizedAsAdmin } from "../middleware/authMIddleware.js";
import {
  createUser,
  deleteUser,
  getUser,
  getAllUsers,
  updateUser,
  loginUser,
} from "../controller/user.controller.js";
router
  .route("/")
  .get(authorized, authorizedAsAdmin, getAllUsers);

router.post("/register", createUser);
router.post("/login", loginUser);


router
  .route("/profile/:id")
  .get(authorized, getUser)
  .put(authorized, updateUser)
  .delete(authorized, authorizedAsAdmin, deleteUser);
router
  .route("/:id")
  .get(authorized, authorizedAsAdmin, getUser)
  .put(authorized, authorizedAsAdmin, updateUser)
  .delete(authorized, authorizedAsAdmin, deleteUser);
export default router;
