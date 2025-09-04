import express from 'express';
import notesRoutes from './routes/notes.js';
import { errorHandler } from './middlewares/errorHandlers.js';

const app = express();

app.use(express.json());

// Routes
app.use('/api/notes', notesRoutes);


// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
