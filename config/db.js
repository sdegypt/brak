const mysql = require('mysql2');
const util = require('util');

require('dotenv').config();

let dbConfig;

if (process.env.SCALINGO_MYSQL_URL) {
  const dbUrl = new URL(process.env.SCALINGO_MYSQL_URL);
  dbConfig = {
    host: dbUrl.hostname,
    port: dbUrl.port,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.replace('/', ''),
    ssl: {
      rejectUnauthorized: false // بسبب useSSL=true&verifyServerCertificate=false
    }
  };
} else {
  dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  };
}

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error("❌ لم يتم الاتصال بقاعدة البيانات:", err);
    return;
  }
  console.log("✅ تم الاتصال بقاعدة البيانات بنجاح");
});

db.query = util.promisify(db.query);

module.exports = db;
