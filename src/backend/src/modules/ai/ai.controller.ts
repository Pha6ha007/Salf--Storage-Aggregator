import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AiService } from './ai.service';
import { BoxRecommendationRequestDto } from './dto/box-recommendation-request.dto';
import { BoxRecommendationResponseDto } from './dto/box-recommendation-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import type { CurrentUserData } from '../../common/decorators/current-user.decorator';

/**
 * AI Box Recommendation endpoint
 * Can be used by authenticated users or anonymously
 */
@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('box-recommendation')
  @Public() // Allow anonymous access
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute (AI)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get AI-powered box size recommendation',
    description:
      'Analyzes user storage needs and recommends appropriate box size. ' +
      'Works with or without authentication. Authenticated users get better tracking.',
  })
  @ApiCookieAuth('auth_token')
  @ApiResponse({
    status: 200,
    description: 'Box recommendation generated successfully',
    type: BoxRecommendationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
  })
  @ApiResponse({
    status: 429,
    description: 'Rate limit exceeded',
  })
  async getBoxRecommendation(
    @Body() request: BoxRecommendationRequestDto,
    @CurrentUser() user?: CurrentUserData,
  ) {
    return this.aiService.getBoxRecommendation(request, user?.id);
  }
}
