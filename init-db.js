const mongoose = require('mongoose');
const Anuncio = require('./models/Anuncio');

// Conectar a la base de datos
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
var mongoDB = require("./dbConnection");
// mongoose.connect('mongodb://localhost:27017/nodepop', { useNewUrlParser: true });
// Conectamos a la base de datos
mongoDB();

const fs = require('fs');
const path = require('path');

const anunciosJSON = fs.readFileSync(path.join(__dirname, 'anuncios.json'), 'utf8');
const anuncios = JSON.parse(anunciosJSON);


// Eliminamos todos los anuncios y los volvemos a crear con async/await
async function init() {
  try {
    await Anuncio.deleteMany({});
    console.log('Anuncios eliminados');
    const anunciosCreados = await Anuncio.create(anuncios);
    console.log('Anuncios creados:', anunciosCreados);
    mongoose.connection.close();
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err);
    mongoose.connection.close();
    process.exit(1);
  }
}

init();