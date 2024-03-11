const { Pool } = require('pg');

const pool = new Pool({
    user: 'frost-uat',
    host: '34.170.76.109',
    database: 'frost_eco',
    password: 'P@ssW0rd4Fr0$t',
    port: 5432, 
});
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to PostgreSQL database');
    release(); 
});

module.exports = pool;
