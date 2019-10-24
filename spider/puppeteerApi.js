const puppeteer = require('puppeteer');
let browser;

puppeteer.launch({ args: ['--no-sandbox'], headless: true }).then((newBrowser) => {
    browser = newBrowser;
});

exports.getContent = async (url) => {
    let page, content;
    try {
        page = await browser.newPage();
        await page.goto(url);
        content = await page.evaluate(element => element.innerText, await page.$("body"));
    } catch (e) {
        console.log(e);
    } finally {
        await page.close();
    }

    return content;
}

// Takes in a url. Returns a base64 encoded screenshot if the site can be visited, otherwise it returns undefined.
exports.getScreenshot = async (url, width, height) => {
    let page, screenshot;
    try {
        page = await browser.newPage();
        await page.goto(url);
        await page.setViewport({ width, height });
        screenshot = await page.screenshot({ encoding: 'base64' });
    } catch (e) {
        console.log(e);
    } finally {
        await page.close();
    }  

    console.log(`Took screenshot of ${url}`);

    return screenshot;
}