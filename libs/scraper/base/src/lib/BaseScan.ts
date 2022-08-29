/* eslint-disable @typescript-eslint/no-explicit-any */
import { Browser, Page, WaitForOptions } from 'puppeteer-core';
import * as randomUseragent from 'random-useragent';
import { IBaseScan } from '@manga-club/shared/types';
import { USER_AGENT } from './constants';
import { debug, info, isProduction } from '@manga-club/shared/util';
import { getBrowser } from './chrome-script';

// Check proxy chain for azure deploy
// https://stackoverflow.com/questions/68930114/bypass-cloudflares-captcha-with-headless-chrome-using-puppeteer-on-heroku

export abstract class BaseScan implements IBaseScan {
  protected browser: Browser;
  protected page: Page;

  private resourceType: string[];

  async init(resourceType: string[] = ['xhr', 'fetch']) {
    const isProd = isProduction();
    info(`Initializing browser as ${isProd ? 'production' : 'NOT production'}`);
    this.browser = await getBrowser(isProd);

    debug('Browser Connected');

    const pages = await this.browser.pages();
    if (pages.length > 0) {
      this.page = pages[0];
    } else {
      this.page = await this.browser.newPage();
    }

    this.makeMeAnonymous();
    // this.addNetworkMonitor(resourceType);
    this.resourceType = resourceType;
  }

  async navigate(url: string, options?: WaitForOptions) {
    info(`Navigating to url: ${url}`);
    const navigation = this.page.waitForNavigation({
      ...options,
    });
    await this.page.goto(url, options);
    await navigation;

    debug(`Navigation Finished`);
  }

  async close() {
    info('Closing Browser');
    await this.browser.close();
    this.browser = undefined;
    this.page = undefined;
  }

  async isCloudFlarePage() {
    return await this.page.evaluate(() => {
      const errDiv = document.querySelector('#cf-error-details');
      return errDiv !== null;
    });
  }

  async refresh() {
    await this.close();
    await this.init(this.resourceType);
  }

  private async makeMeAnonymous() {
    debug('Making me anonymous');
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
}
