let fs = require('fs');
let fetch = require('node-fetch');
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'nutrigrain',
    database : 'walmartbrandgoogle',
    port: '3306'
});

connection.connect();

connection.query('SELECT 1', function (error, results, fields) {
    if (error) throw error;
    // connected!
});

let urls = fs.readFileSync('../domains.txt').toString().trim().split("\n");
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
urls = shuffle(urls);


async function parseAll(urls) {
    for (let i = 0; i < urls.length; ++i) {
        urls[i] = urls[i].trim();
        await parser(urls[i]);
    }
}

parseAll(urls).then(res=>console.log("Parse all done"));


async function parser(url){
    try {
        const bigUrl = "http://localhost:3000/getpagecontent?url="+url;
        const dust = await fetch(bigUrl);
        let text = await dust.text();
        connection.query(`INSERT IGNORE INTO documents(url, description) VALUES("${url}", "${text}")`, async function (error, results, fields) {
            text = text.toLowerCase();
            const textArray = text.split(" ");
            for (let i = 0; i < textArray.length; ++i) {
                connection.query(`INSERT INTO words(word, document) VALUES("${textArray[i]}", (SELECT id FROM documents WHERE url="${url}")) ON DUPLICATE KEY UPDATE count = count + 1;`, function (error, results, fields) {
                })
                connection.query(`UPDATE documents SET count = count + 1 WHERE url="${url}"`, function (error, results, fields) {
                })
            }
            console.log(url);
        })
    } catch (e) {
        console.log(e);
    }
        
}

