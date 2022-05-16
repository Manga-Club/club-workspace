/* eslint-disable @typescript-eslint/no-explicit-any */
import { Browser } from 'puppeteer-core';
import Chromium from 'chrome-aws-lambda';
import { addExtra } from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

export const getBrowser = async (isProduction = true): Promise<Browser> => {
  const puppeteer = addExtra(Chromium.puppeteer as any);
  puppeteer.use(StealthPlugin());
  return (await puppeteer.launch({
    headless: isProduction,
    ignoreDefaultArgs: ['--enable-automation'],
    args: [...Chromium.args],
    executablePath: await Chromium.executablePath,
  })) as any;
};
