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
import { RepositoryService } from './repository.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('repository-endpoints')
@Controller('repository')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Post('')
  CreateCategory(
    @Body() dto: CreateRepositoryDto,
    @Param('userId') userId: string,
  ) {
    return this.repositoryService.createRepository(dto, userId);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Patch(':userId/:categoryId')
  updateCategory(
    @Body() dto: UpdateRepositoryDto,
    @Param('userId') userId: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.repositoryService.updateRepository(dto, userId, categoryId);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Get(':categoryId')
  getCategoryDetails(@Param('categoryId') categoryId: string) {
    return this.repositoryService.getRepositoryDetails(categoryId);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Get('all/:categoryId')
  getAllArtInCategory(
    @Query() dto: PaginationDto,
    @Param('categoryId') categoryId: string,
  ) {
    return this.repositoryService.getAllArtInRepository(categoryId, dto);
  }
}
