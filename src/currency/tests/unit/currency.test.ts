import { describe, expect, it } from '@jest/globals';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { getCurrencies } from '../../currency';

const axiosMock = new MockAdapter(axios);

jest.mock('aws-sdk', () => ({
  SecretsManager: jest.fn(() => ({ getSecretValue: jest.fn(() => ({ promise: () => 'secretString' })) })),
}));

describe('Unit test for currency handler', function () {
  it('verifies successful response', async () => {
    const event = {
      httpMethod: 'GET',
    } as APIGatewayProxyEvent;

    axiosMock.onGet('https://currency-converter5.p.rapidapi.com/currency/list').reply(200, {});

    const result: APIGatewayProxyResult = await getCurrencies(event);

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toBeInstanceOf(Object);
  });
});
