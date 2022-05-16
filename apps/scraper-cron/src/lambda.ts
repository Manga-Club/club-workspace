import { APIGatewayProxyResult } from 'aws-lambda';
import { verifyComics } from './app/mangas';

export const verifyAllComicsHandler = async (): //event: APIGatewayProxyEvent
Promise<APIGatewayProxyResult> => {
  try {
    await verifyComics();
    return {
      statusCode: 200,
      body: `{ "success": true }`,
    };
  } catch (err) {
    console.log('ERROR: ', err.message);
    return {
      statusCode: 500,
      body: `{ "success": false }`,
    };
  }
};
