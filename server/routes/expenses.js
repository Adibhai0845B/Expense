const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const authenticate = require("../middleware/auth");
function extractPerson(description) {
  const regex = /(?:@|to\s)([\w.-]+@[\w.-]+\.\w+|[\w.-]+)/i;
  const match = description.match(regex);
  return match ? match[1] : null;
}
router.get("/", authenticate, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
router.post("/", authenticate, async (req, res) => {
  try {
    const { amount, description, type } = req.body;

    if (!amount || !type || !["give", "take"].includes(type)) {
      return res.status(400).json({ error: "Invalid transaction data" });
    }

    const mentioned = extractPerson(description);
    if (!mentioned) {
      const transaction = new Transaction({
        user: req.user,
        amount,
        type,
        description,
        person: extractPerson(description),
      });
      await transaction.save();
      return res.status(201).json(transaction);
    }
    const mentionedUser = await User.findOne({
      $or: [{ email: mentioned }, { name: mentioned }],
    });

    if (!mentionedUser) {
      return res.status(404).json({ error: "Mentioned user not found" });
    }
    const sharedAmount = amount / 2;
    const currentUserTxn = new Transaction({
      user: req.user,
      amount: sharedAmount,
      type: "take",
      description,
      person: mentionedUser.email,
    });
    const mentionedUserTxn = new Transaction({
      user: mentionedUser._id,
      amount: sharedAmount,
      type: "give",
      description,
      person: req.user.email,
    });

    await currentUserTxn.save();
    await mentionedUserTxn.save();

    res.status(201).json({ message: "Shared transaction recorded." });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: "Could not save transaction" });
  }
});
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { description } = req.body;
    if (description) {
      req.body.person = extractPerson(description);
    }

    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Expense not found" });

    res.status(200).json(updated);
  } catch (err) {
    console.error("Edit error:", err);
    res.status(500).json({ error: "Could not update expense" });
  }
});
router.delete("/delete/:id", authenticate, async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!deleted) return res.status(404).json({ error: "Expense not found" });

    res.status(200).json({ message: "Expense deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Could not delete expense" });
  }
});
router.get("/summary/monthly", async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          summary: {
            $push: {
              total: "$amount",
              type: "$type",
              description: "$description",
              createdAt: "$createdAt",
            },
          },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    res.status(200).json(summary);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/api/user", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ username: user.name });
  } catch (err) {
    res.status(500).json({ error: "Error fetching user" });
  }
});

module.exports = router;