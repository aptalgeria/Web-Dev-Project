const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

// Connect to the database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // standard local password
  database: "perfume_db",
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Error. Ensure your MySQL server (like XAMPP's MySQL module) is actually running.");
    process.exit(1);
  }
  console.log("✅ Connected to perfume_db.");

  // 1. Truncate the table (removes all records and resets ID to 1)
  const truncateQuery = "TRUNCATE TABLE perfumes;";

  db.query(truncateQuery, (err) => {
    if (err) {
      console.error("❌ Error truncating table:", err.message);
      db.end();
      process.exit(1);
    }
    console.log("✅ Table 'perfumes' has been emptied and IDs reset.");

    // 2. Optional: Clean the uploads folder (keep only essential files if any)
    const uploadsDir = path.join(__dirname, "uploads");
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      let deletedCount = 0;

      for (const file of files) {
        // Don't delete placeholders or the folder itself
        if (file !== "placeholder.png" && file !== "logo.svg") {
          fs.unlinkSync(path.join(uploadsDir, file));
          deletedCount++;
        }
      }
      console.log(`✅ Cleaned ${deletedCount} images from the uploads folder.`);
    }

    console.log("🚀 The database is now fresh and ready for new perfumes!");
    db.end();
  });
});
