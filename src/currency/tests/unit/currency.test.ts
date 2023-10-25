import { describe, expect, it } from '@jest/globals';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import * as currencyModule from '../../currency';

const axiosMock = new MockAdapter(axios);

jest.mock('aws-sdk', () => ({
  SecretsManager: jest.fn(() => ({ getSecretValue: jest.fn(() => ({ promise: () => 'secretString' })) })),
}));

describe('Unit test for currency handler', function () {
  afterEach(() => jest.clearAllMocks());

  it('verifies successful getCurrencies response', async () => {
    const event = {
      httpMethod: 'GET',
    } as APIGatewayProxyEvent;

    const spy = jest.spyOn(currencyModule, 'getCurrencies');
    axiosMock.onGet('https://currency-converter5.p.rapidapi.com/currency/list').reply(200, {});

    const result: APIGatewayProxyResult = await currencyModule.getCurrencies(event);

    expect(result.statusCode).toEqual(200);
    expect(spy).toBeCalledWith(event);
    expect(JSON.parse(result.body)).toBeInstanceOf(Object);
  });

  it('verifies failed getCurrencies response', async () => {
    const event = {
      httpMethod: 'GET',
    } as APIGatewayProxyEvent;

    const spy = jest.spyOn(currencyModule, 'getCurrencies');
    axiosMock.onGet('https://currency-converter5.p.rapidapi.com/currency/list').reply(500, undefined);

    const result: APIGatewayProxyResult = await currencyModule.getCurrencies(event);

    expect(result.statusCode).toEqual(500);
    expect(spy).toBeCalledWith(event);
    expect(result.body).toBe('{"message":"Some error happened Error: Request failed with status code 500"}');
  });

  it('verifies successful convertCurrency response', async () => {
    const event = {
      httpMethod: 'GET',
      queryStringParameters: {
        from: 'USD',
        to: 'EUR',
        amount: 10,
      },
    } as unknown as APIGatewayProxyEvent;

    const spy = jest.spyOn(currencyModule, 'convertCurrency');
    axiosMock.onGet('https://currency-converter5.p.rapidapi.com/currency/convert').reply(200, {});

    const result: APIGatewayProxyResult = await currencyModule.convertCurrency(event);

    expect(result.statusCode).toEqual(200);
    expect(spy).toBeCalledWith(event);
    expect(JSON.parse(result.body)).toBeInstanceOf(Object);
  });

  it('verifies failed convertCurrency response', async () => {
    const event = {
      httpMethod: 'GET',
      queryStringParameters: {
        from: 'USD',
        to: 'EUR',
        amount: 10,
      },
    } as unknown as APIGatewayProxyEvent;

    const spy = jest.spyOn(currencyModule, 'convertCurrency');
    axiosMock.onGet('https://currency-converter5.p.rapidapi.com/currency/convert').reply(500, undefined);

    const result: APIGatewayProxyResult = await currencyModule.convertCurrency(event);

    expect(result.statusCode).toEqual(500);
    expect(spy).toBeCalledWith(event);
    expect(result.body).toBe('{"message":"Some error happened Error: Request failed with status code 500"}');
  });
});
