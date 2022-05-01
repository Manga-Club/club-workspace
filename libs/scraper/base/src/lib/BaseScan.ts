import Puppeteer from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as randomUseragent from 'random-useragent';
import { IBaseScan } from '@manga-club/shared/types';
import { USER_AGENT } from './constants';
import { getChrome } from './chrome-script';

// Check proxy chain for azure deploy
// https://stackoverflow.com/questions/68930114/bypass-cloudflares-captcha-with-headless-chrome-using-puppeteer-on-heroku

export abstract class BaseScan implements IBaseScan {
  _browser: Puppeteer.Browser;
  _page: Puppeteer.Page;

  async init() {
    puppeteer.use(StealthPlugin());
    const chrome = await getChrome();

    const browser = await puppeteer.connect({
      ignoreHTTPSErrors: true,
      browserWSEndpoint: chrome.endpoint,
    });

    // const browser = await puppeteer.launch({
    //   headless: true,
    //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
    //   ignoreHTTPSErrors: true,
    //   dumpio: false
    // });

    this.setBrowser(browser);

    const page = await browser.newPage();

    const userAgent = randomUseragent.getRandom();
    const UA = userAgent || USER_AGENT;

    await page.setViewport({
      width: 1920 + Math.floor(Math.random() * 100),
      height: 3000 + Math.floor(Math.random() * 100),
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: false,
      isMobile: false,
    });

    await page.setUserAgent(UA);
    await page.setJavaScriptEnabled(true);
    page.setDefaultNavigationTimeout(0);

    this.setPage(page);
  }

  async close() {
    const browser = this.getBrowser();
    await browser.close();
  }

  async refresh() {
    await this.close();
    await this.init();
  }

  getBrowser() {
    return this._browser;
  }

  getPage() {
    return this._page;
  }

  setBrowser(browser: Puppeteer.Browser) {
    this._browser = browser;
  }

  setPage(page: Puppeteer.Page) {
    this._page = page;
  }
}
