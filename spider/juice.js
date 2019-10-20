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
let arrayofUrlthenCount;
let searchTerm = "hack";
let searchWords = searchTerm.split(" ");

function sortCount(a, b) {
    return a.count - b.count;
}

async function searchAll(searchWords) {
    for (let i = 0; i < searchWords.length; ++i) {
        searchWords[i] = searchWords[i].trim();
        await searcher(searchWords[i]);
        arrayofUrlthenCount.sort(sortCount);
    }
}

searchAll(searchWords).then(res=>console.log("Search all done"));


async function searcher(word){
    try {
        connection.query(`SELECT (SELECT url FROM documents WHERE id = words.document) AS url, words.count FROM words WHERE word = "${word}";`, async function (error, results, fields) {
            if (error) throw error;
           for(let x = 0; x < results.length; ++x){
               for(let y = 0; y <= arrayofUrlthenCount.size; ++y){
                   if(y === arrayofUrlthenCount.size){
                       arrayofUrlthenCount.push(results[x]);
                   }
                   else{
                       if(arrayofUrlthenCount[y].url === results[x].url){
                           arrayofUrlthenCount[y].count += results[x].count;
                       }
                   }
               }
           }
        })
    } catch (e) {
        console.log(e);
    }

}
