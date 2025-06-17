import express, { Request, Response } from "express";
import dotenv from "dotenv";

// Import database connection
import connectDB from "../config/dt";

// Import Routes
import Home from "../routes/home/home";

// Import auth Routes
import authRoutes from '../routes/authRoutes';
import { errorHandler } from '../middleware/errorHandler';


dotenv.config(); // Initialize dotenv to load environment variables

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data

// Using Routes
app.use("/", Home); // Use the Home route for the root path
app.use('/api/auth', authRoutes);

// Connect to MongoDB and loog the connection status
connectDB()
  .then(() => {
    console.log("✅ Database connection established successfully.");
  })
  .catch((error) => {
    console.error("❌ Failed to connect to the database:", error.message);
  });

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
