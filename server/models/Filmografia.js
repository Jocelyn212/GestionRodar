import mongoose from 'mongoose';

const filmografiaSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    enum: ['película', 'serie']
  },
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  tituloEn: {
    type: String,
    trim: true
  },
  tituloCat: {
    type: String,
    trim: true
  },
  urlPoster: {
    type: String,
    default: 'https://res.cloudinary.com/dvoh9w1ro/image/upload/v1706542878/imagen_generica_bpgzg5.png'
  },
  sinopsis: {
    type: String,
    required: true
  },
  sinopsisEn: {
    type: String
  },
  sinopsisCat: {
    type: String
  },
  linkImdb: {
    type: String
  },
  urlMakingOf: {
    type: String
  },
  urlYoutube: {
    type: String
  },
  plataformas: {
    type: String
  },
  fecha: {
    type: Number,
    required: true
  },
  duracion: {
    type: Number
  },
  genero: {
    type: String
  },
  generoEn: {
    type: String
  },
  generoCat: {
    type: String
  },
  director: {
    type: String
  },
  guionistas: {
    type: String
  },
  reparto: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Actualizar updatedAt en cada modificación
filmografiaSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

export default mongoose.model('Filmografia', filmografiaSchema);
