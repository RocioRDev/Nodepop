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


// Eliminamos todos los anuncios y los volvemos a crear
Anuncio.deleteMany({}, (err) => {
    if (err) {
      console.error('Error al eliminar anuncios:', err);
    } else {
      console.log('Anuncios eliminados');
      Anuncio.create(anuncios, (err, anunciosCreados) => {
        if (err) {
          console.error('Error al crear anuncios:', err);
        } else {
          console.log('Anuncios creados:', anunciosCreados);
        }
        mongoose.connection.close();
      });
    }    
  });



