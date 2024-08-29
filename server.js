<<<<<<< HEAD

=======
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const db = mysql.createConnection({
    host: 'sql8.freemysqlhosting.net',
    user: 'sql8727936',
    password: 'upcpzKmjnI',
    database: 'sql8727936'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Database connected')
});


app.post('/api/register', (req, res) => {
    const { username, gmail, password } = req.body;

    sql = `INSERT INTO users(username, gmail, password) VALUES (?, ?, ?)`;
    db.query(sql, [username, gmail, password], (err, result) => {
        if (err) throw err;
        res.status(201).send('User added successfully');
    });
});

app.post('/api/posts', (req, res) => {
    const { title, author_name, content, user_id } = req.body;
  
     const query = 'INSERT INTO posts(title, author_name, content, user_id) VALUES (?, ?, ?, ?)';
  
    db.query(query, [title, author_name, content, user_id ], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'Post created successfully' });
    });
  });

//   const sql = `CREATE TABLE posts (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     author_name VARCHAR(255) NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     content TEXT NOT NULL,
//     user_id INT,
//     FOREIGN KEY (user_id) REFERENCES users(id)
//   )`;
//   db.query(sql, (err, result) => {
//     if (err) throw err;
//     console.log('table created')
//   });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
>>>>>>> 7c4e06a (updated)
