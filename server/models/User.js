import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'editor'],
        default: 'editor'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function (next) {
    // Solo encriptar si la contraseña fue modificada
    if (!this.isModified('password')) return next();

    try {
        // Encriptar la contraseña con salt de 12 rounds
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Método para actualizar last login
userSchema.methods.updateLastLogin = function () {
    this.lastLogin = new Date();
    return this.save();
};

// Actualizar updatedAt en cada modificación
userSchema.pre('findOneAndUpdate', function () {
    this.set({ updatedAt: new Date() });
});

export default mongoose.model('User', userSchema);
