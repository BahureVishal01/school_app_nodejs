const Pool = require("pg").Pool;

// Create a new Pool instance with the connection details

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "school_app",
  password: "root",
  port: 5432, // default PostgreSQL port
});

function getPool(){
pool.connect(function (err) {
  if (err) throw err;
  setTimeout(() => {
    console.log(`  Database connected to Host: ${pool.options.host}, DB: ${pool.options.database}
|=============================================================>>`);
  }, 500);
});
}
module.exports = {pool, getPool};