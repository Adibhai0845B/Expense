import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import axios from "axios";
const Dashboard = () => {
  const [formState, setFormState] = useState({ amount: "", description: "", type: "give" });
  const [expenses, setExpenses] = useState([]);
  const [editing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState([]);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  const fetchExpenses = () => {
    fetch("https://expensebackendfull.onrender.com/api/expenses", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setExpenses(data))
      .catch((err) => console.error("Error fetching expenses:", err));
  };

  const fetchSummary = () => {
    fetch("https://expensebackendfull.onrender.com/api/expenses/summary/monthly", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch monthly summary");
        return res.json();
      })
      .then((data) => setSummary(data))
      .catch((err) => console.error("Error fetching summary:", err));
  };

  const handleAddExpense = () => {
    const { amount, description, type } = formState;
    if (!amount || !description) {
      alert("Please enter both amount and description");
      return;
    }
    setIsLoading(true);
    fetch("https://expensebackendfull.onrender.com/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ amount: Number(amount), description, type }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add expense");
        return res.json();
      })
      .then(() => {
        fetchExpenses();
        fetchSummary();
        setFormState({ amount: "", description: "", type: "give" });
      })
      .catch((err) => {
        console.error("Error adding expense:", err);
        alert("Failed to add expense. Please try again.");
      })
      .finally(() => setIsLoading(false));
  };

  const handleUpdate = () => {
    const { amount, description, type } = formState;
    if (!amount || !description) {
      alert("Please enter both amount and description");
      return;
    }
    setIsLoading(true);
    fetch(`https://expensebackendfull.onrender.com/api/expenses/${currentExpense._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ amount: Number(amount), description, type }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update expense");
        return res.json();
      })
      .then(() => {
        fetchExpenses();
        fetchSummary();
        setFormState({ amount: "", description: "", type: "give" });
        setEditing(false);
      })
      .catch((err) => {
        console.error("Error updating expense:", err);
        alert("Failed to update expense. Please try again.");
      })
      .finally(() => setIsLoading(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    fetch(`https://expensebackendfull.onrender.com/api/expenses/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete expense");
        return res.json();
      })
      .then(() => {
        fetchExpenses();
        fetchSummary();
      })
      .catch((err) => {
        console.error("Error deleting expense:", err);
        alert("Failed to delete expense. Please try again.");
      });
  };

  const handleEdit = (expense) => {
    setEditing(true);
    setFormState({ amount: expense.amount, description: expense.description, type: expense.type });
    setCurrentExpense(expense);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormState({ amount: "", description: "", type: "give" });
    setCurrentExpense(null);
  };
  useEffect(() => {
    axios
      .get("https://expensebackendfull.onrender.com/api/expenses/api/user", { withCredentials: true })
      .then((response) => {
        setUsername(response.data.username);
      })
      .catch((err) => {
        setError("Failed to fetch user data.");
      });
  }, []);
  return (
    <div className="min-h-screen pb-16 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-100">
      <div className="py-16 mb-6 text-center text-white shadow-lg bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-b-3xl">
        <h1 className="mb-2 text-5xl font-extrabold animate-slideInDown">Welcome to SmartTrack 💸</h1>
        <p className="text-lg animate-fadeInSlow">Track, split, and manage your expenses with ease!</p>
      </div>

      <motion.div
        className="max-w-5xl p-4 mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >     <h1 className="mr-96">This is my username  {username}</h1>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="text-blue-500 animate-pulse" size={28} />
          <h1 className="text-4xl font-bold tracking-tight text-center">Expense Tracker</h1>
        </div>
        <p className="mb-6 italic text-center text-gray-700 animate-fadeInSlow">
          “Beware of little expenses. A small leak will sink a great ship.” – Benjamin Franklin
        </p>
        <p className="mb-4 text-center text-gray-500 animate-fadeIn">Use @ or to (email or username) to split with another user</p>
        <motion.div className="grid gap-4 mb-6 sm:grid-cols-3" initial={{ y: 10 }} animate={{ y: 0 }}>
          <input
            type="number"
            placeholder="Amount"
            value={formState.amount}
            onChange={(e) => setFormState({ ...formState, amount: e.target.value })}
            className="p-3 border border-gray-300 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Description"
            value={formState.description}
            onChange={(e) => setFormState({ ...formState, description: e.target.value })}
            className="p-3 border border-gray-300 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={formState.type}
            onChange={(e) => setFormState({ ...formState, type: e.target.value })}
            className="p-3 border border-gray-300 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-400"
          >
            <option value="give">Give</option>
            <option value="take">Take</option>
          </select>
        </motion.div>
        <div className="flex flex-wrap gap-3 mb-6">
          {editing ? (
            <>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleUpdate}
                className="px-5 py-2 text-white transition-all duration-300 ease-in-out bg-yellow-600 rounded-xl hover:bg-yellow-700"
              >
                Update Expense
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="px-5 py-2 text-white transition-all duration-300 ease-in-out bg-gray-500 rounded-xl hover:bg-gray-600"
              >
                Cancel
              </motion.button>
            </>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddExpense}
              disabled={isLoading}
              className={`px-5 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Adding..." : "Add Expense"}
            </motion.button>
          )}
        </div>
        <h2 className="mb-4 text-2xl font-semibold">Your Expenses</h2>
        <motion.div layout className="grid gap-4">
          {expenses.map((expense) => (
            <Card
              key={expense._id}
              className="p-4 transition duration-300 border shadow rounded-xl hover:shadow-xl hover:scale-[1.02] bg-white/80 backdrop-blur-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">{expense.description}</p>
                  {expense.person && (
                    <p className="text-sm text-gray-500">
                      {expense.type === "give" ? "To" : "From"}:{" "}
                      <span className="font-semibold">{expense.person}</span>
                    </p>
                  )}
                  <p className={`mt-1 font-medium ${expense.type === "give" ? "text-red-600" : "text-green-700"}`}>
                    {expense.type === "give" ? "-" : "+"} ₹{expense.amount}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="px-3 py-1 text-white transition-all duration-300 bg-yellow-600 rounded hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="px-3 py-1 text-white transition-all duration-300 bg-red-600 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>

        <h2 className="mt-10 mb-2 text-2xl font-semibold">📊 Monthly Summary</h2>
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 mt-6 border shadow-xl backdrop-blur-md bg-white/60 rounded-2xl"
        >
          {summary.length === 0 ? (
            <li className="text-gray-500">No summary data available.</li>
          ) : (
            summary.map((item, idx) => {
              const totalAmount = item.summary.reduce((acc, curr) => acc + curr.total, 0);
              const monthName = new Date(item._id.year, item._id.month - 1).toLocaleString("default", {
                month: "long",
              });
              return (
                <li key={idx} className="mb-1 font-medium">
                  {monthName}: ₹{totalAmount}
                </li>
              );
            })
          )}
        </motion.ul>
      </motion.div>
    </div>
  );
};
export default Dashboard;
