let loaderPromise: Promise<typeof google> | null = null;

export function loadGoogleMaps(apiKey: string): Promise<typeof google> {
  if (typeof window.google !== 'undefined' && window.google.maps) {
    return Promise.resolve(window.google);
  }
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise((resolve, reject) => {
    if (!apiKey) {
      reject(new Error('NO_API_KEY'));
      return;
    }
    const cb = '__anjem_gmaps_init__';
    (window as unknown as Record<string, unknown>)[cb] = () => resolve(window.google);
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&v=weekly&callback=${cb}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error('LOAD_FAILED'));
    document.head.appendChild(script);
  });

  return loaderPromise;
}

export function isMapsReady(): boolean {
  return typeof window.google !== 'undefined' && !!window.google.maps;
}
