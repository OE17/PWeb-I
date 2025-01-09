const express = require("express");
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log("Users API escutando na ${port}");
});

const db = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'jd@example.com'
    },
    {
        id: 2,
        firstName: 'Jane',
        lastName: 'Warwick',
        email: 'jane@example.com'
    },
    {
        id: 3,
        firstName: 'Jim',
        lastName: 'Smith',
        email: 'jim@example.com'
    },

];

app.get("/users", (req, res) => {
    res.json(users);
});

app.get("/users/:id", (req, res) => {
    const user = db.find(u => u.id === parseInt(req.params.id));
    res.json(user);
});

app.post("/users", (req, res) => {
    let lastId = Math.max(...db.map(u => u.id));
    const user = {
        id: ++lastId,
        firstName: req.body.fName,
        lastName: req.body.lName,
        email: req.body.e,
    };
    db.push(user);
    res.json(db);
});

app.delete("/users/:id", (req, res) => {
    db = db.filter(u => u.id !== req.params.id)
    res.json(db);
});

app.put("/users/:id", (req, res) => {
    const index = db.findIndex(u => u.id === parseInt(req.params.id));
    db[index] =
    {
        id: req.params.id,
        firstName: req.body.fName,
        lastName: req.body.lName,
        email: req.body.e
    }
    res.json(db);
});