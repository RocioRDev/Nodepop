const Anuncio = require('../models/Anuncio');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Obtener lista de anuncios con filtros y paginación
exports.buscarAnuncio = (req, res) => {
  // Obtener parámetros de paginación
  const pagina = parseInt(req.query.pagina) || 1;
  const tamaño = parseInt(req.query.tamaño) || 10;  

  // Obtener parámetros de búsqueda y paginación
  const { tags, tipo_de_anuncio, precioMin, precioMax, nombre} = req.query;
  
  // Crear objeto de filtros
  const filtros = {};
  if (tags) {
    filtros.tags = tags;
  }
  if (tipo_de_anuncio) {
    filtros.tipo_de_anuncio = tipo_de_anuncio;
  }
  // Filtro de precio
  if (precioMin || precioMax) {
    filtros.precio = {};
    if (precioMin) {
      filtros.precio.$gte = precioMin;
    }
    if (precioMax) {
      filtros.precio.$lte = precioMax;
    }
  }

  // Filtro de nombre que empiece por el texto introducido
  if (nombre) {
    filtros.nombre = new RegExp('^' + nombre, "i");
  }  

  // Obtener número de anuncios a saltar
    const skip = (pagina - 1) * tamaño;    
  
  // Ejecutar búsqueda
  Anuncio.list(filtros, skip, tamaño, (err, anuncios) => {
    if (err) {
      return res.status(500).send({ message: 'Error al obtener la lista de anuncios' });
    }
    if (!anuncios) {
      return res.status(404).send({ message: 'No se encontraron anuncios' });
    }

    // Obtener número total de anuncios
    Anuncio.count(filtros, (err, total_anuncios) => {
        if (err) {
            return res.status(500).send({ message: 'Error al obtener el número total de anuncios' });
        }
        if (!total_anuncios) {
            return res.status(404).send({ message: 'No se encontraron anuncios' });
        }
        // Calcular número de páginas
        const total_paginas = Math.ceil(total_anuncios / tamaño);
        // Crear objeto de respuesta
        const response = {
            anuncios,
            paginacion: {
                pagina,
                tamaño,
                total_paginas,
                total_anuncios
            }
        };
        // Devolver respuesta
        res.status(200).send(response);    
    });
    });
};

// Obtener lista de tags disponibles
exports.obtenerTags = (req, res) => {
    // Obtener lista de tags disponibles
    const tags = ['work', 'lifestyle', 'motor', 'mobile'];
    
    res.status(200).send({ tags });
  };

// Obtener un anuncio por su ID
exports.obtenerAnuncioPorId = (req, res) => {
    // Obtener ID del anuncio a obtener
    const id = req.params.id;
    
    // Buscar anuncio por ID
    Anuncio.findById(id, (err, anuncio) => {
      if (err) {
        return res.status(500).send({ message: 'Error al obtener el anuncio' });
      }
      if (!anuncio) {
        return res.status(404).send({ message: 'No se encontró el anuncio con el ID especificado' });
      }
      res.status(200).send({ anuncio });
    });
  };

// Crear un nuevo anuncio
exports.crearAnuncio = (req, res) => {
  // imprimir por consola el request
  console.log(req.body);
  console.log(req.file);    
      // Obtener datos del anuncio a crear
      let { nombre, tipo_de_anuncio, precio, foto, tags } = req.body;

      // Añadir el nombre de la foto guardada a la propiedad foto
      foto = req.file.filename;

      // Verificar si las tags es un array o un string, si es un string convertirlo a array
      if (typeof tags === 'string') {
          tags = tags.split(',');
      }

      // Validar que las tags sean válidas
      const tagsValidas = ['work', 'lifestyle', 'motor', 'mobile'];
      if (tags) {
          for (let i = 0; i < tags.length; i++) {
              if (!tagsValidas.includes(tags[i])) {
                  return res.status(400).send({ message: 'Las tags deben ser válidas' });
              }
          }
      }

      // Validar que el tipo de anuncio sea válido
      const tiposValidos = ['venta', 'busqueda'];
      if (tipo_de_anuncio && !tiposValidos.includes(tipo_de_anuncio)) {
          return res.status(400).send({ message: 'El tipo de anuncio debe ser válido' });
      }

      // Validar que el precio sea válido y mayor que 0
      if (precio && (isNaN(precio) || precio <= 0)) {
          return res.status(400).send({ message: 'El precio debe ser válido y mayor que 0' });
      }
      
      
      // Validar datos del anuncio
      if (!nombre || !tipo_de_anuncio || !precio || !foto || !tags) {
        return res.status(400).send({ message: 'Faltan datos para crear el anuncio' });
      }
      
      // Crear nuevo anuncio
      const anuncio = new Anuncio({ nombre, tipo_de_anuncio, precio, foto, tags });
      
      // Guardar anuncio en la base de datos
      anuncio.save((err, anuncioGuardado) => {
        if (err) {
          return res.status(500).send({ message: 'Error al crear el anuncio' });
        }
        res.status(201).send({ anuncio: anuncioGuardado });
      });
    }
  //});
