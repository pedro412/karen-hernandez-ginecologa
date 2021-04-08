const functions = require('firebase-functions');
const express = require('express');
const mysql = require('mysql');
const cors = require('cors')({ origin: true });

const app = express();

const corsOptions = {
  origin: 'https://karenhernandezginecologa.com/',
  optionsSuccessStatus: 200
}

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'welcome',
  });
});

const runDBQuery = (query) => {
  try {
    const connection = mysql.createConnection({
      host: functions.config().app.db_host,
      user: functions.config().app.db_user,
      password: functions.config().app.db_password,
      database: functions.config().app.db_name,
    });
    connection.connect();
    connection.query(query, (err, results, fields) => {
      if (err) {
        return Promise.reject('DB Error', err);
      }
    });
    connection.end();
    return Promise.resolve('ok');
  } catch (error) {
    return Promise.reject('DB Error', error);
  }
};

app.post('/api/contactos', cors(corsOptions), (req, res) => {
  if (req.method == 'POST') {
    const { name, email, phone, comments } = req.query;

    if (!name || !email || !phone) {
      return res.status(400).json({
        status: 'invalid',
        message: 'missing data',
      });
    }

    // eslint-disable-next-line max-len
    const query = `INSERT INTO contactos (nombre,correo,celular,comentarios) VALUES (${mysql.escape(
      name
    )},${mysql.escape(email)},${mysql.escape(phone)},${mysql.escape(
      comments
    )})`;

    return runDBQuery(query)
      .then((resp) => {
        return res.status(201).json({
          status: resp,
          message: `POST done`,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: 'error',
          message: 'db error',
          err,
        });
      });
  }

  res.status(400).json({
    status: 'invalid',
    message: 'bad request',
  });
});

exports.app = functions.https.onRequest(app);
