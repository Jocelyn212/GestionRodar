import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, '..', '.env') });

// Importar rutas
import authRoutes from './routes/auth.js';
import filmografiasRoutes from './routes/filmografias.js';

const app = express();

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://gestion-rodar.vercel.app',
    'https://*.vercel.app' // Permitir todos los dominios de Vercel
  ],
  credentials: true // Permitir cookies
}));app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Conectar a MongoDB
const connectDB = async () => {
    try {
        const mongoUri = process.env.VITE_MONGO_URI || process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error('MONGO_URI no está definida en las variables de entorno');
        }

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ Conexión exitosa a MongoDB Atlas');

        // Crear usuario admin por defecto si no existe
        await createDefaultAdmin();

    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};

// Función para crear usuario admin por defecto
const createDefaultAdmin = async () => {
    try {
        const { default: User } = await import('./models/User.js');

        // Verificar si ya existe el usuario Rodar2025
        const adminExists = await User.findOne({ username: 'Rodar2025' });

        if (!adminExists) {
            // Crear el nuevo usuario admin
            const defaultAdmin = new User({
                username: 'Rodar2025',
                email: 'admin@filmografias.com',
                password: '#Rodar2025@Rodar',
                role: 'admin'
            });

            await defaultAdmin.save();
            console.log('✅ Usuario admin Rodar2025 creado correctamente');
            console.log('   Username: Rodar2025');
            console.log('   Password: #Rodar2025@Rodar');
        } else {
            console.log('ℹ️  Usuario admin Rodar2025 ya existe');
        }

    } catch (error) {
        console.error('Error creando usuario admin:', error);
    }
};

// Event listeners para MongoDB
mongoose.connection.on('error', (err) => {
    console.error('❌ Error de conexión MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️  Desconectado de MongoDB');
});

mongoose.connection.on('reconnected', () => {
    console.log('✅ Reconectado a MongoDB');
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api', filmografiasRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'conectada' : 'desconectada'
    });
});

// Ruta para manejar rutas no encontradas
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Middleware de manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);

    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
});

// Conectar a la base de datos
connectDB();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 API disponible en http://localhost:${PORT}/api`);
    console.log(`🏥 Health check en http://localhost:${PORT}/api/health`);
});
