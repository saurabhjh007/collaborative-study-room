import {
  useEffect,
  useRef,
  useState,
} from "react";

import { io } from "socket.io-client";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

const socket = io("http://localhost:5000");

function Room() {

  const { id } = useParams();

  const navigate = useNavigate();

  const roomId = id;

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [activeUsers, setActiveUsers] = useState([]);

  const [typingUser, setTypingUser] = useState("");

  const [customMinutes, setCustomMinutes] =
    useState(25);

  const [time, setTime] = useState(1500);

  const [isRunning, setIsRunning] =
    useState(false);

  const chatRef = useRef(null);

  // JOIN ROOM
  useEffect(() => {

    socket.emit("join_room", {
      roomId,
      username: user.name,
    });

  }, [roomId, user.name]);

  // SOCKET EVENTS
  useEffect(() => {

    // OLD MESSAGES
    socket.on("load_messages", (data) => {

      setMessages(data);

    });

    // NEW MESSAGE
    socket.on("receive_message", (data) => {

      setMessages((prev) => [
        ...prev,
        data,
      ]);

    });

    // USERS
    socket.on("active_users", (users) => {

      setActiveUsers(users);

    });

    // TYPING
    socket.on("show_typing", (username) => {

      setTypingUser(username);

    });

    socket.on("hide_typing", () => {

      setTypingUser("");

    });

    return () => {

      socket.off("load_messages");

      socket.off("receive_message");

      socket.off("active_users");

      socket.off("show_typing");

      socket.off("hide_typing");

    };

  }, []);

  // AUTO SCROLL
  useEffect(() => {

    if (chatRef.current) {

      chatRef.current.scrollTop =
        chatRef.current.scrollHeight;

    }

  }, [messages]);

  // TIMER
  useEffect(() => {

    let interval;

    if (isRunning && time > 0) {

      interval = setInterval(() => {

        setTime((prev) => prev - 1);

      }, 1000);

    }

    return () => clearInterval(interval);

  }, [isRunning, time]);

  // FORMAT TIMER
  const formatTime = () => {

    const minutes = Math.floor(time / 60);

    const seconds = time % 60;

    return `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;

  };

  // APPLY TIMER
  const applyCustomTimer = () => {

    setTime(customMinutes * 60);

    setIsRunning(false);

  };

  // SEND MESSAGE
  const sendMessage = () => {

    if (message !== "") {

      const messageData = {
        roomId,
        author: user.name,
        message,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit(
        "send_message",
        messageData
      );

      socket.emit("stop_typing", {
        roomId,
      });

      setMessage("");

    }

  };

  // COPY LINK
  const copyInviteLink = async () => {

    await navigator.clipboard.writeText(
      window.location.href
    );

    alert("Invite Link Copied");

  };

  // HANDLE TYPING
  const handleTyping = (e) => {

    setMessage(e.target.value);

    socket.emit("typing", {
      roomId,
      username: user.name,
    });

    setTimeout(() => {

      socket.emit("stop_typing", {
        roomId,
      });

    }, 1000);

  };

  return (
    <div className="min-h-screen bg-black text-white p-10">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-5xl font-bold">
          Study Room
        </h1>

        <div className="flex gap-4">

          <button
            onClick={copyInviteLink}
            className="bg-green-700 hover:bg-green-800 px-6 py-3 rounded"
          >
            Copy Invite Link
          </button>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded"
          >
            Back
          </button>

        </div>

      </div>

      {/* USERS */}

      <div className="bg-zinc-900 p-5 rounded-xl mb-8">

        <h2 className="text-2xl font-bold mb-4">
          Active Users (
          {activeUsers.length})
        </h2>

        <div className="flex flex-wrap gap-4">

          {activeUsers.map(
            (user, index) => (

              <div
                key={index}
                className="bg-black px-4 py-2 rounded flex items-center gap-2"
              >

                <div className="w-3 h-3 rounded-full bg-green-500"></div>

                <p>
                  {user.username}
                </p>

              </div>

            )
          )}

        </div>

      </div>

      {/* TIMER */}

      <div className="bg-zinc-900 p-6 rounded-xl mb-8">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-4xl font-bold">
            {formatTime()}
          </h2>

          <div className="flex gap-4">

            <button
              onClick={() =>
                setIsRunning(true)
              }
              className="bg-green-700 hover:bg-green-800 px-6 py-3 rounded"
            >
              Start
            </button>

            <button
              onClick={() =>
                setIsRunning(false)
              }
              className="bg-red-700 hover:bg-red-800 px-6 py-3 rounded"
            >
              Pause
            </button>

            <button
              onClick={() => {
                setTime(
                  customMinutes * 60
                );

                setIsRunning(false);
              }}
              className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded"
            >
              Reset
            </button>

          </div>

        </div>

        {/* CUSTOM TIMER */}

        <div className="flex gap-4">

          <input
            type="number"
            placeholder="Enter Minutes"
            className="bg-black p-4 rounded outline-none w-[200px]"
            value={customMinutes}
            onChange={(e) =>
              setCustomMinutes(
                e.target.value
              )
            }
          />

          <button
            onClick={applyCustomTimer}
            className="bg-blue-700 hover:bg-blue-800 px-6 rounded"
          >
            Set Timer
          </button>

        </div>

      </div>

      {/* CHAT */}

      <div
        ref={chatRef}
        className="bg-zinc-900 p-5 rounded-xl h-[400px] overflow-y-auto mb-3"
      >

        {messages.length === 0 ? (

          <p className="text-zinc-400">
            No messages yet
          </p>

        ) : (

          messages.map((msg, index) => (

            <div
              key={index}
              className="bg-black p-4 rounded mb-3"
            >

              <div className="flex justify-between mb-2">

                <h3 className="font-bold text-blue-400">
                  {msg.author}
                </h3>

                <p className="text-xs text-zinc-500">
                  {msg.time}
                </p>

              </div>

              <p>
                {msg.message}
              </p>

            </div>

          ))

        )}

      </div>

      {/* TYPING */}

      <p className="text-zinc-400 mb-4 h-5">

        {typingUser &&
          `${typingUser} is typing...`}

      </p>

      {/* INPUT */}

      <div className="flex gap-4">

        <input
          type="text"
          placeholder="Enter Message"
          className="bg-zinc-900 p-4 rounded flex-1 outline-none"
          value={message}
          onChange={handleTyping}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          onClick={sendMessage}
          className="bg-green-700 hover:bg-green-800 px-8 rounded"
        >
          Send
        </button>

      </div>

    </div>
  );
}

export default Room;