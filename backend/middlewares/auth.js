const jwt = require("jsonwebtoken"); // JSONwebtoken pour génération de token

// middleware d'authentification pour s'assurer que les requêtes sont faites par un utilisateur authentifié
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId; //définir le token en tant qu'identifiant utilisateur

    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid userId";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | "Demande non authentifiée" });
  }
};
