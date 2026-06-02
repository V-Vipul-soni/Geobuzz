export const regenerateHotels = async (location, traveler, budget) => {
  try {
    const response = await fetch('/api/regenerate-hotels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location, traveler, budget })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    throw new Error("Failed to regenerate hotels: " + error.message);
  }
};

export const regenerateDay = async (location, dayNumber, totalDays, traveler, budget) => {
  try {
    const response = await fetch('/api/regenerate-day', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location, dayNumber, totalDays, traveler, budget })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    throw new Error("Failed to regenerate day: " + error.message);
  }
};
