import { describe, expect, it } from '@jest/globals';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { getLocalWeather } from '../../weather';

const axiosMock = new MockAdapter(axios);

jest.mock('aws-sdk', () => ({
  SecretsManager: jest.fn(() => ({ getSecretValue: jest.fn(() => ({ promise: () => 'secretString' })) })),
}));

describe('Unit test for weather handler', function () {
  it('verifies successful response', async () => {
    const event = {
      httpMethod: 'GET',
      queryStringParameters: {
        q: 'Kyiv',
      },
    } as unknown as APIGatewayProxyEvent;

    axiosMock.onGet('https://weatherapi-com.p.rapidapi.com/current.json').reply(200, {});

    const result: APIGatewayProxyResult = await getLocalWeather(event);

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toBeInstanceOf(Object);
  });
});
