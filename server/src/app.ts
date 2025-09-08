import express from 'express';
import notesRoutes from './routes/notes';
import authRoutes from './routes/auth';

import { errorHandler } from './middlewares/errorHandlers';

const app = express();

app.use(express.json());

// Routes
app.use('/api/notes', notesRoutes);
app.use('/api/auth', authRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
