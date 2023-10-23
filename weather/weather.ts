import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import axios from 'axios';

const secretManagerClient = new AWS.SecretsManager();

export const getLocalWeather = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('🚀 ~ file: weather.ts:8 ~ getLocalWeather ~ event:', event);
  try {
    const { SecretString } = await secretManagerClient
      .getSecretValue({
        SecretId: 'rapidApiKey',
      })
      .promise();

    const options = {
      method: 'GET',
      url: 'https://weatherapi-com.p.rapidapi.com/current.json',
      params: { q: '53.1,-0.13' },
      headers: {
        'X-RapidAPI-Key': JSON.parse(SecretString).rapidApiKey,
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
