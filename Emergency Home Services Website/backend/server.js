import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB setup
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const dbName = "emergency_services";
let users, requests;

async function connectDB() {
  await client.connect();
  const db = client.db(dbName);
  users = db.collection("users");
  requests = db.collection("requests");
  console.log("✅ Connected to MongoDB");
}
connectDB();

// Middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  jwt.verify(token, process.env.JWT_SECRET || "secret", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// --- SERVICES (occupations)
const services = [
  { id: "plumber", name: "Plumber", icon: "🔧" },
  { id: "electrician", name: "Electrician", icon: "⚡" },
  { id: "carpenter", name: "Carpenter", icon: "🪚" },
  { id: "painter", name: "Painter", icon: "🎨" },
  { id: "cleaner", name: "Cleaner", icon: "🧹" },
  { id: "ac-repair", name: "AC Repair", icon: "❄" },
  { id: "gardener", name: "Gardener", icon: "🌿" },
];

// --- REGISTER
app.post("/api/register", async (req, res) => {
  const { name, email, password, role, occupation } = req.body;
  const existing = await users.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email exists" });

  const hash = await bcrypt.hash(password, 10);
  await users.insertOne({
    name,
    email,
    password: hash,
    role,
    occupation: role === "worker" ? occupation : "",
    createdAt: new Date(),
  });

  res.json({ message: "Registered successfully" });
});

// --- LOGIN
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await users.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid email" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign(
    { email: user.email, role: user.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  );

  res.json({
    token,
    name: user.name,
    email: user.email,
    role: user.role,
    occupation: user.occupation,
  });
});

// --- LIST SERVICES
app.get("/api/services", (req, res) => {
  res.json(services);
});

// --- LIST WORKERS BY OCCUPATION
app.get("/api/workers", async (req, res) => {
  const { occupation } = req.query;
  const list = await users
    .find({ role: "worker", occupation }, { projection: { password: 0 } })
    .toArray();
  res.json(list);
});

// --- CREATE SERVICE REQUEST
app.post("/api/requests", verifyToken, async (req, res) => {
  const { workerEmail, serviceType, description, location, date, payment } =
    req.body;
  const userEmail = req.user.email;

  const worker = await users.findOne({ email: workerEmail });
  if (!worker) return res.status(404).json({ message: "Worker not found" });

  await requests.insertOne({
    userEmail,
    workerEmail,
    serviceType,
    description,
    location,
    date,
    payment,
    status: "pending",
    createdAt: new Date(),
  });

  res.json({ message: "Request created" });
});

// --- FETCH REQUESTS FOR USER
app.get("/api/requests/user", verifyToken, async (req, res) => {
  const data = await requests.find({ userEmail: req.user.email }).toArray();
  res.json(data);
});

// --- FETCH REQUESTS FOR WORKER
app.get("/api/requests/worker", verifyToken, async (req, res) => {
  const data = await requests.find({ workerEmail: req.user.email }).toArray();
  res.json(data);
});

// --- UPDATE REQUEST STATUS
app.put("/api/requests/:id", verifyToken, async (req, res) => {
  const { status } = req.body;
  await requests.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { status } }
  );
  res.json({ message: "Status updated" });
});

// --- Root route
app.get("/", (req, res) => res.send("🚀 Emergency Home Services API Active!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(🚀 Server running on http://localhost:${PORT})
);