
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
                duration: duration,
            }

            if (validarYConvertirFecha(date)) {
                {
                    newLogObject.date = date// Fecha 
                };
            }

            // Agregar el objeto log al usuario y guardar los cambios
            user.addToLog(newLogObject)
                .then(updatedUser => {
                    console.log('Objeto log agregado con éxito:', updatedUser);
                    user.setCount()

                    res.json(updatedUser)
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


// GET "api/users/:_id/logs"
router.get('/:_id/logs', (req, res) => {
  // Obtener el ID del usuario de los parámetros de la solicitud
  const { _id } = req.params;

  // Obtener los parámetros opcionales limit, from y to de la consulta
  const { limit, from, to } = req.query;

  // Crear un objeto de filtro con el ID del usuario
  const filter = { _id };

  // Si se proporciona el parámetro "from", agregarlo al filtro de fecha
  if (from) {
    filter['log.date'] = { $gte: new Date(from) };
  }

  // Si se proporciona el parámetro "to", agregarlo al filtro de fecha
  if (to) {
    filter['log.date'] = { ...filter['log.date'], $lte: new Date(to) };
  }

  // Buscar al usuario en la base de datos
  User.findOne(filter)
    .then(user => {
      if (!user) {
        console.log('Usuario no encontrado');
        return res.json({ error: "Usuario no encontrado" });
      }

      // Si se proporciona el parámetro "limit", limitar el número de registros
      let logs = user.log;
      if (limit) {
        logs = logs.slice(0, parseInt(limit));
      }

      res.json(logs);
    })
    .catch(error => {
      console.error('Error al buscar usuario:', error);
      res.status(500).json({ error: "Error interno del servidor" });
    });
});

// GET "api/users/:_id/logs"
router.get('/testing_date/:_id', (req, res) => {
    const {_id} = req.params
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
