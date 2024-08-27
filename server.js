const express = require('express');

const mysql = require('mysql2');

const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

const db = mysql.createConnection({

host: 'sq18.freemysqlhosting.net",
user: 'sq18727936', 
password: 'upcpzKmjnI', 
database: 'sq18727936',

db.connect((err) => {

if (err) throw err;

console.log('Database connected")

});

app.post('/api/register', (req, res) => {

const { username, gmail, password } = req.body;

const sql = "INSERT INTO TABLE users(username, gmail, password) VALUES (?, ?, ?)";

db.query(sql, [username, gmail, password], (err, result) => {
  if (err) {
console.error('Error inserting details:', err); 
 return res.status(500).json({error: 'Fail to registered user'})
}

res.status(201).json({message: 'User registered success})

});

});
