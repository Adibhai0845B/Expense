import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://expensebackendfull.onrender.com/api/auth/signup", formData, { withCredentials: true });
      alert("Signup Successful! Please login.");
      navigate("/");
    } catch (err) {
      alert(err.response.data.error || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleSignup}
        className="p-8 bg-white shadow-2xl rounded-2xl w-96"
      >
        <h2 className="mb-6 text-3xl font-bold text-center text-blue-700">
          Sign Up
        </h2>
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full p-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full p-3 font-semibold text-white transition bg-blue-600 rounded hover:bg-blue-700"
        >
          Create Account
        </button>
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <a href="/" className="font-semibold text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
