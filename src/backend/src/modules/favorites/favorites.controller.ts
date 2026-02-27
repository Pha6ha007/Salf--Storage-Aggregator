import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { QueryFavoritesDto } from './dto/query-favorites.dto';
import { FavoriteResponseDto, PaginatedFavoritesResponseDto } from './dto/favorite-response.dto';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.user, UserRole.operator, UserRole.admin)
@ApiCookieAuth('auth_token')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get user\'s favorite warehouses (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: 'integer', example: 1 })
  @ApiQuery({ name: 'per_page', required: false, type: 'integer', example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Favorites retrieved successfully',
    type: PaginatedFavoritesResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserFavorites(
    @CurrentUser() user: CurrentUserData,
    @Query() queryDto: QueryFavoritesDto,
  ) {
    return this.favoritesService.getUserFavorites(user.id, queryDto);
  }

  @Post(':warehouseId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add warehouse to favorites',
    description: 'Idempotent operation - returns existing favorite if already exists',
  })
  @ApiParam({ name: 'warehouseId', description: 'Warehouse ID', type: 'integer' })
  @ApiResponse({
    status: 201,
    description: 'Warehouse added to favorites successfully',
    type: FavoriteResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  async addFavorite(
    @CurrentUser() user: CurrentUserData,
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
  ) {
    return this.favoritesService.addFavorite(user.id, warehouseId);
  }

  @Delete(':warehouseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove warehouse from favorites' })
  @ApiParam({ name: 'warehouseId', description: 'Warehouse ID', type: 'integer' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse removed from favorites successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Favorite removed successfully' },
        warehouse_id: { type: 'integer', example: 101 },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  async removeFavorite(
    @CurrentUser() user: CurrentUserData,
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
  ) {
    return this.favoritesService.removeFavorite(user.id, warehouseId);
  }
}
