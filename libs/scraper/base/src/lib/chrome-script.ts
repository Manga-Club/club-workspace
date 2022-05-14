/* eslint-disable @typescript-eslint/no-explicit-any */
import { Browser } from 'puppeteer-core';
import Chromium from 'chrome-aws-lambda';
import puppeteerFromExtra, { addExtra } from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

export interface IChrome {
  endpoint: string;
  instance: any;
}

export const getBrowser = async (isProduction = true): Promise<Browser> => {
  const launchOptions = {
    headless: isProduction,
    ignoreDefaultArgs: ['--enable-automation'],
    args: [],
  };

  let puppeteer = null;
  let executablePath;
  if (isProduction) {
    puppeteer = addExtra(Chromium.puppeteer as any);
    executablePath = await Chromium.executablePath;

    launchOptions['args'] = [...launchOptions.args, ...Chromium.args];
  } else {
    const { default: mainPuppeteer } = await import('puppeteer');
    executablePath = mainPuppeteer['executablePath']();
    puppeteer = puppeteerFromExtra;
  }

  launchOptions['executablePath'] = executablePath;
  puppeteer.use(StealthPlugin());
  return await puppeteer.launch(launchOptions);
};
