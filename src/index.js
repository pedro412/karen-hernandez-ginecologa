const escapeHtml = require('escape-html');
const mysql = require('mysql');

exports.helloHttp = (req, res) => {
  res.send(`Hello ${escapeHtml(req.query.name || req.body.name || 'World')}!`);
};

exports.KhgContactForm = (req, res) => {
  if (req.method == 'POST') {
    const { name, email, phone } = req.query;

    console.log(name, email, phone);

    if (!name || !email || !phone) {
      return res.status(400).json({
        status: 'invalid',
        message: 'missing data',
      });
    }

    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    connection.connect();

    const query = `INSERT INTO contactos (nombre,correo,celular) VALUES (${connection.escape(name)},${connection.escape(email)},${connection.escape(phone)})`

    console.log(query);

    connection.query(query, (err, results, fields) => {
        if (err) {
          res.status(500).json({
            status: 'error',
            message: err,
          });
        }
        console.log('was here');
      }
    );

    connection.end();

    return res.status(201).json({
      status: 'ok',
      message: `POST done`,
    });
  }

  res.status(400).json({
    status: 'invalid',
    message: 'bad request',
  });
};
