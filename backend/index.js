const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = require('./serviceAccountKey.json');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'user_management',
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
});

app.post('/api/users/register', (req, res) => {
  const { uid, email, name } = req.body;
  const currentTime = new Date();
  const sql =
    'INSERT INTO users (uid, email, name, registration_time, last_login, status) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(
    sql,
    [uid, email, name, currentTime, currentTime, 'active'],
    (err, results) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).send('Error registering user');
      }
      res.send('User registered');
    }
  );
});

app.post('/api/users/login', (req, res) => {
  const { uid } = req.body;

  // Check user status
  const checkStatusSql = 'SELECT status FROM users WHERE uid = ?';
  db.query(checkStatusSql, [uid], (err, results) => {
    if (err) {
      console.error('Error checking user status:', err);
      return res.status(500).send('Error checking user status');
    }
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }
    const userStatus = results[0].status;
    if (userStatus === 'blocked') {
      return res.status(403).send('User is blocked');
    }

    // If user is not blocked, update the last login time
    const lastLogin = new Date();
    const updateLoginSql = 'UPDATE users SET last_login = ? WHERE uid = ?';
    db.query(updateLoginSql, [lastLogin, uid], (err, updateResults) => {
      if (err) {
        console.error('Error updating last login time:', err);
        return res.status(500).send('Error updating last login time');
      }
      res.send('Last login time updated');
    });
  });
});

app.post('/api/users/block', (req, res) => {
  const { userIds } = req.body;
  if (!userIds || userIds.length === 0) {
    return res.status(400).send('No user IDs provided');
  }
  db.query(
    'UPDATE users SET status = ? WHERE id IN (?)',
    ['blocked', userIds],
    (err, results) => {
      if (err) {
        console.error('Error blocking users:', err);
        return res.status(500).send('Error blocking users');
      }
      res.send('Users blocked');
    }
  );
});

app.post('/api/users/unblock', (req, res) => {
  const { userIds } = req.body;
  if (!userIds || userIds.length === 0) {
    return res.status(400).send('No user IDs provided');
  }
  db.query(
    'UPDATE users SET status = ? WHERE id IN (?)',
    ['active', userIds],
    (err, results) => {
      if (err) {
        console.error('Error unblocking users:', err);
        return res.status(500).send('Error unblocking users');
      }
      res.send('Users unblocked');
    }
  );
});

app.post('/api/users/delete', async (req, res) => {
  const { userIds, uids } = req.body;
  if (!userIds || userIds.length === 0 || !uids || uids.length === 0) {
    return res.status(400).send('No user IDs or UIDs provided');
  }

  try {
    // Delete users from Firebase
    await Promise.all(uids.map((uid) => admin.auth().deleteUser(uid)));

    // Delete users from MySQL
    db.query('DELETE FROM users WHERE id IN (?)', [userIds], (err, results) => {
      if (err) {
        console.error('Error deleting users:', err);
        return res.status(500).send('Error deleting users');
      }
      res.send('Users deleted');
    });
  } catch (error) {
    console.error('Error deleting users from Firebase:', error);
    return res.status(500).send('Error deleting users from Firebase');
  }
});

app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).send('Error fetching users');
    }
    res.json(results);
  });
});

app.get('/api/users/:uid', (req, res) => {
  const { uid } = req.params;
  db.query('SELECT * FROM users WHERE uid = ?', [uid], (err, results) => {
    if (err) {
      console.error('Error fetching user details:', err);
      return res.status(500).send('Error fetching user details');
    }
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(results[0]);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
