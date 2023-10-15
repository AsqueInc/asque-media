import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/auth.guard';

@ApiTags('category-endpoints')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Post('')
  CreateCategory(
    @Body() dto: CreateCategoryDto,
    @Param('userId') userId: string,
  ) {
    return this.categoryService.createCategory(dto, userId);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Patch(':userId/:categoryId')
  updateCategory(
    @Body() dto: UpdateCategoryDto,
    @Param('userId') userId: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.categoryService.updateCategory(dto, userId, categoryId);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Get(':categoryId')
  getCategoryDetails(@Param('categoryId') categoryId: string) {
    return this.categoryService.getCategoryDetails(categoryId);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Get('all/:categoryId')
  getAllArtInCategory(
    @Query() dto: PaginationDto,
    @Param('categoryId') categoryId: string,
  ) {
    return this.categoryService.getAllArtInCategory(categoryId, dto);
  }
}
