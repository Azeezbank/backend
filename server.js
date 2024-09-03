const mysql = require('mysql2')
const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

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

  app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query(`SELECT * FROM users WHERE username = ?`, [username], (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length === 0) return res.status(400).send('user not found');

      const user = result[0];
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) return res.status(400).send('invalid password');
 
      // fetch specific user post
      db.query(`SELECT * FROM posts WHERE user_id = ?`, [user_id], (err, posts) => {
        if (err) return res.status(500).send(err);
        res.json(posts);
      });
    });
  });

  app.get('/api/posts', (req, res) => {
    const sql = 'SELECT * FROM posts';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Get a single post by ID
app.get('/api/posts/:id', (req, res) => {
  const sql = 'SELECT * FROM posts WHERE id = ?';
  const postId = req.params.id;
  
  db.query(sql, [postId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(results[0]);
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
    console.log(`Server is running on port ${port}`)
})