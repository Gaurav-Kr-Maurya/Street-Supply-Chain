const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory databases
let supplierStock = [
  {
    item: "Onion",
    quality: "A+",
    quantity: 100,
    price: 20,
    areas: "Delhi, Noida, Ghaziabad"
  },
  {
    item: "Potato",
    quality: "B",
    quantity: 150,
    price: 15,
    areas: "Lucknow, Kanpur"
  }
];

let vendorOrders = [];
let suppliers = [];
let contactMessages = [];
let stockDB = [];

let supplierProfile = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+91 9876543210",
  address: "New Delhi, India",
  business: "Doe Enterprises",
  dob: "January 1, 1990",
  gender: "Male",
  title: "Product Designer",
  imageData: ""
};

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// HTML Routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/order", (req, res) => res.sendFile(path.join(__dirname, "public", "ordernow.html")));
app.get("/payment", (req, res) => res.sendFile(path.join(__dirname, "public", "payment.html")));
app.get("/payment-link", (req, res) => res.sendFile(path.join(__dirname, "public", "paymentLink.html")));
app.get("/processing", (req, res) => res.sendFile(path.join(__dirname, "public", "processing.html")));

// Supplier Stock APIs
app.get("/api/supplierStock", (req, res) => res.json(supplierStock));

app.post("/api/supplierStock", (req, res) => {
  const stock = req.body;
  if (!stock || !Array.isArray(stock)) {
    return res.status(400).json({ message: "Invalid stock data!" });
  }
  supplierStock = stock;
  res.status(201).json({ message: "Stock saved successfully." });
});

// Vendor Orders APIs
app.post("/api/vendorOrder", (req, res) => {
  const { vendorName, product, quantity, contact, address } = req.body;
  if (!vendorName || !product || !quantity || !contact || !address) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  vendorOrders.push(req.body);
  res.status(201).json({ message: "Order received", order: req.body });
});

app.get("/api/vendorOrders", (req, res) => res.json(vendorOrders));

// Supplier Register
app.post("/api/supplier/register", (req, res) => {
  const { name, email, phone, business, location, password } = req.body;
  if (!name || !email || !phone || !business || !location || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const exists = suppliers.find(s => s.email.toLowerCase() === email.toLowerCase());
  if (exists) return res.status(409).json({ message: "Email already registered!" });

  const newSupplier = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    business: business.trim(),
    location: location.trim(),
    password: password.trim()
  };

  suppliers.push(newSupplier);
  res.status(201).json({ message: "Supplier registered successfully!" });
});

// Supplier Login
app.post("/api/supplier/login", (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required!" });
  }

  const supplier = suppliers.find(s =>
    s.email.toLowerCase() === email && s.password === password
  );

  if (!supplier) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.status(200).json({ message: "Login successful", supplier });
});

// Stock APIs
app.get("/api/stock", (req, res) => {
  res.json(stockDB);
});

app.post("/api/stock", (req, res) => {
  const { item, quantity, price } = req.body;
  if (!item || !quantity || !price) {
    return res.status(400).json({ message: "Missing stock data!" });
  }

  const newStock = { ...req.body, id: Date.now().toString() };
  stockDB.push(newStock);
  res.status(201).json({ message: "Stock added!", stock: newStock });
});

app.delete("/api/stock/:id", (req, res) => {
  const { id } = req.params;
  stockDB = stockDB.filter(stock => stock.id !== id);
  res.json({ message: "Stock deleted!" });
});

// Contact Form
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  contactMessages.push({
    name,
    email,
    message,
    receivedAt: new Date().toISOString()
  });
  res.status(200).json({ message: "Message received successfully!" });
});

// Customer Order
app.post("/submit-order", (req, res) => {
  const { vendorName, product, quantity, contact, address } = req.body;
  if (!vendorName || !product || !quantity || !contact || !address) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  console.log("📦 New Order Received:", req.body);
  res.status(200).json({ message: "Order received successfully!" });
});

// Supplier Profile APIs
app.get("/api/supplier/profile", (req, res) => {
  res.json(supplierProfile);
});

app.put("/api/supplier/profile", (req, res) => {
  supplierProfile = { ...supplierProfile, ...req.body };
  res.json(supplierProfile);
});

// Get profile by email
app.get("/api/profile/:email", (req, res) => {
  const email = req.params.email.toLowerCase();
  const profile = suppliers.find(s => s.email.toLowerCase() === email);
  if (!profile) {
    return res.status(404).json({ message: "Profile not found." });
  }
  res.status(200).json(profile);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
