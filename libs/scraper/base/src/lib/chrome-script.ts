/* eslint-disable @typescript-eslint/no-explicit-any */
import launchChrome from '@serverless-chrome/lambda';
import request from 'superagent';

export interface IChrome {
  endpoint: string;
  instance: any;
}

export const getChrome = async (headless = true): Promise<IChrome> => {
  const flags = ['--no-sandbox', '--disable-setuid-sandbox'];
  if (headless) flags.push('--headless');

  const chrome = await launchChrome({
    flags,
  });

  const response = await request
    .get(`${chrome.url}/json/version`)
    .set('Content-Type', 'application/json');

  const endpoint = response.body.webSocketDebuggerUrl;

  return {
    endpoint,
    instance: chrome,
  };
};
