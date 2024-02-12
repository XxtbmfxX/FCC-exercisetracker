
import express from 'express';
import User from './dbSchemas.js';
import { validarYConvertirFecha } from './utils.js';
import mongoose from 'mongoose';


const router = express.Router();

// POST New user
router.post('/', (req, res) => {
  const { username } = req.body

  const newUser = new User({
    username: username,
  });

  // Guardar el nuevo usuario en la base de datos
  newUser.save()
    .then(savedUser => {
      res.send({ _id: savedUser._id, username: savedUser.username });
    })
    .catch(error => {
      console.error('Error al crear usuario:', error);
    });

});

// GET All users
router.get('/', (req, res) => {
  User.find({}, '_id username __v')
    .then(users => {
      res.json(users)
    })
    .catch(error => {
      console.error('Error al buscar usuarios:', error);
    });
});


// POST "api/users/:_id/exercises"
router.post('/:_id/exercises', (req, res) => {
  // Lógica para manejar la solicitud POST de /api/users/:_id/exercises

  const { description, duration, date } = req.body
  const _id = req.body[":_id"]


  User.findOne({ _id: _id })
    .then(user => {
      if (!user) {
        console.log('Usuario no encontrado');
        res.json({ error: 'No user found with that ID.' })
      }

      const newLogObject = {
        description: description,
        duration: parseInt(duration),
      }

      if (validarYConvertirFecha(date)) {

        newLogObject.date = date// Fecha 

      }

      // Agregar el objeto log al usuario y guardar los cambios
      user.addToLog(newLogObject)
        .then(updatedUser => {
          console.log('Objeto log agregado con éxito:', updatedUser);
          updatedUser.setCount()

          const returnObject = {
            _id: _id,
            username: updatedUser.username,
            date: updatedUser.log[updatedUser.log.length - 1].date,
            duration: updatedUser.log[updatedUser.log.length - 1].duration,
            description: updatedUser.log[updatedUser.log.length - 1].description
          }

          res.json(returnObject)
        })
        .catch(error => {
          console.error('Error al agregar objeto log:', error);
        });

    })
    .catch(error => {
      console.error('Error al buscar usuario:', error);
    });
});


// -------------------- MODIFICAR ENDPOINTS -----------------------------------------


// GET "api/users/:_id/logs" -> usuario completo
router.get('/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  // Validar el formato del _id
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  User.findOne({_id: _id})
  .then(user => {
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

     // Aplicar límite al array log si está presente
     let logs = user.log;
     if (limit) {
       logs = logs.slice(0, parseInt(limit, 10));
     }

     //filtrar por dates en objetos del array log
     if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      logs = logs.filter(log => {
        const logDate = new Date(log.date); // Asumiendo que cada objeto de log tiene un campo 'date'
        return logDate >= fromDate && logDate <= toDate;
      });
    }

     const responseObject = {
       _id: user._id,
       username: user.username,
       count: user.count,
       log: logs
     };

     res.json(responseObject);
  
  })
  .catch(error => {
    console.error('Error al buscar usuario:', error);
    res.status(500).json({ error: "Internal Server Error" });
  });
});




export default router;
