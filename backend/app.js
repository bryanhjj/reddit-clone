import express from "express";
import 'dotenv/config'
import cors from "cors";
import cookieParser from "cookie-parser";
import postRouter from "./routes/postRoutes";
import commentRouter from "./routes/commentRoutes";

const app = express();

app.use(cookieParser());
app.use(express.json());

const allowedOrigins = [
    'http://localhost:5173'
];
const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));

app.use("/post", postRouter);
app.use("/comment", commentRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
