import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { AccessTokenGuard } from '../common/guards';
import { GetCurrentUserId } from '../common/decorators';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Favorites')
@ApiBearerAuth()
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Create a favorite house', description: 'Add a house to the current user favorites' })
  @ApiBody({ type: CreateFavoriteDto })
  @ApiResponse({ status: 201, description: 'Favorite created successfully', type: Object })
  @ApiResponse({ status: 404, description: 'User or House not found' })
  @ApiResponse({ status: 400, description: 'House already in favorites' })
  create(@GetCurrentUserId() userId: number, @Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.create(+userId, createFavoriteDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Get all favorites', description: 'Returns all favorite houses of the current user' })
  @ApiResponse({ status: 200, description: 'List of favorites', type: [Object] })
  @ApiResponse({ status: 400, description: 'No favorites found' })
  findAll(@GetCurrentUserId() userId: number) {
    return this.favoritesService.findAll(+userId);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Get a favorite by ID', description: 'Returns a favorite house by its ID for the current user' })
  @ApiParam({ name: 'id', type: Number, description: 'Favorite ID' })
  @ApiResponse({ status: 200, description: 'Favorite found', type: Object })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  @ApiResponse({ status: 400, description: 'Favorite does not belong to current user' })
  findOne(@GetCurrentUserId() userId: number, @Param('id') id: string) {
    return this.favoritesService.findOne(+userId, +id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Update a favorite', description: 'Update a favorite house (change house) for current user' })
  @ApiParam({ name: 'id', type: Number, description: 'Favorite ID' })
  @ApiBody({ type: UpdateFavoriteDto })
  @ApiResponse({ status: 200, description: 'Favorite updated successfully', type: Object })
  @ApiResponse({ status: 404, description: 'Favorite or house not found' })
  @ApiResponse({ status: 400, description: 'House already in favorites or not yours' })
  update(@GetCurrentUserId() userId: number, @Param('id') id: string, @Body() updateFavoriteDto: UpdateFavoriteDto) {
    return this.favoritesService.update(+userId, +id, updateFavoriteDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Delete a favorite', description: 'Remove a favorite house from the current user' })
  @ApiParam({ name: 'id', type: Number, description: 'Favorite ID' })
  @ApiResponse({ status: 200, description: 'Favorite deleted successfully', type: Object })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  remove(@GetCurrentUserId() userId: number, @Param('id') id: string) {
    return this.favoritesService.remove(+userId, +id);
  }
}