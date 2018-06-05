const puppeteer = require('puppeteer');
(async () => {

    const browser = await puppeteer.launch({
        devtools: true,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    page.on('console', msg => console.log(msg.text()));

    await page.goto('https://www.google.com/doodles/');
    await page.addScriptTag({ path: 'helper.js' });

    const itens = await page.evaluate(() => {
        debugger;
        return _findElemByText({
            str: '/denmark.*national.*day.*2018/',
            selector: ['a'],
        });
    });

    console.log(itens);
    await browser.close();
})();