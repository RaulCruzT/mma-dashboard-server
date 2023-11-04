import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import createHttpError, { isHttpError } from "http-errors";
import { actinobacteriaRoutes, assemblyRoutes, authRoutes, cultureMediumRoutes, enzymeRoutes, generaRoutes, myActinobacteriaRoutes, processedDataRoutes, typeStrainRoutes, usersRoutes } from "./routes";
import { requiresAuth } from "./middleware/auth";
import env from "./utils/validateEnv";

const app = express();

app.use(cors({
    "origin": env.URL_FRONTEND,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "credentials": true,
}));

app.use(morgan("dev"));

app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", requiresAuth, usersRoutes);
app.use("/api/v1/genera", requiresAuth, generaRoutes);
app.use("/api/v1/culturemedium", requiresAuth, cultureMediumRoutes);
app.use("/api/v1/typestrain", requiresAuth, typeStrainRoutes);
app.use("/api/v1/enzyme", requiresAuth, enzymeRoutes);
app.use("/api/v1/actinobacteria", requiresAuth, actinobacteriaRoutes);
app.use("/api/v1/myactinobacteria", requiresAuth, myActinobacteriaRoutes);
app.use("/api/v1/assembly", requiresAuth, assemblyRoutes);
app.use("/api/v1/processeddata", requiresAuth, processedDataRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ message: errorMessage });
});

export default app;