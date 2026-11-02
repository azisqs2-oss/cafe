const mysql = require("mysql2/promise");


const pool = mysql.createPool({
  host: "localhost",
  user: "subjectid08051",
  password: "subjectid08051",
  database: "subject08051",
  connectionLimit: 5,
});

module.exports = pool;

