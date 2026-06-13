import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/config.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import destinationRoutes from './routes/destination.routes.js';
import userRoutes from './routes/user.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import statsRoutes from './routes/stats.routes.js';
import reservationRoutes from './routes/reservation.routes.js';

// Resolve directory paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors({
  origin: config.frontendUrl, // Allow configured frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically (images & documents)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes mapping
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/support/tickets', ticketRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/reservations', reservationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Test deployment endpoint
app.get('/api/test-deploy', (req, res) => {
  res.status(200).json({ 
    message: '¡El backend se ha desplegado correctamente!', 
    timestamp: new Date() 
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Ocurrió un error inesperado en el servidor.',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start Server
app.listen(config.port, () => {
  console.log(`===================================================`);
  console.log(` Scolatour Backend escuchando en el puerto ${config.port}`);
  console.log(` Base de datos conectada en: ${config.databaseUrl}`);
  console.log(` Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===================================================`);
});
