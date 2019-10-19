const puppeteer = require('puppeteer');
let browser, page;

puppeteer.launch().then((newBrowser)=>{
    browser = newBrowser;
    browser.newPage().then((newPage)=> {
        page = newPage;
    })
});

let express = require('express')
let app = express()

// Api endpoint to get the complete content of a page.
app.get('/getpagecontent', async (req, res) => {
    try {
        console.log(req.query.url)
        await page.goto(req.query.url);

        // Get body content.
        let body = await page.$("body");
        let content = await page.evaluate(element => element.innerText, body);
        res.send(content);
    } catch (e) {
        res.send(e);
    }
})

// Api endpoint to get a base64 encoded screenshot of a page
app.get('/getpagescreenshot', async (req, res) => {
    try {
        console.log(req.query.url)
        await page.goto(req.query.url);

        // save screenshot
        await page.setViewport({height:1080, width:1920})
        let screenshot = await page.screenshot({ encoding: 'base64'});

        if (req.query.pretty != null) {
            res.send(`<img src="data:image/png;base64, ${screenshot}" />`);
        } else {
            res.send(screenshot);
        }
    } catch (e) {
        res.send(e);
    }
})

app.listen(3000)
