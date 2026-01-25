function requireAuth(req, res, next) {
  if (req.session.user) return next();

  const isAjax = req.get('X-Requested-With') === 'XMLHttpRequest';
  if (isAjax) return res.status(401).send('Debes iniciar Sesion para añadir productos al carrito.');

  return res.redirect('/login');
}

function requireAdmin(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  if (req.session.user.rol !== 'admin') return res.status(403).send('No autorizado');
  next();
}

module.exports = { requireAuth, requireAdmin };
