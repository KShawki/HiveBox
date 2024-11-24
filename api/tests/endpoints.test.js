import { describe, test, expect, vi } from 'vitest';
import request from 'supertest'; // To make HTTP requests to the Express app
import app from '../index.js'; // Assuming your main app file is named app.js

describe('GET /', () => {
  test('should return "HiveBox!"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toBe('HiveBox!');
  });
});

describe('GET /version', () => {
  test('should return the correct version', async () => {
    const response = await request(app).get('/version');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ version: 'v0.0.2' });
  });
});

describe('GET /temperature', () => {
  test('should return average temperature when data is available', async () => {
    // Mock axios to return specific test data
    const mockTemperatureData = [
      {
        sensors: [
          {
            title: 'Temperature Sensor',
            lastMeasurement: {
              value: '23.5',
              createdAt: new Date().toISOString(),
            },
          },
        ],
      },
    ];

    const axios = await import('axios');
    vi.spyOn(axios.default, 'get').mockResolvedValue({
      data: mockTemperatureData,
    });

    const response = await request(app).get('/temperature');
    expect(response.status).toBe(200);
    expect(response.body.averageTemperature).toBe(23.5);
    expect(response.body.count).toBe(1);
    expect(response.body.message).toBe(
      'Average temperature calculated successfully.'
    );
  });

  test('should return 404 when no recent temperature data is found', async () => {
    // Mock axios to return data with no recent measurements
    const mockTemperatureData = [
      {
        sensors: [
          {
            title: 'Temperature Sensor',
            lastMeasurement: {
              value: '23.5',
              createdAt: new Date(
                Date.now() - 2 * 60 * 60 * 1000
              ).toISOString(), // 2 hours ago
            },
          },
        ],
      },
    ];

    const axios = await import('axios');
    vi.spyOn(axios.default, 'get').mockResolvedValue({
      data: mockTemperatureData,
    });

    const response = await request(app).get('/temperature');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No recent temperature data found.');
  });

  test('should return 500 when there is an error fetching data', async () => {
    // Mock axios to simulate an error
    const axios = await import('axios');
    vi.spyOn(axios.default, 'get').mockRejectedValue(new Error('API Error'));

    const response = await request(app).get('/temperature');
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error fetching temperature data.');
  });
});
