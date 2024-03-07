import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsOptions } from "./config/corsOptions.js";
import cookieParser from "cookie-parser";

// routes
import authRoutes from "./routes/authRoutes.js";

// custom middleware
import { errorLogger } from "./middlewares/errorLogger.js";

dotenv.config();
const app = express();

// middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8081;

// auth, public
app.use("/auth", authRoutes);

// log server error
app.use(errorLogger);

app.listen(port, () =>
  console.log(`App listening on http://localhost:${port}`)
);
