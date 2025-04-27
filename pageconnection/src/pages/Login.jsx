import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      navigate("/dashboard");
    } 
   catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : "An error occurred, please try again!";
      alert(errorMessage);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleLogin}
        className="p-8 bg-white shadow-2xl rounded-2xl w-96"
      >
        <h2 className="mb-6 text-3xl font-bold text-center text-blue-700">
          Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full p-3 font-semibold text-white transition bg-blue-600 rounded hover:bg-blue-700"
        >
          Login
        </button>
        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <a href="/signup" className="font-semibold text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
