const mysql = require('mysql2')
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
//const bcrypt = require('bcryptjs');

app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

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



// const sql = `ALTER TABLE posts ADD COLUMN email VARCHAR(255)`;
// db.query(sql, (err, result) => {
//   if (err) {
//     console.log('error')
//   }
//   console.log('table created')
// })
app.post('/api/register', (req, res) => {
    const { username, gmail, password } = req.body;

    sql = `INSERT INTO users(username, gmail, password) VALUES (?, ?, ?)`;
    db.query(sql, [username, gmail, password], (err, result) => {
        if (err) throw err;
        res.status(201).send('User added successfully');
    });
});

app.post('/api/posts', (req, res) => {
    const { title, author_name, content, user_id, email } = req.body;
  
     const query = 'INSERT INTO posts(title, author_name, content, user_id, email) VALUES (?, ?, ?, ?, ?)';
  
    db.query(query, [title, author_name, content, user_id, email ], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'Post created successfully' });
    });
  });

  app.get('/api/postss/:user_id', (req, res) => {
    const sql = `SELECT * FROM posts WHERE user_id = ?`;
    const postId = req.params.user_id;
    db.query(sql, [postId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(results);
    })

  })



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


app.put('api/posts/:id', (req, res) => {
  const postId = req.params.id;
  const { title, author_name, content, user_id, email } = req.body;
  const sql = `UPDATE posts SET title = ?, author_name = ?, content = ?, user_id = ?, email = ? WHERE id = ?`;
  db.query(sql, [title, author_name, content, user_id, email, postId], (err, result) => {
    if (err) {
      console.error('Error updating post:', err);
      return res.status(500).json('Error updating the post');
    }
    res.status(200).json('Post updated successfully');
  });
});

  // const sql = `CREATE TABLE posts (
  //   id INT AUTO_INCREMENT PRIMARY KEY,
  //   title VARCHAR(255) NOT NULL,
  //   author_name VARCHAR(255) NOT NULL,
  //   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //   content TEXT NOT NULL,
  //   user_id INT,
  //   FOREIGN KEY (user_id) REFERENCES users(id)
  // )`;
  // db.query(sql, (err, result) => {
  //   if (err) throw err;
  //   console.log('table created')
  // });



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
