// CARREOLA JIMENEZ ALEJANDRO
// Tarea 14. CRUD / API
// 319197154
// TEMAS ESPECIALES DE PROGRAMACION 2
// Grupo: 1007 (2026-I)


import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "login_db",
});

db.connect((err) => {
  if (err) {
    console.log("Error de conexión:", err);
  } else {
    console.log("Conectado a la base de datos");
  }
});

// Obtener todos los usuarios
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

// Obtener un usuario por ID
app.get("/user/:id", (req, res) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  const id = req.params.id;

  db.query(sql, [id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    return res.json(data[0]);
  });
});

// Crear un usuario nuevo
app.post("/user", (req, res) => {
  const { name, email, password } = req.body;
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Usuario creado correctamente", id: result.insertId });
  });
});

// Editar usuario por ID
app.put("/user/:id", (req, res) => {
  const { name, email, password } = req.body;
  const id = req.params.id;
  const sql = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";

  db.query(sql, [name, email, password, id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    return res.json({ message: "Usuario actualizado correctamente" });
  });
});

// Eliminar usuario por ID
app.delete("/user/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM users WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    return res.json({ message: "Usuario eliminado correctamente" });
  });
});


app.get("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length > 0) {
      res.json({ message: "Login exitoso", user: data[0] });
    } else {
      res.status(401).json({ message: "Credenciales incorrectas" });
    }
  });
});


app.listen(3300, () => {
  console.log("Servidor corriendo en http://localhost:3300");
});
