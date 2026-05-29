import express from "express";

import {
  createRoom,
  getRooms,
  deleteRoom,
} from "../controllers/roomController.js";

const router = express.Router();

router.post("/", createRoom);

router.get("/", getRooms);

router.delete("/:id", deleteRoom);

export default router;