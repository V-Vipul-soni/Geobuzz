const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    page.on('console', msg => {
      console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
    });
    page.on('pageerror', err => {
      console.log(`[BROWSER ERROR]: ${err.toString()}`);
    });
    page.on('requestfailed', request => {
      console.log(`[REQUEST FAILED] ${request.url()} - ${request.failure()?.errorText || request.response()?.status()}`);
    });
    
    console.log("Navigating to localhost:3000...");
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    console.log("Page loaded. Waiting 2 seconds for React to mount...");
    await new Promise(r => setTimeout(r, 2000));
    
    const html = await page.evaluate(() => document.getElementById('root')?.innerHTML || 'NO ROOT');
    console.log("ROOT HTML DUMP:", html.substring(0, 1500));
    
    await browser.close();
    console.log("Done.");
  } catch (err) {
    console.error("Script failed:", err);
  }
})();
