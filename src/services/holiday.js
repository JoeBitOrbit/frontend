import client from './client';

export const getHolidayStatus = async () => {
  try {
    const response = await client.get('/api/holiday/status');
    return response;
  } catch (error) {
    console.log('Could not fetch from API, using localStorage fallback');
    const stored = localStorage.getItem('holidayMode');
    if (stored) {
      return { data: JSON.parse(stored) };
    }
    return { data: { enabled: true, discount: 25 } };
  }
};

export const setHolidaySettings = async (settings) => {
  try {
    const response = await client.post('/api/holiday/toggle', settings);
    localStorage.setItem('holidayMode', JSON.stringify(response.data.mode || settings));
    return response;
  } catch (error) {
    throw new Error('Failed to update holiday settings');
  }
};

export const updateHolidayDiscount = async (discount) => {
  try {
    const response = await client.put('/api/holiday/discount', { discount });
    return response;
  } catch (error) {
    throw new Error('Failed to update holiday discount');
  }
};
