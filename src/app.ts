import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { ApiRoutes } from './routes';
import { ErrorHandlerMiddleware } from './middlewares';
import { Logger } from './utils';
import { HttpStatus } from './constants';

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logging via morgan
const morganStream = {
  write: (message: string): void => {
    Logger.info(message.trim());
  },
};
app.use(morgan('combined', { stream: morganStream }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    errors: ['Rate limit exceeded'],
  },
});
app.use(limiter);

// API routes
app.use('/api', ApiRoutes);

// Global error handler (must be last)
app.use(ErrorHandlerMiddleware.handle);

// 404 handler
app.use((_req, res) => {
  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    message: 'Route not found',
    errors: [`${_req.method} ${_req.originalUrl} is not a valid endpoint`],
  });
});

export { app };
