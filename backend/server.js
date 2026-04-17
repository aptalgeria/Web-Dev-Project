// --- IMPORTATIONS
const express = require("express"); // Le moteur du serveur
const mysql = require("mysql2"); // Le traducteur pour MySQL
const cors = require("cors"); // Le garde du corps (sécurité)
const multer = require("multer"); // Pour gérer les uploads de fichiers
const path = require("path"); // Pour gérer les chemins de fichiers

const app = express();

//  MIDDLEWARES (Les réglages)
app.use(cors()); // Autorise le frontend à parler au backend
app.use(express.json()); // Permet de lire les données envoyées (JSON)
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Sert les fichiers dans le dossier uploads

// --- CONFIGURATION MULTER (Stockage des images) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // On crée un nom unique : timestamp + nom d'origine sans espaces
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// --- CONNEXION BDD (Pool pour plus de stabilité) ---
// Le Pool gère les reconnexions automatiquement si la BDD tombe ou timeout
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "perfume_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test de connexion initial
db.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error("❌ La connexion à MySQL a été perdue.");
    } else if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error("❌ Trop de connexions à la base de données.");
    } else if (err.code === 'ECONNREFUSED') {
      console.error("❌ Connexion refusée. Vérifie que MySQL/XAMPP est lancé.");
    } else {
      console.error("❌ Erreur MySQL :", err.message);
    }
    return;
  }
  if (connection) connection.release();
  console.log("✅ Pool de connexion MySQL prêt !");
});

// Helper pour transformer les chemins relatifs en URLs absolues
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800";
  if (imagePath.startsWith("/uploads")) {
    return `http://localhost:${PORT}${imagePath}`;
  }
  return imagePath;
};

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
        
        // On transforme les chemins en URLs absolues
        const fullResults = results.map(item => ({
            ...item,
            image_url: getFullImageUrl(item.image_url)
        }));

        res.json(fullResults);
    });
});

// --- TA PREMIÈRE ROUTE (Test) ---
app.get("/", (req, res) => {
  res.send("Le serveur fonctionne et répond à la racine !");
});

// --- LANCEMENT DU SERVEUR ---
const PORT = 5000;
// --- ROUTE POUR AJOUTER UN PRODUIT (Multipart for image upload) ---
app.post("/api/products", upload.single("image"), (req, res) => {
  // 1. Récupération des données
  const { name, description, price } = req.body;
  
  // L'URL de l'image est soit le fichier uploadé, soit un placeholder s'il n'y a rien
  let image_url = "";
  if (req.file) {
    // On stocke le chemin relatif pour la BDD
    image_url = `/uploads/${req.file.filename}`;
  } else {
    // Si pas de fichier, on peut mettre une image par défaut
    image_url = "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800";
  }

  // 2. Validation de sécurité
  if (!name || name.trim().length < 3) {
    return res.status(400).json({
      error: "Le nom est obligatoire et doit avoir au moins 3 caractères.",
    });
  }

  if (!price || price <= 0) {
    return res.status(400).json({
      error: "Le prix est obligatoire et doit être un nombre positif.",
    });
  }

  // 3. La requête SQL
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

      res.status(201).json({
        message: "Produit ajouté avec succès !",
        productId: result.insertId,
        image_url: getFullImageUrl(image_url)
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
    
    // On transforme les chemins relatifs en URLs absolues
    const fullResults = results.map(item => ({
        ...item,
        image_url: getFullImageUrl(item.image_url)
    }));

    res.status(200).json(fullResults);
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
