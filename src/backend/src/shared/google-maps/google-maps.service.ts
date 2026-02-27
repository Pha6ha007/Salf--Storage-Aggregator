import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

@Injectable()
export class GoogleMapsService {
  private readonly logger = new Logger(GoogleMapsService.name);
  private readonly apiKey: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.apiKey = this.configService.get<string>('googleMaps.apiKey');
  }

  async geocodeAddress(address: string): Promise<GeocodeResult> {
    // Check cache first
    const cached = await this.prisma.geoCache.findUnique({
      where: { addressQuery: address },
    });

    if (cached && (!cached.expiresAt || cached.expiresAt > new Date())) {
      this.logger.log(`Geocode cache hit for: ${address}`);
      return {
        latitude: cached.latitude,
        longitude: cached.longitude,
        formattedAddress: cached.formattedAddress || address,
      };
    }

    // Call Google Maps Geocoding API
    if (!this.apiKey) {
      this.logger.warn('Google Maps API key not configured, using fallback coordinates');
      return this.getFallbackCoordinates(address);
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' || !data.results || data.results.length === 0) {
        this.logger.error(`Geocoding failed for ${address}: ${data.status}`);
        return this.getFallbackCoordinates(address);
      }

      const result = data.results[0];
      const location = result.geometry.location;

      const geocodeResult: GeocodeResult = {
        latitude: location.lat,
        longitude: location.lng,
        formattedAddress: result.formatted_address,
      };

      // Cache the result (30 days expiry)
      await this.prisma.geoCache.upsert({
        where: { addressQuery: address },
        update: {
          latitude: geocodeResult.latitude,
          longitude: geocodeResult.longitude,
          formattedAddress: geocodeResult.formattedAddress,
          provider: 'google_maps',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        create: {
          addressQuery: address,
          latitude: geocodeResult.latitude,
          longitude: geocodeResult.longitude,
          formattedAddress: geocodeResult.formattedAddress,
          provider: 'google_maps',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      this.logger.log(`Geocoded ${address} to (${geocodeResult.latitude}, ${geocodeResult.longitude})`);
      return geocodeResult;
    } catch (error) {
      this.logger.error(`Error geocoding address ${address}:`, error);
      return this.getFallbackCoordinates(address);
    }
  }

  private getFallbackCoordinates(address: string): GeocodeResult {
    // Default fallback: Dubai coordinates
    // In production, this should extract emirate from address and use emirate-specific defaults
    const emirateLower = address.toLowerCase();

    if (emirateLower.includes('dubai')) {
      return { latitude: 25.2048, longitude: 55.2708, formattedAddress: address };
    } else if (emirateLower.includes('abu dhabi')) {
      return { latitude: 24.4539, longitude: 54.3773, formattedAddress: address };
    } else if (emirateLower.includes('sharjah')) {
      return { latitude: 25.3463, longitude: 55.4209, formattedAddress: address };
    } else if (emirateLower.includes('ajman')) {
      return { latitude: 25.4052, longitude: 55.5136, formattedAddress: address };
    } else if (emirateLower.includes('ras al khaimah') || emirateLower.includes('rak')) {
      return { latitude: 25.7896, longitude: 55.9434, formattedAddress: address };
    } else if (emirateLower.includes('fujairah')) {
      return { latitude: 25.1288, longitude: 56.3265, formattedAddress: address };
    } else if (emirateLower.includes('umm al quwain') || emirateLower.includes('uaq')) {
      return { latitude: 25.5647, longitude: 55.5533, formattedAddress: address };
    }

    // Default to Dubai center
    return { latitude: 25.2048, longitude: 55.2708, formattedAddress: address };
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    if (!this.apiKey) {
      return `${latitude}, ${longitude}`;
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${this.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }

      return `${latitude}, ${longitude}`;
    } catch (error) {
      this.logger.error(`Error reverse geocoding (${latitude}, ${longitude}):`, error);
      return `${latitude}, ${longitude}`;
    }
  }
}
