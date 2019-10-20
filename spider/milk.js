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
    const bigUrl = "http://localhost:3000/getpagecontent?url="+url;
    const dust = await fetch(bigUrl);
    connection.query(`INSERT IGNORE INTO documents(url) VALUES("${url}")`, function (error, results, fields) {
        if (error) throw error;
        console.log('changed ' + results.changedRows + ' rows');
    })
    const text = await dust.text();
    const textArray = text.split(" ");
    for (let i = 0; i < textArray.length; ++i) {
        connection.query(`INSERT INTO words(word, document) VALUES("${textArray[i]}", (SELECT id FROM documents WHERE url="${url}")) ON DUPLICATE KEY UPDATE count = count + 1;`, function (error, results, fields) {
            if (error) throw error;
        })
        connection.query(`UPDATE documents SET count = count + 1 WHERE url="${url}"`, function (error, results, fields) {
            if (error) throw error;

        })
    }

    console.log("end");
}

