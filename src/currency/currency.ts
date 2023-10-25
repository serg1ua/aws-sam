import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import axios from 'axios';

class CurrencyHandler {
  private baseUrl = 'https://currency-converter5.p.rapidapi.com';
  private secretManagerClient;

  constructor() {
    this.secretManagerClient = new AWS.SecretsManager();
  }

  async getCurrencies(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const { SecretString } = await this.secretManagerClient
        .getSecretValue({
          SecretId: 'rapidApiKey',
        })
        .promise();

      const options = {
        url: `${this.baseUrl}/currency/list`,
        method: event.httpMethod,
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
  }

  async convertCurrency(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const { queryStringParameters, httpMethod: method } = event;

    try {
      const { SecretString } = await this.secretManagerClient
        .getSecretValue({
          SecretId: 'rapidApiKey',
        })
        .promise();

      const options = {
        url: `${this.baseUrl}/currency/convert`,
        method,
        params: {
          format: queryStringParameters?.format ?? 'json',
          from: queryStringParameters?.from,
          to: queryStringParameters?.to,
          amount: queryStringParameters?.amount,
        },
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
  }
}

const currencyHandler = new CurrencyHandler();

export const getCurrencies = currencyHandler.getCurrencies.bind(currencyHandler);
export const convertCurrency = currencyHandler.convertCurrency.bind(currencyHandler);
