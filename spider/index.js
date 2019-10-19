
let express = require('express')
let app = express()

let renderer = require('./puppeteerApi')


// Api endpoint to get the complete content of a page.
app.get('/getpagecontent', async (req, res) => {
    try {
        res.send(await renderer.getContent(req.query.url));
    } catch (e) {
        res.send(e);
    }
})

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

app.use(express.static("static"));

app.listen(3000)
