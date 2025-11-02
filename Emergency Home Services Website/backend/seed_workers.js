import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const dbName = "emergency_services";

const workers = [
  { name: "Ravi Kumar", email: "ravi.plumber@example.com", password: "password123", occupation: "plumber" },
  { name: "Sita Rao", email: "sita.electrician@example.com", password: "password123", occupation: "electrician" },
  { name: "Amit Sharma", email: "amit.carpenter@example.com", password: "password123", occupation: "carpenter" }
];

async function run() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection("users");

    for (const w of workers) {
      const existing = await users.findOne({ email: w.email });
      if (existing) {
        console.log("Skipping existing:", w.email);
        continue;
      }
      const hash = await bcrypt.hash(w.password, 10);
      await users.insertOne({
        name: w.name,
        email: w.email,
        password: hash,
        role: "worker",
        occupation: w.occupation,
        createdAt: new Date(),
      });
      console.log("Created worker:", w.email);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
