import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsOptions } from "./config/corsOptions.js";

// routes
import authRoutes from "./routes/authRoutes.js";

// custom middleware
import { errorLogger } from "./middlewares/errorLogger.js";
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
dotenv.config();

const port = process.env.PORT || 8081;

// auth, public
app.use("/auth", authRoutes);

// log server error
app.use(errorLogger);

app.listen(port, () =>
  console.log(`App listening on http://localhost:${port}`)
);
