/* eslint-disable @typescript-eslint/no-explicit-any */
import { Browser } from 'puppeteer-core';
import Chromium from 'chrome-aws-lambda';
import { addExtra } from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

export const getBrowser = async (isProduction = true): Promise<Browser> => {
  if (isProduction) {
    return initBrowserForLambda();
  } else {
    return initPuppeteerBrowser();
  }
};

const initPuppeteerBrowser = async () => {
  const puppeteer = await import('puppeteer');
  const extra = addExtra(puppeteer);
  extra.use(StealthPlugin());
  return (await extra.launch({
    headless: false,
  })) as any;
};

const initBrowserForLambda = async () => {
  const puppeteer = addExtra(Chromium.puppeteer as any);
  puppeteer.use(StealthPlugin());
  return (await puppeteer.launch({
    headless: true,
    ignoreDefaultArgs: ['--enable-automation'],
    args: [...Chromium.args],
    executablePath: await Chromium.executablePath,
  })) as any;
};
