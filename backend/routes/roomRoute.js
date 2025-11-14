import { Router } from "express";
import { authorized, authorizedAsAdmin } from "../middleware/authMIddleware.js";
import { createRoom, deleteRoomById, getAvailableRooms, getRoomById, searchRooms, updateRoomById } from "../controller/room/room.controller.js";
const router = Router();

router.route("/")
.get(getAvailableRooms)
.post(authorized, authorizedAsAdmin, createRoom);

router.get("/search", searchRooms);

router.route("/:id")
.get(getRoomById)
.put(authorized, authorizedAsAdmin, updateRoomById)
.delete(authorized, authorizedAsAdmin, deleteRoomById);

export default router;

