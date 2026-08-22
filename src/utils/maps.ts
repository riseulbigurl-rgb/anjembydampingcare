export interface ParsedCoords {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_KM = 6371;
const ROAD_FACTOR = 1.4;
const AVG_SPEED_KMH = 28;

export function parseMapsUrl(url: string): ParsedCoords | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const u = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const host = u.hostname.replace(/^www\./, '');

    if (host === 'maps.app.goo.gl' || host === 'goo.gl' || host === 'maps.google.com') {
      return null;
    }

    const q = u.searchParams.get('query');
    if (q) {
      const m = q.match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/);
      if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
    }

    const center = u.searchParams.get('center');
    if (center) {
      const m = center.match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/);
      if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
    }

    const atMatch = u.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
    if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };

    const d3d = u.pathname.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
    if (d3d) return { lat: parseFloat(d3d[1]), lng: parseFloat(d3d[2]) };

    return null;
  } catch {
    return null;
  }
}

export function isShortLink(url: string): boolean {
  const t = url.trim();
  if (!t) return false;
  try {
    const u = new URL(t.startsWith('http') ? t : `https://${t}`);
    const h = u.hostname.replace(/^www\./, '');
    return h === 'maps.app.goo.gl' || h === 'goo.gl' || h === 'maps.google.com';
  } catch {
    return false;
  }
}

export function haversineKm(a: ParsedCoords, b: ParsedCoords): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export function estimateRoadKm(a: ParsedCoords, b: ParsedCoords): number {
  return haversineKm(a, b) * ROAD_FACTOR;
}

export function estimateMinutes(distanceKm: number): number {
  return (distanceKm / AVG_SPEED_KMH) * 60;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
