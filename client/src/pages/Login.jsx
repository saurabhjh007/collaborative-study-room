import { useState } from "react";

import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await fetch(
        "https://collaborative-study-room-lm66.onrender.com/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data)
        );

        alert("Login Successful");

        navigate("/dashboard");

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center">

      <form
        onSubmit={handleLogin}
        className="
        bg-zinc-900
        p-10
        rounded-2xl
        w-[400px]
      "
      >

        <h1
          className="
          text-white
          text-6xl
          font-bold
          text-center
          mb-10
        "
        >
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="
          w-full
          p-4
          mb-6
          rounded
          bg-black
          text-white
        "
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="
          w-full
          p-4
          mb-6
          rounded
          bg-black
          text-white
        "
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          type="submit"
          className="
          w-full
          bg-blue-700
          text-white
          p-4
          rounded
        "
        >
          Login
        </button>

      </form>

    </div>

  );
}

export default Login;