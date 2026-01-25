const db = require('../../database/models');

const usersApiController = {
  list: async (req, res) => {
    try {
      const users = await db.Usuario.findAll({
        attributes: ['id', 'nombre', 'apellido', 'email', 'rol', 'foto'],
        order: [['id', 'DESC']],
      });

      res.json({
        count: users.length,
        users: users.map((user) => ({
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          rol: user.rol,
          detail: `http://localhost:3000/api/users/${user.id}`,
        })),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  },

  detail: async (req, res) => {
    try {
      const user = await db.Usuario.findByPk(req.params.id, {
        attributes: ['id', 'nombre', 'apellido', 'email', 'rol', 'foto'],
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json({
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,
        foto: user.foto,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener usuario' });
    }
  },
};

module.exports = usersApiController;
