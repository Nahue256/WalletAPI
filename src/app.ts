import { resolve } from 'path';
import dotenv from 'dotenv';

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: resolve(__dirname, '../.env.test') });
} else {
  dotenv.config({ path: resolve(__dirname, '../.env') });
}

import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import routes from "./routes";
import { AppDataSource } from "./config/database";

// Create Express app
export const app: Express = express();
const port: number = parseInt(process.env.PORT || "3000", 10);

// Initialize database connection (skip during tests)
if (process.env.NODE_ENV !== 'test' && !AppDataSource.isInitialized) {
  AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization:", err);
      process.exit(1);
    });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api", routes);

// Generic error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  res.status(500).json({
    status: "error",
    message: "Internal server error"
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: "Not Found"
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(
      `API Documentation available at http://localhost:${port}/api-docs`
    );
  });
}
