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
let arrayofUrlthenCount = [];
let searchTerm = "hack ios";
let searchWords = searchTerm.split(" ");

function sortCount(a, b) {
    return a.count - b.count;
}

async function searchAll(searchWords) {
    for (let i = 0; i < searchWords.length; ++i) {
        searchWords[i] = searchWords[i].trim();
        await searcher(searchWords[i]);
        console.log("WUT")
        arrayofUrlthenCount.sort(sortCount);
    }
    return arrayofUrlthenCount;
}

searchAll(searchWords).then(res=>console.log(res));


function searcher(word){

    let res = new Promise(function (resolve, reject) {
        connection.query(`SELECT (SELECT url FROM documents WHERE id = words.document) AS url, words.count FROM words WHERE word = "${word}";`, function (error, results, fields) {
            if (error) throw error;
            for (let x = 0; x < results.length; ++x) {
                for (let y = 0; y <= arrayofUrlthenCount.length; ++y) {
                    if (y === arrayofUrlthenCount.length) {
                        console.log("GOT TO FIRST BRANCH")
                        arrayofUrlthenCount.push(results[x]);
                        break;
                    } else {
                        console.log("GOT TO SECOND BRANCH")
                        if (arrayofUrlthenCount[y].url === results[x].url) {
                            arrayofUrlthenCount[y].count += results[x].count;
                        }
                    }
                }
            }
            resolve();
        })
    });

    return res;
}
