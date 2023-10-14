import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('')
  CreateCategory(
    @Body() dto: CreateCategoryDto,
    @Param('userId') userId: string,
  ) {
    return this.categoryService.createCategory(dto, userId);
  }

  @Patch(':userId/:categoryId')
  updateCategory(
    @Body() dto: UpdateCategoryDto,
    @Param('userId') userId: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.categoryService.updateCategory(dto, userId, categoryId);
  }

  @Get(':categoryId')
  getCategoryDetails(@Param('categoryId') categoryId: string) {
    return this.categoryService.getCategoryDetails(categoryId);
  }

  @Get('all/:categoryId')
  getAllArtInCategory(
    @Query() dto: PaginationDto,
    @Param('categoryId') categoryId: string,
  ) {
    return this.categoryService.getAllArtInCategory(categoryId, dto);
  }
}
