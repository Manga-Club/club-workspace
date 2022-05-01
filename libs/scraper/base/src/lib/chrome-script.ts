/* eslint-disable @typescript-eslint/no-explicit-any */
import launchChrome from '@serverless-chrome/lambda';
import request from 'superagent';

export interface IChrome {
  endpoint: string;
  instance: any;
}

export const getChrome = async (): Promise<IChrome> => {
  const chrome = await launchChrome();

  const response = await request
    .get(`${chrome.url}/json/version`)
    .set('Content-Type', 'application/json');

  const endpoint = response.body.webSocketDebuggerUrl;

  return {
    endpoint,
    instance: chrome,
  };
};
