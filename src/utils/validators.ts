export function isValidLat(lat: number) { return !Number.isNaN(lat) && lat >= -90 && lat <= 90 }
export function isValidLon(lon: number) { return !Number.isNaN(lon) && lon >= -180 && lon <= 180 }
export function isZipFile(name: string) { return name.toLowerCase().endsWith('.zip') }
