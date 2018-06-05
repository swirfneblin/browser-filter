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
    await page.addScriptTag({ path: 'cssxpathutils.js' });

    const itens = await page.evaluate(() => {
        debugger;
        try {
            return retrieveCssOrXpathSelector('denmark.*national.*day.*2018', ['a'], 'css');
        } catch (err) {
            console.log(err);
        }
    });

    console.log(itens);
    await browser.close();
})();