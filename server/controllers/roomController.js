import Room from "../models/Room.js";

// CREATE ROOM
export const createRoom = async (req, res) => {

  try {

    const { roomName, userId } = req.body;

    const room = await Room.create({
      roomName,
      createdBy: userId,
      participants: [userId],
    });

    res.status(201).json(room);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// GET ROOMS
export const getRooms = async (req, res) => {

  try {

    const rooms = await Room.find();

    res.status(200).json(rooms);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// DELETE ROOM
export const deleteRoom = async (req, res) => {

  try {

    const room = await Room.findById(
      req.params.id
    );

    if (!room) {

      return res.status(404).json({
        message: "Room not found",
      });

    }

    await room.deleteOne();

    res.status(200).json({
      message: "Room deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};