import mongoose from 'mongoose';

const {model, Schema} = mongoose;

const refreshTokenSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    isRevoked: {
        type: Boolean,
        default: false
    },
    deviceInfo: {
        userAgent: {type: String, default: null},
        ip: {type: String, default: null}
    }
}, {timestamps: true});

// Índice para limpieza automática de tokens expirados
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Índice para búsqueda rápida por token
refreshTokenSchema.index({ token: 1 });

const RefreshToken = model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
