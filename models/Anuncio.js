const mongoose = require('mongoose');

// Crear esquema de anuncio
const anuncioSchema = mongoose.Schema({
  nombre: String,
  tipo_de_anuncio: String,
  precio: Number,
  foto: String,
  tags: [String]
});

// Crear métodos estáticos para el modelo de anuncio
anuncioSchema.statics.list = function(filtros, skip, limit, cb) {
  const query = Anuncio.find(filtros);
  query.skip(skip);
  query.limit(limit);
  query.exec(cb);
}

// // Crear método estático findById para el modelo de anuncio
// anuncioSchema.statics.findById = function(id, cb) {
//     return this.find({ _id: id }, cb);
// };

// Crear modelo de anuncio
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

// Exportar modelo de anuncio
module.exports = Anuncio;