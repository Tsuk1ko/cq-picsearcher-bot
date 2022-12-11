import { executablePath } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

class Puppeteer {
  async launch() {
    if (this.browser) return;
    if (global.config.bot.debug) console.log('Puppeteer launching');
    this.browser = await puppeteer.launch({ headless: true, executablePath: executablePath() });
    if (global.config.bot.debug) console.log('Puppeteer launched');
  }

  async get(url, waitSelector) {
    await this.launch();
    const page = await this.browser.newPage();
    try {
      if (global.config.bot.debug) console.log('Puppeteer get', url);
      await page.goto(url);
      await page.waitForSelector(waitSelector).catch(e => {
        console.error(`Puppeteer get "${url}" wait "${waitSelector}" error`);
        console.error(e);
      });
      const res = await page.evaluate(() => ({
        request: {
          res: {
            responseUrl: window.location.href,
          },
        },
        data: document.documentElement.outerHTML,
      }));
      return res;
    } catch (e) {
      console.error(`Puppeteer get "${url}" error`);
      throw e;
    } finally {
      page.close();
    }
  }

  async getJSON(url) {
    await this.launch();
    const page = await this.browser.newPage();
    try {
      if (global.config.bot.debug) console.log('Puppeteer get JSON', url);
      await page.goto(url);
      await page.waitForSelector('body > pre');
      const res = await page.evaluate(() => ({
        request: {
          res: {
            responseUrl: window.location.href,
          },
        },
        data: JSON.parse(document.querySelector('body > pre').innerText),
      }));
      return res;
    } catch (e) {
      console.error(`Puppeteer get JSON "${url}" error`);
      throw e;
    } finally {
      page.close();
    }
  }
}

const _puppeteer = new Puppeteer();

export { _puppeteer as puppeteer };
