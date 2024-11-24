import axios from 'axios';

const OPEN_SENSE_MAP_BASE_URL = 'https://api.opensensemap.org/boxes';

const temperature = async (_req, res) => {
  try {
    const response = await axios.get(OPEN_SENSE_MAP_BASE_URL, {
      params: { bbox: '-125,29,-101,49' },
    });

    // Log the full response data for debugging
    console.log('API Response Data:', JSON.stringify(response.data, null, 2));

    const boxes = response.data;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const temperatures = [];

    boxes.forEach((box) => {
      box?.sensors?.forEach((sensor) => {
        if (
          sensor?.title?.toLowerCase()?.includes('temperature') &&
          sensor?.lastMeasurement?.value
        ) {
          const sensorTime = new Date(sensor.lastMeasurement.createdAt);
          if (!isNaN(sensorTime) && sensorTime > oneHourAgo) {
            temperatures.push(parseFloat(sensor.lastMeasurement.value));
          }
        }
      });
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
    console.error('Error fetching temperature data:', error.message);
    res.status(500).json({ error: 'Error fetching temperature data.' });
  }
};
export default temperature;
