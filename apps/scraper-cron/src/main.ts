import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getAllChapters } from './app/chapters';
import { Neoxscans } from '@manga-club/scraper/scans';

const scan = new Neoxscans();

export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const queries = JSON.stringify(event.queryStringParameters);
  console.log('---TEST---');
  await getAllChapters();
  return {
    statusCode: 200,
    body: `Queries: ${queries}`,
  };
};

(async () => {
  await scan.init(false);
  const a = await scan.getAllMangas();
  console.log(a);
  await scan.close();
})();
