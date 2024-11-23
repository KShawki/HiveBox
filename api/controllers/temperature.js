import axios from 'axios';
import moment from 'moment';

const OPEN_SENSE_MAP_BASE_URL = 'https://api.opensensemap.org/boxes';

const temperature = async (req, res) => {
  try {
    const response = await axios.get(`${OPEN_SENSE_MAP_BASE_URL}/boxes`, {
      params: { bbox: '-125,29,-101,49' },
    });

    // Log the full response data
    console.log('API Response:', JSON.stringify(response.data, null, 2));

    const boxes = response.data;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const temperatures = [];

    boxes.forEach((box) => {
      if (box.sensors) {
        box.sensors.forEach((sensor) => {
          if (
            sensor.title &&
            sensor.title.toLowerCase().includes('temperature')
          ) {
            const latestMeasurement = sensor.lastMeasurement;

            if (latestMeasurement) {
              const sensorTime = new Date(latestMeasurement.createdAt);
              if (sensorTime > oneHourAgo) {
                temperatures.push(parseFloat(latestMeasurement.value));
              }
            }
          }
        });
      }
    });

    if (temperatures.length > 0) {
      const avgTemp =
        temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
      res.json({
        averageTemperature: avgTemp,
        count: temperatures.length,
        message: 'Average temperature calculated successfully.',
      });
    } else {
      res.status(404).json({ message: 'No recent temperature data found.' });
    }
  } catch (error) {
    console.error('Error Details:', error);
    res.status(500).json({ error: 'Error fetching temperature data.' });
  }
};
export default temperature;
