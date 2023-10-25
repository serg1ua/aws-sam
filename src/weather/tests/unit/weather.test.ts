import { describe, expect, it } from '@jest/globals';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import * as weatherModule from '../../weather';

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

    const spy = jest.spyOn(weatherModule, 'getLocalWeather');
    axiosMock.onGet('https://weatherapi-com.p.rapidapi.com/current.json').reply(200, {});

    const result: APIGatewayProxyResult = await weatherModule.getLocalWeather(event);

    expect(spy).toBeCalledWith(event);
    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toBeInstanceOf(Object);
  });

  it('verifies failed response', async () => {
    const event = {
      httpMethod: 'GET',
      queryStringParameters: {
        q: 'Kyiv',
      },
    } as unknown as APIGatewayProxyEvent;

    const spy = jest.spyOn(weatherModule, 'getLocalWeather');
    axiosMock.onGet('https://weatherapi-com.p.rapidapi.com/current.json').reply(500, undefined);

    const result: APIGatewayProxyResult = await weatherModule.getLocalWeather(event);

    expect(spy).toBeCalledWith(event);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toBe('{"message":"Some error happened Error: Request failed with status code 500"}');
  });
});
