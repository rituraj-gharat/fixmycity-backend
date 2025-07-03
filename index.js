const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

prisma.$connect()
  .then(() => console.log("✅ Connected to Supabase DB"))
  .catch((err) => console.error("❌ Supabase DB connection failed:", err));


app.use(cors());
app.use(express.json());

app.post("/api/report", async (req, res) => {
  const { category, description, latitude, longitude, photoUrl } = req.body;
  console.log("Full payload:", req.body);
  console.log("Incoming photoUrl:", photoUrl);
  console.log("Payload received at backend:", {
    category, description, latitude, longitude, photoUrl
  });


  try {
    const report = await prisma.issue.create({
      data: {
        category,
        description,
        latitude,
        longitude,
        photoUrl,
      },
    });
    res.status(201).json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit issue." });
  }
});

app.get("/api/issues", async (_, res) => {
  try {
    const issues = await prisma.issue.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(issues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch issues." });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

