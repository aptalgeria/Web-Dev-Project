const mysql = require("mysql2");

// Connect to the generic MySQL server (no specific database yet)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // standard local password
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Error. Ensure your MySQL server (like XAMPP's MySQL module) is actually running.");
    process.exit(1);
  }
  console.log("✅ Connected securely to MySQL Server.");

  // 1. Automatically create the database
  db.query("CREATE DATABASE IF NOT EXISTS `perfume_db`;", (err) => {
    if (err) throw err;
    console.log("✅ Database 'perfume_db' is ready.");

    // 2. Select the database
    db.query("USE `perfume_db`;", (err) => {
      if (err) throw err;

      // 3. Automatically create the table
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS perfumes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          image_url VARCHAR(1024) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;

      db.query(createTableQuery, (err) => {
        if (err) throw err;
        console.log("✅ Table 'perfumes' is ready.");
        console.log("🚀 Everything is set up! You can now run: node server.js");
        process.exit(0);
      });
    });
  });
});
