const mysql = require('mysql2')
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
//const bcrypt = require('bcryptjs');

app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 5000;

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    //PORT: process.env.PORT
});




//Create user table
// db.execute(`CREATE TABLE IF NOT EXISTS users(id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(100), gmail VARCHAR(100), password VARCHAR(500))`, (err, result) => {
//   if (err) throw err;
//   console.log('user table created')
// });


//Create posts table
// db.execute(`CREATE TABLE IF NOT EXISTS posts(id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(225), author_name VARCHAR(255), content TEXT, user_id INT, email VARCHAR(255), category VARCHAR(255), image TEXT)`, (err, result) => {
//     if (err) throw err;
//     console.log('post table created')
//   });

// Create table for currency converter app comment submission
// const sql = `CREATE TABLE IF NOT EXISTS currency(id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255), gmail VARCHAR(300), comment TEXT)`;
// db.execute(sql, (err, res) => {
//   if (err) throw err;
//   console.log('Comment table created');
// });

app.post('/api/v1/sumbmit-comment', (req, res) => {
  const { name, gmail, comment } = req.body;
  const sql = `INSERT INTO currency(name, gmail, comment) VALUES (?, ?, ?)`;
  db.execute(sql, [name, gmail, comment], (err, result) => {
    if (err) {
      return res.status(500).json({message: 'Error submitting comment'})
    }
    res.status(200).json({message: 'Comment submitted successfully'})
  });
});

app.post('/api/register', (req, res) => {
    const { username, gmail, password } = req.body;

   const sql = `INSERT INTO users(username, gmail, password) VALUES (?, ?, ?)`;
    db.query(sql, [username, gmail, password], (err, result) => {
        if (err) throw err;
        res.status(201).send('User added successfully');
    });
});

app.post('/api/posts', (req, res) => {
    const { title, author_name, content, user_id, email, category, image } = req.body;
  
     const query = 'INSERT INTO posts(title, author_name, content, user_id, email, category, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
    db.query(query, [title, author_name, content, user_id, email, category, image ], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json({ message: 'Post created successfully' });
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

// recipts category
app.get('/api/recipes', (req, res) => {
  const category = 'Recipes & Cooking Tips';  // This can be dynamic if needed
  const sql = 'SELECT * FROM posts WHERE category = ?';

  db.query(sql, [category], (err, result) => {
    if (err) {
      console.error('Error fetching posts:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    console.log('Posts selected successfully');
    res.json(result);
  });
});

//Health category
app.get('/api/health', (req, res) => {
  const category = 'Healthy Eating';  // This can be dynamic if needed
  const sql = 'SELECT * FROM posts WHERE category = ?';

  db.query(sql, [category], (err, result) => {
    if (err) {
      console.error('Error fetching posts:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    console.log('Posts selected successfully');
    res.json(result);
  });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT username FROM users WHERE username = ? and password = ?`;
    db.query(sql, [username, password], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.status(400).json({error: "Invalid username or password"});
        }
        res.json({message: "Login successful", username: result[0].username});
    });
});


app.put('/api/edit/:id', (req, res) => {
  const postId = req.params.id;
  const { title, author_name, content, user_id, email, category, image } = req.body;
  const sql = `UPDATE posts SET title = ?, author_name = ?, content = ?, user_id = ?, email = ?, category = ?, image = ? WHERE id = ?`;
  db.query(sql, [ title, author_name, content, user_id, email, category, image, postId ], (err, result) => {
    if (err) {
      console.error('Error updating post:', err);
      return res.status(500).json('Error updating the post');
    }
    res.status(200).json('Post updated successfully');
  });
});


// Delete a post by ID
app.delete('/api/delete/:id', (req, res) => {
  const postId = req.params.id;

  const query = 'DELETE FROM posts WHERE id = ?';

  db.query(query, [postId], (err, results) => {
    if (err) {
      console.error('Error deleting post:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
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
