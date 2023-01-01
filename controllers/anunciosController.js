const Anuncio = require('../models/Anuncio');

// Obtener lista de anuncios con filtros y paginación
exports.buscarAnuncio = (req, res) => {
  // Obtener parámetros de paginación
  const pagina = parseInt(req.query.pagina) || 1;
  const tamaño = parseInt(req.query.tamaño) || 10;  

  // Obtener parámetros de búsqueda y paginación
  const { tags, tipo_de_anuncio, precio, nombre} = req.query;
  
  // Crear objeto de filtros
  const filtros = {};
  if (tags) {
    filtros.tags = tags;
  }
  if (tipo_de_anuncio) {
    filtros.tipo_de_anuncio = tipo_de_anuncio;
  }
  if (precio) {
    // Obtener rango de precios
    const rangoPrecios = precio.split('-');
    if (rangoPrecios.length === 1) {
      filtros.precio = precio;
    } else {
      filtros.precio = {};
      if (rangoPrecios[0] !== '') {
        filtros.precio.$gte = rangoPrecios[0];
      }
      if (rangoPrecios[1] !== '') { 
        filtros.precio.$lte = rangoPrecios[1];
      }
    }
  }
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
    // Obtener datos del anuncio a crear
    const { nombre, tipo_de_anuncio, precio, foto, tags } = req.body;

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
  };

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
        
        // Eliminar anuncio
        anuncio.remove((err) => {
            if (err) {
                return res.status(500).send({ message: 'Error al eliminar el anuncio' });
            }
            res.status(200).send({ message: 'Anuncio eliminado' });
        });
    });
};