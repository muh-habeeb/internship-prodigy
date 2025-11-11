import { Router } from "express";
import { authorized, authorizedAsAdmin } from "../middleware/authMIddleware.js";
import { createRoom, deleteRoomById, getAllRooms, getRoomById, searchRooms, updateRoomById } from "../controller/room/room.controller.js";
const router = Router();

router.route("/").get(getAllRooms).post(authorized, authorizedAsAdmin, createRoom);


router.route("/:id").get(getRoomById).put(authorized, authorizedAsAdmin, updateRoomById).delete(authorized, authorizedAsAdmin, deleteRoomById);

router.get("/search", searchRooms);
export default router;

