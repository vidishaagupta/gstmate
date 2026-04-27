import express from 'express';
import cors from 'cors';
import compression from 'compression';
import router from './routes.js';

const app = express();

// Middleware
app.use(compression()); // Compress all responses

// Strict CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://gstmate-pi.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["X-Filename", "Content-Disposition"]
}));

app.use(express.json());

// Simple request logger/timer
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Routes
app.use('/api/v1', router);

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode
    }
  });
});

export default app;
