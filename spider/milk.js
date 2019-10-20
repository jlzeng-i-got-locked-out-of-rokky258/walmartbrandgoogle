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
        console.log(url + " start");
        const bigUrl = "http://localhost:3000/getpagecontent?url="+url;
        const dust = await fetch(bigUrl);
        let text = await dust.text();
        if (text.length != 0) {
            console.log(connection.escape(url));
            let result = await pConnection(`INSERT IGNORE INTO documents(url, description) VALUES(${connection.escape(url)}, ${connection.escape(text)})`);
            console.log(text.length);
            if (result.affectedRows != 0) {
                text = text.toLowerCase();
                const textArray = text.split(" ");

                for (let i = 0; i < textArray.length; ++i) {
                    await pConnection(`INSERT INTO words(word, document) VALUES(${connection.escape(textArray[i])}, (SELECT id FROM documents WHERE url=${connection.escape(url)})) ON DUPLICATE KEY UPDATE count = count + 1;`);
                    await pConnection(`UPDATE documents SET count = count + 1 WHERE url=${connection.escape(url)}`);
                }
                console.log(url + " done");
            } else {
                console.log(url + " already parsed");
            }
        } else {
            console.log(url + " has no content");
        }
        
    } catch (e) {
        console.log(e);
    }
        
}

function pConnection(query) {
    return new Promise(function(resolve, reject) {
        connection.query(query, function (error, results, fields) {
            if (error) reject(error);
            resolve(results);
        })
    });
}