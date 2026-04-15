// --- IMPORTATIONS
const express = require("express"); // Le moteur du serveur
const mysql = require("mysql2"); // Le traducteur pour MySQL
const cors = require("cors"); // Le garde du corps (sécurité)

const app = express();

//  MIDDLEWARES (Les réglages)
app.use(cors()); // Autorise le frontend à parler au backend
app.use(express.json()); // Permet de lire les données envoyées (JSON)

// --- CONNEXION BDD (XAMPP doit être lancé !) ---
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Vide par défaut sur XAMPP
  database: "perfume_db", // Assure-toi d'avoir créé cette DB dans phpMyAdmin
});

db.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion MySQL :", err.message);
    return;
  }
  console.log("✅ Connecté à la base de données MySQL !");
});

// --- ROUTE OPTIONNELLE : RECHERCHE DYNAMIQUE ---
app.get('/api/products/search', (req, res) => {
    const query = req.query.name || ""; // Récupère la lettre tapée (ex: ?name=a)
    
    // SQL : On cherche les noms qui commencent par 'query' (LIKE 'a%') 
    // puis on trie pour mettre ceux qui commencent par la lettre en haut
    const sql = `
        SELECT * FROM perfumes 
        WHERE name LIKE ? 
        ORDER BY (CASE WHEN name LIKE ? THEN 1 ELSE 2 END), name ASC
    `;
    
    const searchTerm = `%${query}%`; // Contient la lettre n'importe où
    const startsWith = `${query}%`; // Commence par la lettre

    db.query(sql, [searchTerm, startsWith], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// --- TA PREMIÈRE ROUTE (Test) ---
app.get("/", (req, res) => {
  res.send("Le serveur fonctionne et répond à la racine !");
});

// --- LANCEMENT DU SERVEUR ---
const PORT = 5000;
// --- ROUTE POUR AJOUTER UN PRODUIT ---
app.post("/api/products", (req, res) => {
  // 1. Récupération des données
  const { name, description, price, image_url } = req.body;

  // 2. Validation de sécurite
  // On vérifie si le nom existe et s'il n'est pas juste composé d'espaces
  if (!name || name.trim().length < 3) {
    return res.status(400).json({
      error: "Le nom est obligatoire et doit avoir au moins 3 caractères.",
    });
  }

  // On vérifie que le prix est nombre supérieur à zéro
  if (!price || price <= 0) {
    return res.status(400).json({
      error: "Le prix est obligatoire et doit être un nombre positif.",
    });
  }

  // 3. La requête SQL (Prepared Statement pour la sécurité)
  const sql =
    "INSERT INTO perfumes (name, description, price, image_url) VALUES (?, ?, ?, ?)";

  // 4. Exécution de la requête
  db.query(sql, [name, description, price, image_url], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion :", err.message);
      return res.status(500).json({
        error: "Erreur serveur lors de l'ajout du produit",
      });
    }

    // 5. Réponse de succès
    res.status(201).json({
      message: "Produit ajouté avec succès !",
      productId: result.insertId,
    });
  });
});
// --- ROUTE POUR RÉCUPÉRER TOUS LES PRODUITS ---
app.get("/api/products", (req, res) => {
  const sql = "SELECT * FROM perfumes";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    // On renvoie la liste complète des parfums au format JSON
    res.status(200).json(results);
  });
});
// --- ROUTE POUR SUPPRIMER UN PRODUIT ---
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params; // On récupère l'ID dans l'URL

  const sql = "DELETE FROM perfumes WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erreur lors de la suppression" });
    }

    // Sécurité : Vérifier si le produit existait vraiment
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.status(200).json({ message: "Produit supprimé avec succès !" });
  });
});
// --- ROUTE POUR MODIFIER UN PRODUIT ---
app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url } = req.body;

  const sql =
    "UPDATE perfumes SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?";

  db.query(sql, [name, description, price, image_url, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erreur lors de la modification" });
    }
    res.status(200).json({ message: "Produit mis à jour !" });
  });
});
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur : http://localhost:${PORT}`);
});
