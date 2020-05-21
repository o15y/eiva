export interface GeoLocation {
    city?: string;
    country_code?: string;
    continent?: string;
    latitude?: number;
    longitude?: number;
    time_zone?: string;
    accuracy_radius?: number;
    zip_code?: string;
    region_name?: string;
}
export declare const getGeolocationFromIp: (ipAddress: string) => Promise<GeoLocation | undefined>;
