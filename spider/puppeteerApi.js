const puppeteer = require('puppeteer');
let browser, page;

puppeteer.launch({ args: ['--no-sandbox'] }).then((newBrowser) => {
    browser = newBrowser;
    browser.newPage().then((newPage) => {
        page = newPage;
    })
});

exports.getContent = async (url) => {
    try {
        await page.goto(url);
        return await page.evaluate(element => element.innerText, await page.$("body"));
    } catch (e) {
        return await "";
    }
}

exports.getScreenshot = async (url) => {
    try {
        await page.goto(url);

        // save screenshot
        await page.setViewport({ height: 1080, width: 1920 })
        return await page.screenshot({ encoding: 'base64' });
    } catch (e) {
        return await "";
    }
}