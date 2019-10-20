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

let searchTerm = "hack";
let searchWords = searchTerm.split(" ");

async function searchAll(searchWords) {
    for (let i = 0; i < urls.length; ++i) {
        searchWords[i] = searchWords[i].trim();
        await searcher(searchWords[i]);
    }
}

searchAll(searchWords).then(res=>console.log("Parse all done"));


async function searcher(word){
    try {

    } catch (e) {
        console.log(e);
    }

}
