const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
app.use("/images", express.static(path.join(__dirname, "/images")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = req.body.name;
      cb(null, uniqueSuffix);
    },
  });
  
  const upload = multer({ storage: storage });
  app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded");
  });
  
  
  

// Route Handlers
app.use("/auth", authRoute);
app.use("/users", userRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on h
  ttp://localhost:${PORT}`);
});
