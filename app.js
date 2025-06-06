if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const engine = require("ejs-mate");
const path = require("path");
const Purchase = require("./models/purchase");
const Receipt = require("./models/receipt");

const app = express();

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const dbUrl = process.env.ATLASDB_URL;

// DB Connection


main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// Index Route
app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

app.get("/dashboard", async (req, res) => {
  const allPurchases = await Purchase.find({}).sort({ date: -1 });
  const allReceipts = await Receipt.find({}).sort({ date: -1 });

  const totalSpent = allPurchases.reduce((sum, p) => sum + p.amount, 0);
  const totalReceived = allReceipts.reduce((sum, r) => sum + r.amount, 0);
  const remaining = totalSpent - totalReceived;

  res.render("pages/dashboard.ejs", {
    allPurchases,
    allReceipts,
    totalSpent,
    totalReceived,
    remaining,
  });
});

// New purchase Form
app.get("/newpurchase", (req, res) => {
  res.render("pages/newPurchases.ejs");
});

// Submit form
app.post("/dashboard/purchases", async (req, res) => {
  const { amount, date, description, category } = req.body;
  const newPurchase = new Purchase({
    amount: amount,
    date: date,
    description: description,
    category: category,
  });
  await newPurchase.save();
  res.redirect("/dashboard");
});

// New Receipt Form
app.get("/newreceipt", (req, res) => {
  res.render("pages/newReceipt.ejs");
});

// Submit new receipt
app.post("/dashboard/receipt", async (req, res) => {
  const { amount, date, description, category } = req.body;
  const newReceipt = new Receipt({
    amount: amount,
    date: date,
    description: description,
    category: category,
  });
  await newReceipt.save();
  res.redirect("/dashboard");
});

// render purchase view in detail page
app.get("/purchase/:id", async (req, res) => {
  const purchase = await Purchase.findById(req.params.id);
  res.render("pages/view.ejs", { item: purchase, isPurchase: true });
});

// Edit Purchase
app.get("/edit-purchase/:id", async (req, res) => {
  const purchase = await Purchase.findById(req.params.id);
  res.render("pages/editPurchase", { purchase });
});

app.post("/edit-purchase/:id", async (req, res) => {
  const { date, amount, description, category } = req.body;
  await Purchase.findByIdAndUpdate(req.params.id, {
    date,
    amount,
    description,
    category,
  });
  res.redirect("/dashboard");
});

// Delete Purchase
app.post("/delete-purchase/:id", async (req, res) => {
  await Purchase.findByIdAndDelete(req.params.id);
  res.redirect("/dashboard");
});

// render receipt view in detail page
app.get("/receipt/:id", async (req, res) => {
  const receipt = await Receipt.findById(req.params.id);
  res.render("pages/view.ejs", { item: receipt, isPurchase: false });
});

// Edit Receipt
app.get("/edit-receipt/:id", async (req, res) => {
  const receipt = await Receipt.findById(req.params.id);
  res.render("pages/editReceipt", { receipt });
});

app.post("/edit-receipt/:id", async (req, res) => {
  const { date, amount, description, category } = req.body;
  await Receipt.findByIdAndUpdate(req.params.id, {
    date,
    amount,
    description,
    category,
  });
  res.redirect("/dashboard");
});

// Delete Receipt
app.post("/delete-receipt/:id", async (req, res) => {
  await Receipt.findByIdAndDelete(req.params.id);
  res.redirect("/dashboard");
});


app.listen(8000, () => {
  console.log("Server is listening to post 8000");
});
