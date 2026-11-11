const express = require("express");
const os = require("node:os");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

let services = [
  { id: 1, name: "Файловое хранилище", category: "storage" },
  { id: 2, name: "Виртуальный сервер", category: "compute" },
  { id: 3, name: "Облачная IDE", category: "development" }
];

app.get("/", (req, res) => {
  res.send(`
    <html lang="ru"><meta charset="utf-8">
    <title>Моё облачное приложение</title>
    <h1>Моё первое облачное приложение</h1>
    <p>Это приложение работает в облаке GitHub Codespaces.</p>
    <p>Вариант: Список облачных сервисов</p>
    <a href="/api/status">Статус сервера</a><br>
    <a href="/api/services">Облачные сервисы</a>
  `);
});

app.get("/api/status", (req, res) => {
  res.json({
    app: process.env.APP_NAME || "My Cloud App",
    status: "running",
    time: new Date().toISOString(),
    hostname: os.hostname()
  });
});

app.get("/api/services", (req, res) => {
  res.json(services);
});

app.get("/api/services/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = services.find(s => s.id === id);
  if (!item) {
    return res.status(404).json({ error: "Такого сервиса нет" });
  }
  res.json(item);
});

app.post("/api/services", (req, res) => {
  const name = req.body.name;
  const category = req.body.category;
  if (!name || !category) {
    return res.status(400).json({ error: "Нужны поля name и category" });
  }
  const item = { id: services.length + 1, name, category };
  services.push(item);
  res.status(201).json(item);
});

app.get("/api/hello", (req, res) => {
  const name = req.query.name || "Гость";
  res.json({ message: `Привет, ${name}! Добро пожаловать в облако.` });
});

app.listen(port, () => {
  console.log(`Server: http://localhost:${port}`);
});
