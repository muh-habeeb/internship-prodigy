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
  logout,

} from "../controller/user/user.controller.js";
import { deleteUserById, updateUserById } from "../controller/user/admin/adminController.js";
router
  .route("/")
  .get(authorized, authorizedAsAdmin, getAllUsers);

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logout);


router
  .route("/profile")
  .get(authorized, getUser)
  .put(authorized, updateUser)
  .delete(authorized, deleteUser);

//admin only routes
router
  .route("/:id")
  .get(authorized, authorizedAsAdmin, getUser)
  .put(authorized, authorizedAsAdmin, updateUserById)
  .delete(authorized, authorizedAsAdmin, deleteUserById);
export default router;