//};
  

// Actualizar un anuncio
exports.actualizarAnuncio = (req, res) => {
    // Obtener ID del anuncio a actualizar
    const id = req.params.id;
    
    // Obtener datos del anuncio a actualizar
    const { nombre, venta, precio, foto, tags } = req.body;
    
    // Validar datos del anuncio
    if (!nombre || !venta || !precio || !foto || !tags) {
      return res.status(400).send({ message: 'Faltan datos para actualizar el anuncio' });
    }
    
    // Buscar anuncio por ID
    Anuncio.findById(id, (err, anuncio) => {
        if (err) {
            return res.status(500).send({ message: 'Error al obtener el anuncio' });
        }
        if (!anuncio) {
            return res.status(404).send({ message: 'No se encontró el anuncio con el ID especificado' });
        }
        
        // Actualizar datos del anuncio
        anuncio.nombre = nombre;
        anuncio.venta = venta;
        anuncio.precio = precio;
        anuncio.foto = foto;
        anuncio.tags = tags;
        
        // Guardar anuncio en la base de datos
        anuncio.save((err, anuncioGuardado) => {
            if (err) {
            return res.status(500).send({ message: 'Error al actualizar el anuncio' });
            }
            res.status(200).send({ anuncio: anuncioGuardado });
        });
    });
};

// Eliminar un anuncio
exports.eliminarAnuncio = (req, res) => {
    // Obtener ID del anuncio a eliminar
    const id = req.params.id;
    
    // Buscar anuncio por ID
    Anuncio.findById(id, (err, anuncio) => {
        if (err) {
            return res.status(500).send({ message: 'Error al obtener el anuncio' });
        }
        if (!anuncio) {
            return res.status(404).send({ message: 'No se encontró el anuncio con el ID especificado' });
        }
        
        // Mostar por consola el nombre de la foto del anuncio
        console.log(anuncio.foto);
        
        // Eliminar la foto del anuncio con async/await
        eliminarFoto = async () => {
            try {
              // Eliminar la foto del anuncio usando fs.unlink y path.join              
              await fs.unlink(path.join(__dirname, '../public/images/' + anuncio.foto), (err) => {
                if (err) {
                  return res.status(500).send({ message: 'Error al eliminar la foto del anuncio' });
                }
                console.log('Foto eliminada');
              });
            // Capturar errores y devolverlos en el res del controlador  
            } catch (error) {
              console.error(error);
              return res.status(500).send({ message: 'Error al eliminar la foto del anuncio' });                
            }
        };
        eliminarFoto();

        // Eliminar anuncio
        anuncio.remove((err) => {
            if (err) {
                return res.status(500).send({ message: 'Error al eliminar el anuncio' });
            }
            res.status(200).send({ message: 'Anuncio eliminado' });
        });
    });
};

// Configurar Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../public/images/');
  },
  // Añaadir la fecha al nombre del archivo
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },    
});

const upload = multer({
  storage: storage,  
  limits: { fileSize: 5242880 } //5MB max
});

// Subir imagen
subirImagen = upload.single('foto');