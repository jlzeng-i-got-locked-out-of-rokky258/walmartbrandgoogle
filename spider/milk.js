let fs = require('fs');
let fetch = require('node-fetch');
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'walmartbrandgoogle',
    port: '3306'
});

connection.connect();

connection.query('SELECT 1', function (error, results, fields) {
    if (error) throw error;
    // connected!
});
/*
let urls = fs.readFileSync('../domains.txt').toString().split("\n");
for (let i = 0; i < urls.length; ++i) {
    urls[i] = urls[i].trim();
    parser(urls[i]);
}
*/
parser("http://www.sqltutorial.org/");

async function parser(url){
        const dust = await fetch(url);
        connection.query(`INSERT INTO documents(url) VALUES("${dust.url}")`, function (error, results, fields) {
        if (error) throw error;
        console.log('changed ' + results.changedRows + ' rows');
    })
}

