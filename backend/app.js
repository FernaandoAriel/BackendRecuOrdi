import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import estudiantesRoutes from "./src/routes/Estudiantes.js";

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);
app.use(express.json());

app.use(cookieParser());

app.use("/api/estudiantes", estudiantesRoutes)

export default app;