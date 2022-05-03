import Puppeteer from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as randomUseragent from 'random-useragent';
import { IBaseScan } from '@manga-club/shared/types';
import { USER_AGENT } from './constants';
import { getChrome } from './chrome-script';
import { Logger } from '@nestjs/common';

// Check proxy chain for azure deploy
// https://stackoverflow.com/questions/68930114/bypass-cloudflares-captcha-with-headless-chrome-using-puppeteer-on-heroku

export abstract class BaseScan implements IBaseScan {
  protected browser: Puppeteer.Browser;
  protected page: Puppeteer.Page;

  private pendingRequests: Set<Puppeteer.HTTPRequest> = new Set();
  private requestPromises: Promise<void>[] = [];

  async init(headless = true, resourceType: string[] = ['xhr', 'fetch']) {
    this.log('Initializing browser');
    puppeteer.use(StealthPlugin());
    const chrome = await getChrome(headless);

    this.browser = await puppeteer.connect({
      ignoreHTTPSErrors: true,
      browserWSEndpoint: chrome.endpoint,
    });

    const pages = await this.browser.pages();
    this.page = pages[0];
    this.makeMeAnonymous();
    this.addNetworkMonitor(resourceType);
  }

  async waitForAllRequests() {
    const size = this.pendingRequests.size;
    if (size === 0) {
      return;
    }

    this.log(`Waiting for ${size} requests`);
    await Promise.all(this.requestPromises);
  }

  async navigate(url: string) {
    this.log(`Navigating to url: ${url}`);
    const navigation = this.page.waitForNavigation();
    await this.page.goto(url);
    await navigation;

    this.log(`Navigation Finished`);
  }

  log(msg: string, level: 'log' | 'warn' | 'error' = 'log') {
    Logger[level](`[SCRAPER] ${msg}`);
  }

  async close() {
    this.log('Closing Browser');
    await this.browser.close();
  }

  async refresh() {
    await this.close();
    await this.init();
  }
  private async makeMeAnonymous() {
    this.log('Making me anonymous');
    const userAgent = randomUseragent.getRandom();
    const UA = userAgent || USER_AGENT;

    await this.page.setViewport({
      width: 1920 + Math.floor(Math.random() * 100),
      height: 3000 + Math.floor(Math.random() * 100),
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: false,
      isMobile: false,
    });

    await this.page.setUserAgent(UA);
    await this.page.setJavaScriptEnabled(true);
    await this.page.setCacheEnabled(false);
    this.page.setDefaultNavigationTimeout(0);
  }

  private async addNetworkMonitor(resourceType: string[] = ['xhr', 'fetch']) {
    this.log('Adding network monitor');
    this.page.setRequestInterception(true);

    this.page.on('request', (request) => {
      request.continue();
      if (!resourceType.includes(request.resourceType())) return;
      this.log(`- [NETWORK] request "${request._requestId}" found`);

      this.pendingRequests.add(request);
      this.requestPromises.push(
        new Promise((resolve) => {
          request['resolver'] = resolve;
        })
      );
    });

    this.page.on('requestfailed', (request) => {
      if (!resourceType.includes(request.resourceType())) return;
      this.log(
        `- [NETWORK] the request "${request.url()}" failed with status: ${request
          .response()
          .status()}`,
        'error'
      );

      if (request['resolver']) {
        request['resolver']();
        delete request['resolver'];
      }
      this.pendingRequests.delete(request);
    });

    this.page.on('requestfinished', (request) => {
      if (!resourceType.includes(request.resourceType())) return;
      this.log(`- [NETWORK] the request "${request._requestId}" finished`);

      if (request['resolver']) {
        request['resolver']();
        delete request['resolver'];
      }

      this.pendingRequests.delete(request);
    });
  }
}
