
import express from 'express';
import User from './dbSchemas.js';
import { validarYConvertirFecha } from './utils.js';

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
          user.setCount()

          res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            date: updatedUser.logs[updatedUser.logs.length -1].date,
            duration: updatedUser.logs[updatedUser.logs.length -1].duration,
            description: updatedUser.logs[updatedUser.logs.length -1].description

          })
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
  const _id = req.params

  const {from, to, limit} = req.query

  if(!from || !to  || !limit){
    User.findOne({ _id: _id })
    .then(user => {
      if (!user) {
        console.log('User Not found');
        return res.status(404).json({ error: "User Not found" });
      }
      res.json(user);
    })
    .catch(error => {
      console.error('Error al buscar usuario:', error);
      res.status(500).json({ error: "Error interno del servidor" });
    });
  }
  else if(limit){
    User.findOne({ _id: _id })
    .then(user => {
      if (!user) {
        console.log('User Not found');
        return res.status(404).json({ error: "User Not found" });
      }

      let logs = user.log;
      logs = logs.slice(0, parseInt(limit));
      
      user.log = logs

      res.json(user);
    })
    .catch(error => {
      console.error('Error al buscar usuario:', error);
      res.status(500).json({ error: "Error interno del servidor" });
    });

  }

  // No filters

});

// GET "api/users/:_id/logs"
router.get('/testing_date/:_id', (req, res) => {
  const { _id } = req.params
  User.findOne({ _id: _id })
    .then(user => {
      if (!user) {
        console.log('Usuario no encontrado');
        return;
      }

      // Acceder al array de fechas en formato deseado
      const formattedDates = user.formattedDate;
      console.log('Fechas en formato deseado:', formattedDates);
      res.send(formattedDates)
    })
    .catch(error => {
      console.error('Error al buscar usuario:', error);
    });

});

export default router;
