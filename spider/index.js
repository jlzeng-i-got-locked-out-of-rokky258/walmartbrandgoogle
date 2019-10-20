
let express = require('express')
let app = express()
let sw = require('stopword')

let renderer = require('./puppeteerApi')

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'walmartbrandgoogle',
    port: '3306'
});

connection.connect();

let arrayofUrlthenCount = [];
function sortCount(a, b) {
    return b.count - a.count;
}

async function searchAll(searchTerms) {
    arrayofUrlthenCount = [];
    let searchWords = sw.removeStopwords(searchTerms.split(" "));
    
    for (let i = 0; i < searchWords.length; ++i) {
        searchWords[i] = searchWords[i].trim();
        await searcher(searchWords[i]);
        arrayofUrlthenCount.sort(sortCount);
    }
    return arrayofUrlthenCount;
}

function searcher(word) {
    let res = new Promise(function (resolve, reject) {
        connection.query(`SELECT (SELECT url FROM documents WHERE id = words.document) AS url, words.count FROM words WHERE word = "${word}", desc FROM documents WHERE id = words.document;`, function (error, results, fields) {
            if (error) throw error;
            for (let x = 0; x < results.length; ++x) {
                for (let y = 0; y <= arrayofUrlthenCount.length; ++y) {
                    if (y === arrayofUrlthenCount.length) {
                        arrayofUrlthenCount.push(results[x]);
                        break;
                    } else {
                        if (arrayofUrlthenCount[y].url === results[x].url) {
                            arrayofUrlthenCount[y].count += results[x].count;
                            break;
                        }
                    }
                }
            }
            resolve();
        })
    });

    return res;
}



// Api endpoint to get the complete content of a page.
app.get('/getpagecontent', async (req, res) => {
    try {
        res.send(await renderer.getContent(req.query.url));
    } catch (e) {
        res.send(e);
    }
})

app.get('/getsitedescription', async (req, res) => {
    let content = await renderer.getContent(req.query.url);
    let pos = content.toLowerCase().indexOf(req.query.val.toLowerCase());
    res.send(content.slice(pos, pos + 400));
});

// Api endpoint to get a base64 encoded screenshot of a page
app.get('/getpagescreenshot', async (req, res) => {
    try {
        let screenshot = await renderer.getScreenshot(req.query.url);
        if (req.query.pretty != null) {
            res.send(`<img src="data:image/png;base64, ${screenshot}" />`);
        } else {
            res.send(screenshot);
        }
    } catch (e) {
        res.send(e);
    }
})

app.get('/searchapi', async (req, res) => {
    
    searchAll(req.query.search).then(
        result => {
            let list = [];
            for (let i = 0; i < result.length; i ++) {
                list.push({
                    "url": result[i].url,
                    "description": "HAHA strech goals am i right"
                });
            }
            res.send({
                "results" :list
                
            });
        }
    );
    // res.send(`
    //         {"results": [
    //             {
    //                 "url": "https://google.com",
    //                 "description": "This is a fake description but there are real very bad descriptions we also have"
    //             },
    //             {
    //                 "url": "https://facebook.com",
    //                 "description": "This is another, not real description"
    //             }
    //         ]}
    // `);
})


app.use(express.static("static"));

app.listen(3000)
