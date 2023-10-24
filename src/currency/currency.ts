import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import axios from 'axios';

const secretManagerClient = new AWS.SecretsManager();
const baseUrl = 'https://currency-converter5.p.rapidapi.com';

export const getCurrencies = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { SecretString } = await secretManagerClient
      .getSecretValue({
        SecretId: 'rapidApiKey',
      })
      .promise();

    const options = {
      url: `${baseUrl}/currency/list`,
      method: event.httpMethod,
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
