import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as twilio from 'twilio';

@Injectable()
export class TwilioSignatureGuard implements CanActivate {
  private readonly logger = new Logger(TwilioSignatureGuard.name);
  private readonly authToken: string;

  constructor(private configService: ConfigService) {
    this.authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN') || '';
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // Skip validation in development if configured
    const skipValidation =
      this.configService.get<string>('NODE_ENV') === 'development' &&
      this.configService.get<string>('TWILIO_SKIP_VALIDATION') === 'true';

    if (skipValidation) {
      this.logger.warn('Twilio signature validation SKIPPED (development mode)');
      return true;
    }

    // Get Twilio signature from header
    const twilioSignature = request.headers['x-twilio-signature'] as string;

    if (!twilioSignature) {
      this.logger.error('Missing X-Twilio-Signature header');
      throw new UnauthorizedException('Missing Twilio signature');
    }

    // Construct full URL for validation
    const protocol = request.protocol;
    const host = request.get('host');
    const url = `${protocol}://${host}${request.originalUrl}`;

    // Get request params (Twilio sends form-urlencoded)
    const params = request.body;

    // Validate signature
    try {
      const isValid = twilio.default.validateRequest(
        this.authToken,
        twilioSignature,
        url,
        params,
      );

      if (!isValid) {
        this.logger.error('Invalid Twilio signature');
        throw new UnauthorizedException('Invalid Twilio signature');
      }

      this.logger.debug('Twilio signature validated successfully');
      return true;
    } catch (error) {
      this.logger.error('Error validating Twilio signature:', error);
      throw new UnauthorizedException('Invalid Twilio signature');
    }
  }
}
