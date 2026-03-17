import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Res,
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
import type { Response } from 'express';
import { OperatorsService } from './operators.service';
import { RegisterOperatorDto } from './dto/register-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { OperatorResponseDto } from './dto/operator-response.dto';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('operators')
@Controller('operators')
export class OperatorsController {
  constructor(private readonly operatorsService: OperatorsService) {}

  /**
   * POST /operators/register
   * Public — creates operator account. Rate limited: 3/day per IP.
   */
  @Public()
  @Throttle({ default: { limit: 3, ttl: 24 * 60 * 60 * 1000 } }) // 3 per day
  @Post('register')
  @ApiOperation({ summary: 'Register as a warehouse operator' })
  @ApiResponse({ status: 201, description: 'Operator registered successfully', type: OperatorResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error or passwords do not match' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async register(
    @Body() dto: RegisterOperatorDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, operator } = await this.operatorsService.register(dto);
    const tokens = await this.operatorsService.generateTokens(user);

    this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      operator: {
        id: operator.id,
        user_id: user.id,
        email: user.email,
        name: [user.firstName, user.lastName].filter(Boolean).join(' '),
        role: user.role,
        company_name: operator.companyName,
        is_verified: operator.isVerified,
        onboarding_status: 'pending',
        created_at: operator.createdAt,
      },
      message: 'Registration successful. Your account is pending verification.',
    };
  }

  /**
   * GET /operators/me
   * Returns current operator's profile with statistics.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.operator, UserRole.admin)
  @ApiCookieAuth('auth_token')
  @Get('me')
  @ApiOperation({ summary: 'Get current operator profile' })
  @ApiResponse({ status: 200, description: 'Operator profile', type: OperatorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Operator role required' })
  @ApiResponse({ status: 404, description: 'Operator profile not found' })
  async getProfile(@CurrentUser() user: CurrentUserData) {
    return this.operatorsService.getProfile(user.id);
  }

  /**
   * PUT /operators/me
   * Updates current operator's profile.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.operator, UserRole.admin)
  @ApiCookieAuth('auth_token')
  @Put('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current operator profile' })
  @ApiResponse({ status: 200, description: 'Profile updated', type: OperatorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Operator profile not found' })
  async updateProfile(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: UpdateOperatorDto,
  ) {
    return this.operatorsService.updateProfile(user.id, dto);
  }

  /**
   * GET /operators/me/statistics
   * Returns aggregate statistics for the current operator.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.operator, UserRole.admin)
  @ApiCookieAuth('auth_token')
  @Get('me/statistics')
  @ApiOperation({ summary: 'Get operator performance statistics' })
  @ApiResponse({ status: 200, description: 'Operator statistics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Operator profile not found' })
  async getStatistics(@CurrentUser() user: CurrentUserData) {
    return this.operatorsService.getStatistics(user.id);
  }

  // ── Cookie helpers ──────────────────────────────────────────────────────────

  private setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('auth_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }
}
