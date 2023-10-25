import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import axios from 'axios';

const secretManagerClient = new AWS.SecretsManager();
const url = 'https://weatherapi-com.p.rapidapi.com/current.json';

export const getLocalWeather = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { SecretString } = await secretManagerClient
      .getSecretValue({
        SecretId: 'rapidApiKey',
      })
      .promise();

    const options = {
      url,
      method: event.httpMethod,
      params: { q: event.queryStringParameters?.q },
      headers: {
        'X-RapidAPI-Key': SecretString ? JSON.parse(SecretString).rapidApiKey : '',
      },
    };

    const { data } = await axios.request(options);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Some error happened ${err}`,
      }),
    };
  }
};
