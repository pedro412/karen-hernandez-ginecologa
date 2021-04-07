const escapeHtml = require('escape-html');
const mysql = require('mysql');

exports.helloHttp = (req, res) => {
  res.send(`Hello ${escapeHtml(req.query.name || req.body.name || 'World')}!`);
};

const runDBQuery = (query) => {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
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

exports.khgContactForm = (req, res) => {
  if (req.method == 'POST') {
    const { name, email, phone, comments } = req.query;

    if (!name || !email || !phone) {
      return res.status(400).json({
        status: 'invalid',
        message: 'missing data',
      });
    }

    const query = `INSERT INTO contactos (nombre,correo,celular,comentarios) 
    VALUES (${mysql.escape(name)},${mysql.escape(email)},${mysql.escape(phone)},${mysql.escape(comments)})`;

    return runDBQuery(query).then((resp) => {
      return res.status(201).json({
        status: resp,
        message: `POST done`,
      });
    }).catch(err => {
      return res.status(500).json({
        status: 'error',
        message: 'db error',
        err
      });
    });
  }

  res.status(400).json({
    status: 'invalid',
    message: 'bad request',
  });
};
