import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { verifyComics } from './app/mangas';

export const verifyAllComicsHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const queries = JSON.stringify(event.queryStringParameters);
  console.log('---TEST---');
  await verifyComics();
  return {
    statusCode: 200,
    body: `Queries: ${queries}`,
  };
};

(async () => {
  // await verifyComics();
})();
