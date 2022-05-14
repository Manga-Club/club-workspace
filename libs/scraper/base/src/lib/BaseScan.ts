/* eslint-disable @typescript-eslint/no-explicit-any */
import { Browser, Page, HTTPRequest } from 'puppeteer-core';
import * as randomUseragent from 'random-useragent';
import { IBaseScan } from '@manga-club/shared/types';
import { USER_AGENT } from './constants';
import { debug, info, success, warn } from '@manga-club/shared/util';
import { getBrowser } from './chrome-script';

// Check proxy chain for azure deploy
// https://stackoverflow.com/questions/68930114/bypass-cloudflares-captcha-with-headless-chrome-using-puppeteer-on-heroku

export abstract class BaseScan implements IBaseScan {
  protected browser: Browser;
  protected page: Page;

  private pendingRequests: Set<HTTPRequest> = new Set();
  private requestPromises: Promise<void>[] = [];

  async init(isProduction = true, resourceType: string[] = ['xhr', 'fetch']) {
    info('Initializing browser');
    this.browser = await getBrowser(isProduction);

    debug('Browser Connected');

    const pages = await this.browser.pages();
    if (pages.length > 0) {
      this.page = pages[0];
    } else {
      this.page = await this.browser.newPage();
    }

    this.makeMeAnonymous();
    this.addNetworkMonitor(resourceType);
  }

  async waitForAllRequests() {
    const size = this.pendingRequests.size;
    if (size === 0) {
      return;
    }

    info(`Waiting for ${size} requests`);
    await Promise.all(this.requestPromises);
  }

  async navigate(url: string) {
    info(`Navigating to url: ${url}`);
    const navigation = this.page.waitForNavigation();
    await this.page.goto(url);
    await navigation;

    debug(`Navigation Finished`);
  }

  async close() {
    info('Closing Browser');
    await this.browser.close();
  }

  async refresh() {
    await this.close();
    await this.init();
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

  private async addNetworkMonitor(resourceType: string[] = ['xhr', 'fetch']) {
    debug('Adding network monitor');
    this.page.setRequestInterception(true);

    this.page.on('request', (request) => {
      request.continue();
      if (!resourceType.includes(request.resourceType())) return;
      debug(`- [NETWORK] request "${request._requestId}" found`);

      this.pendingRequests.add(request);
      this.requestPromises.push(
        new Promise((resolve) => {
          request['resolver'] = resolve;
        })
      );
    });

    this.page.on('requestfailed', (request) => {
      if (!resourceType.includes(request.resourceType())) return;
      warn(
        `- [NETWORK] the request "${
          request._requestId
        }"(${request.url()}) failed`,
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
      success(`- [NETWORK] the request "${request._requestId}" finished`);

      if (request['resolver']) {
        request['resolver']();
        delete request['resolver'];
      }

      this.pendingRequests.delete(request);
    });
  }
}
