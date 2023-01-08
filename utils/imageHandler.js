const path = require('path');
const fs = require('fs');

// Configurar Multer
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdir('./public/images',(err)=>{
            cb(null, './public/images');
         })      
    },
    // // Añaadir la fecha al nombre del archivo
    filename: (req, file, cb) => {
        // Imprimir por consola el nombre del archivo sin la extensión        
        console.log(path.parse(file.originalname).name);
        // crear un nombre único para el archivo con la fecha actual y la extensión del archivo original y devolverlo
        let nombre = path.parse(file.originalname).name + "_" +  Date.now() + path.extname(file.originalname);
        cb(null, nombre);      
    }    
  });
  
  const upload = multer({
    storage: storage,     
    limits: { fileSize: 5242880 } //5MB max
});

exports.subirImagen = upload.single('foto');