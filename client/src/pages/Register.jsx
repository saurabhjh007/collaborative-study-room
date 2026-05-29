import { useState } from "react";

import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      const res = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name,
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

        alert(
          "Registration Successful"
        );

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
        onSubmit={handleRegister}
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
          Register
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="
          w-full
          p-4
          mb-6
          rounded
          bg-black
          text-white
        "
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

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
          Register
        </button>

      </form>

    </div>

  );
}

export default Register;