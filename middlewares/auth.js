function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  if (req.session.user.rol !== "admin") return res.status(403).send("No autorizado");
  next();
}

module.exports = { requireAuth, requireAdmin };
