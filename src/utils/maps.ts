const AVG_SPEED_KMH = 28;

export function estimateMinutes(distanceKm: number): number {
  return (distanceKm / AVG_SPEED_KMH) * 60;
}
