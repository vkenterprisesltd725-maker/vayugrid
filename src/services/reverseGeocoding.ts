export interface ResolvedAddress {
  fullAddress: string;
  shortName: string;
  locality: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
}

/**
 * Reverse geocodes latitude and longitude into human-readable street/locality/city address
 * Uses dual free open endpoints: BigDataCloud + OpenStreetMap Nominatim fallback
 */
export async function reverseGeocodeCoordinates(
  latitude: number,
  longitude: number
): Promise<ResolvedAddress> {
  // 1. Try BigDataCloud Free Reverse Geocode Client (Fast, CORS friendly, structured)
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();

      const locality = data.locality || data.city || '';
      const city = data.city || data.principalSubdivision || 'Local Area';
      const state = data.principalSubdivision || '';
      const country = data.countryName || 'Global';
      const postcode = data.postcode || '';

      // Build readable short and full address
      const parts = [locality, city, state, country].filter(
        (p, idx, arr) => p && arr.indexOf(p) === idx
      );
      const fullAddress = parts.join(', ') + (postcode ? ` (${postcode})` : '');
      const shortName = locality && locality !== city ? `${locality}, ${city}` : city;

      return {
        fullAddress,
        shortName,
        locality,
        city,
        state,
        country,
        postalCode: postcode,
        latitude,
        longitude,
      };
    }
  } catch (e) {
    console.warn('BigDataCloud reverse geocode error, attempting Nominatim fallback:', e);
  }

  // 2. Fallback: OpenStreetMap Nominatim
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const res = await fetch(nominatimUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      const locality = addr.suburb || addr.neighbourhood || addr.road || addr.village || '';
      const city = addr.city || addr.town || addr.county || 'Local Area';
      const state = addr.state || '';
      const country = addr.country || 'Global';
      const postcode = addr.postcode || '';

      return {
        fullAddress: data.display_name || `${locality}, ${city}, ${country}`,
        shortName: locality ? `${locality}, ${city}` : city,
        locality,
        city,
        state,
        country,
        postalCode: postcode,
        latitude,
        longitude,
      };
    }
  } catch (e) {
    console.warn('Nominatim reverse geocode error:', e);
  }

  // Generic fallback if network offline
  return {
    fullAddress: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
    shortName: `Location (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`,
    locality: '',
    city: 'Current Location',
    state: '',
    country: 'Auto-Detected',
    latitude,
    longitude,
  };
}
