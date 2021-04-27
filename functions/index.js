const functions = require('firebase-functions');
const express = require('express');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

const app = express();
app.use(cors);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'welcome!',
  });
});

const sendEmail = async ({ name, email, phone, comments }) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.titan.email',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'hola@karenhernandezginecologa.com',
      pass: functions.config().app.email.password,
    },
  });

  await transporter.sendMail({
    from: '"Hola 👋" <hola@karenhernandezginecologa.com>',
    to: email,
    subject: 'Tus solicitud ha sido confirmada',
    text: 'Datos recibidos',
    html: '<h1>Gracias, pronto nos pondremos en contacto.</h1>',
  });

  await transporter.sendMail({
    from: '"Hola 👋" <hola@karenhernandezginecologa.com>',
    to: 'hola@karenhernandezginecologa.com',
    subject: 'Nuevo registro (Contacto)',
    text: 'Nuevo contacto',
    html: `
    <h1>Nuevo contacto</h1>
      <ul>
        <li>Nombre: ${name}</li>
        <li>Correo: ${email}</li>
        <li>Telefono: ${phone}</li>
        <li>Comentarios: ${comments}</li>
      </ul>
    `,
  });
};

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

app.post('/api/contactos', (req, res) => {
  const { name, email, phone, comments } = req.query;

  if (!name || !email || !phone) {
    return res.status(400).json({
      status: 'invalid',
      message: 'missing data',
    });
  }

  const query = `INSERT INTO contactos (nombre,correo,celular,comentarios) VALUES (${mysql.escape(
    name
  )},${mysql.escape(email)},${mysql.escape(phone)},${mysql.escape(comments)})`;

  return runDBQuery(query)
    .then((resp) => {
      sendEmail({ name, email, phone, comments }).catch(console.error);

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
});

exports.app = functions.https.onRequest(app);
