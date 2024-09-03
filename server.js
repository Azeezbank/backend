const mysql = require('mysql2')
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
//const bcrypt = require('bcryptjs');

app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(session({
  secret: 'my_super_secret_key_1234567890', // Replace with your secure secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Set true if using HTTPS
}));

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

  // app.post('/login', (req, res) => {
  //   const { username, password } = req.body;

  //   db.query(`SELECT * FROM users WHERE username = ?`, [username], (err, result) => {
  //     if (err) return res.status(500).send(err);
  //     if (result.length === 0) return res.status(400).send('user not found');

  //     const user = result[0];
  //     const validPassword = bcrypt.compareSync(password, user.password);
  //     if (!validPassword) return res.status(400).send('invalid password');
 
  //     // fetch specific user post
  //     db.query(`SELECT * FROM posts WHERE user_id = ?`, [user_id], (err, posts) => {
  //       if (err) return res.status(500).send(err);
  //       res.json(posts);
  //     });
  //   });
  // });

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query the database to find the user
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
          // User found, store their info in the session
          req.session.user = results[0];
          res.send({ message: 'Login successful!' });
      } else {
          res.status(401).send({ message: 'Invalid username or password' });
      }
  });
});

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
      next();
  } else {
      res.status(403).send({ message: 'You need to log in first' });
  }
}

// Endpoint to fetch posts for the logged-in user
app.get('/user-posts', isAuthenticated, (req, res) => {
  const userId = req.session.user.id;

  const query = 'SELECT * FROM posts WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
      if (err) throw err;

      res.send(results);
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
