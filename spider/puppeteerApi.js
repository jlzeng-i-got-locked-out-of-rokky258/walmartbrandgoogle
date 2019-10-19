const puppeteer = require('puppeteer');
let browser, page;

puppeteer.launch().then((newBrowser) => {
    browser = newBrowser;
    browser.newPage().then((newPage) => {
        page = newPage;
    })
});

exports.getContent = async (url) => {
    await page.goto(url);

    return await page.evaluate(element => element.innerText, await page.$("body"));
}

exports.getScreenshot = async (url) => {
    await page.goto(url);

    // save screenshot
    await page.setViewport({ height: 1080, width: 1920 })
    return await page.screenshot({ encoding: 'base64' });
}