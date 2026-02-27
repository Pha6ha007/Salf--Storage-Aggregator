import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryFavoritesDto } from './dto/query-favorites.dto';
import { plainToInstance } from 'class-transformer';
import { FavoriteResponseDto, PaginatedFavoritesResponseDto } from './dto/favorite-response.dto';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Add warehouse to user's favorites
   * Idempotent operation - returns existing favorite if already exists
   */
  async addFavorite(userId: string, warehouseId: number) {
    // Verify warehouse exists and is active
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse || warehouse.deletedAt) {
      throw new NotFoundException('Warehouse not found');
    }

    // Check if favorite already exists
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_warehouseId: {
          userId,
          warehouseId,
        },
      },
      include: {
        warehouse: {
          include: {
            media: {
              where: {
                isPrimary: true,
              },
              take: 1,
            },
          },
        },
      },
    });

    if (existingFavorite) {
      // Return existing favorite (idempotent)
      return this.transformFavorite(existingFavorite);
    }

    // Create new favorite
    const favorite = await this.prisma.favorite.create({
      data: {
        userId,
        warehouseId,
      },
      include: {
        warehouse: {
          include: {
            media: {
              where: {
                isPrimary: true,
              },
              take: 1,
            },
          },
        },
      },
    });

    return this.transformFavorite(favorite);
  }

  /**
   * Remove warehouse from user's favorites
   */
  async removeFavorite(userId: string, warehouseId: number) {
    // Check if favorite exists
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_warehouseId: {
          userId,
          warehouseId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    // Delete favorite
    await this.prisma.favorite.delete({
      where: {
        userId_warehouseId: {
          userId,
          warehouseId,
        },
      },
    });

    return {
      message: 'Favorite removed successfully',
      warehouse_id: warehouseId,
    };
  }

  /**
   * Get user's favorite warehouses with pagination
   */
  async getUserFavorites(userId: string, queryDto: QueryFavoritesDto) {
    const { page = 1, per_page = 10 } = queryDto;

    // Build where clause
    const where = {
      userId,
    };

    // Get total count
    const total = await this.prisma.favorite.count({ where });

    // Get favorites with pagination
    const favorites = await this.prisma.favorite.findMany({
      where,
      include: {
        warehouse: {
          include: {
            media: {
              where: {
                isPrimary: true,
              },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * per_page,
      take: per_page,
    });

    const data = favorites.map((favorite) => this.transformFavorite(favorite));

    return {
      data,
      pagination: {
        total,
        page,
        per_page,
        total_pages: Math.ceil(total / per_page),
      },
    } as PaginatedFavoritesResponseDto;
  }

  /**
   * Check if warehouse is favorited by user
   */
  async isFavorited(userId: string, warehouseId: number): Promise<boolean> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_warehouseId: {
          userId,
          warehouseId,
        },
      },
    });

    return !!favorite;
  }

  /**
   * Transform favorite data to DTO format
   */
  private transformFavorite(favorite: any): FavoriteResponseDto {
    const transformedData = {
      id: favorite.id,
      warehouse_id: favorite.warehouseId,
      created_at: favorite.createdAt,
      warehouse: {
        id: favorite.warehouse.id,
        name: favorite.warehouse.name,
        address: favorite.warehouse.address,
        emirate: favorite.warehouse.emirate,
        rating: Number(favorite.warehouse.rating),
        review_count: favorite.warehouse.reviewCount,
        primary_image: favorite.warehouse.media[0]?.fileUrl || null,
      },
    };

    return plainToInstance(FavoriteResponseDto, transformedData, {
      excludeExtraneousValues: true,
    });
  }
}
