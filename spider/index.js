
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
        try {
            connection.query(`SELECT (SELECT url FROM documents WHERE id = words.document) AS url, (words.count / documents.count), documents.description FROM words, documents WHERE word = "${word}" AND documents.id = words.document;`, function (error, results, fields) {
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
        } catch (e) {
            resolve();
        }
        
    }).catch((e)=>console.log(e));

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
        let screenshot = await renderer.getScreenshot(req.query.url, req.query.width || 1920, req.query.height || 1080);
        if (screenshot == undefined) {
            res.send("error");
        } else if (req.query.pretty != null) {
            res.send(`<img src="data:image/png;base64, ${screenshot}" />`);
        } else {
            res.send(screenshot);
        }
    } catch (e) {
        res.send(e);
    }
})

app.get('/searchapi', async (req, res) => {
    searchAll(req.query.search).then(results => {
        let json = {
            "results": results.map(result => ({
                "url": result.url,
                "description": result.description
            }))
        }
        res.send(json);
    });
});


app.use(express.static("static"));

app.listen(3000)
