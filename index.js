import express from "express";
import cors from "cors";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test API
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Hello from EduAble Backend 👋"
  });
});

// server start
app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
});
