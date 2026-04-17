# ✨ Essence — Luxury Perfume Catalog

Essence is a premium, ultra-modern full-stack web application designed for high-end perfume boutiques. It features a sleek, glassmorphic UI, real-time product searching, and a robust management system for your fragrance inventory.

---

## 🚀 Quick Start Guide

To run this project locally, follow these steps in order.

### 1. Prerequisites
*   **Node.js** (v16 or higher)
*   **XAMPP** or a local **MySQL** server.
*   **Git** (optional, for cloning)

### 2. Database Setup
1.  Open **XAMPP Control Panel** and start the **Apache** and **MySQL** modules.
2.  Navigate to the `backend` folder in your terminal:
    ```bash
    cd backend
    ```
3.  Install backend dependencies:
    ```bash
    npm install
    ```
4.  Run the initialization script to automatically create the database and tables:
    ```bash
    node init_db.js
    ```
    *Note: If you prefer manual setup, import `database_setup.sql` into phpMyAdmin.*

### 3. Start the Backend
1.  While in the `backend` directory, start the server:
    ```bash
    npm run dev
    ```
    *The server will run on [http://localhost:5000](http://localhost:5000)*

### 4. Start the Frontend
1.  Open a **new terminal** window and navigate to the project root:
    ```bash
    cd ..
    ```
2.  Install frontend dependencies:
    ```bash
    npm install
    ```
3.  Launch the development server:
    ```bash
    npm run dev
    ```
    *The application will be available at [http://localhost:5173](http://localhost:5173)*

---

## 🎨 Features

-   **High-End Aesthetics:** A curated dark-mode theme with gold accents and smooth transitions.
-   **Live Search:** High-performance search powered by jQuery AJAX that filters as you type.
-   **Product Management:** Full CRUD capabilities (Create, Read, Update, Delete) for your fragrance catalog.
-   **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop views.
-   **Reliable Backend:** RESTful API built with Express.js and MySQL.

---

## 🛠️ Technology Stack

**Frontend:**
-   React.js 18
-   Vite (Build Tool)
-   Vanilla CSS3 (Custom Luxury Design)
-   jQuery (AJAX Search Optimization)

**Backend:**
-   Node.js & Express.js
-   MySQL (Database)
-   CORS (Security)

---

## 📂 Project Structure

```text
├── backend/            # Express.js Server & Database Scripts
│   ├── server.js       # Main API Server
│   ├── init_db.js      # Automatic Database Setup
│   └── database_setup.sql
├── src/                # React Frontend
│   ├── components/     # UI Components (ProductList, Header, etc.)
│   ├── App.jsx         # Main Application Logic
│   └── main.jsx
├── public/             # Static Assets
└── index.html
```

---

## 🔒 License
This project is licensed under the ISC License.
