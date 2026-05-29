import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const [roomName, setRoomName] =
    useState("");

  const [rooms, setRooms] =
    useState([]);

  const [darkMode, setDarkMode] =
    useState(true);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // LOAD THEME
  useEffect(() => {

    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme === "light") {

      setDarkMode(false);

    }

  }, []);

  // SAVE THEME
  const toggleTheme = () => {

    if (darkMode) {

      localStorage.setItem(
        "theme",
        "light"
      );

    } else {

      localStorage.setItem(
        "theme",
        "dark"
      );

    }

    setDarkMode(!darkMode);

  };

  // FETCH ROOMS
  const fetchRooms = async () => {

    try {

      const res = await fetch(
        "http://localhost:5000/api/rooms"
      );

      const data = await res.json();

      setRooms(data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    fetchRooms();

  }, []);

  // CREATE ROOM
  const createRoom = async () => {

    if (!roomName) {

      return alert("Enter Room Name");

    }

    try {

      const res = await fetch(
        "http://localhost:5000/api/rooms",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            roomName,
            userId: user._id,
          }),
        }
      );

      if (res.ok) {

        setRoomName("");

        fetchRooms();

      }

    } catch (error) {

      console.log(error);

    }
  };

  // DELETE ROOM
  const deleteRoom = async (
    roomId
  ) => {

    try {

      await fetch(
        `http://localhost:5000/api/rooms/${roomId}`,
        {
          method: "DELETE",
        }
      );

      fetchRooms();

    } catch (error) {

      console.log(error);

    }
  };

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/");

  };

  // COPY LINK
  const copyLink = (roomId) => {

    navigator.clipboard.writeText(
      `http://localhost:5173/room/${roomId}`
    );

    alert("Link Copied");

  };

  return (

    <div
      className={`min-h-screen w-full px-8 py-8 transition-all duration-300 ${
        darkMode
          ? "bg-black text-white"
          : "bg-zinc-200 text-black"
      }`}
    >

      {/* TOP BAR */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-5 mb-10">

        <div>

          <h1 className="text-5xl font-bold">

            Study Dashboard

          </h1>

          <p className="mt-3 text-gray-500">

            Welcome {user?.name}

          </p>

        </div>

        <div className="flex gap-4">

          <button
            onClick={toggleTheme}
            className="bg-zinc-800 text-white px-6 py-3 rounded-2xl hover:scale-105 transition-all"
          >

            {darkMode
              ? "☀ Light"
              : "🌙 Dark"}

          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-3 rounded-2xl hover:bg-red-700 hover:scale-105 transition-all"
          >

            Logout

          </button>

        </div>

      </div>

      {/* CREATE ROOM */}

      <div className="flex flex-col md:flex-row gap-5 mb-12">

        <input
          type="text"
          placeholder="Enter Room Name"
          value={roomName}
          onChange={(e) =>
            setRoomName(
              e.target.value
            )
          }
          className={`flex-1 p-5 rounded-3xl outline-none text-lg ${
            darkMode
              ? "bg-zinc-900 text-white"
              : "bg-white text-black"
          }`}
        />

        <button
          onClick={createRoom}
          className="bg-blue-600 text-white px-10 py-5 rounded-3xl hover:bg-blue-700 hover:scale-105 transition-all"
        >

          Create Room

        </button>

      </div>

      {/* ROOM GRID */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {rooms.map((room) => (

          <div
            key={room._id}
            className={`p-8 rounded-3xl shadow-lg hover:scale-105 transition-all ${
              darkMode
                ? "bg-zinc-900"
                : "bg-white"
            }`}
          >

            <h2 className="text-4xl font-bold mb-4">

              {room.roomName}

            </h2>

            <p className="text-gray-500 mb-2">

              📚 Active Study Room

            </p>

            <p className="text-gray-500 mb-6">

              👥 Online Users:{" "}
              {room.participants
                ?.length || 0}

            </p>

            <div className="flex flex-wrap gap-4">

              <button
                onClick={() =>
                  navigate(
                    `/room/${room._id}`
                  )
                }
                className="bg-blue-600 text-white px-5 py-3 rounded-2xl hover:bg-blue-700 transition-all"
              >

                Join Room

              </button>

              <button
                onClick={() =>
                  copyLink(room._id)
                }
                className="bg-green-600 text-white px-5 py-3 rounded-2xl hover:bg-green-700 transition-all"
              >

                Copy Link

              </button>

              <button
                onClick={() =>
                  deleteRoom(room._id)
                }
                className="border border-red-500 text-red-500 px-5 py-3 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
              >

                Delete

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}

export default Dashboard;