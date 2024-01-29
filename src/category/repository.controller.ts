import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('category-endpoints')
@Controller('category')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Post('')
  @ApiOperation({ summary: 'Create a category' })
  CreateRepository(
    @Body() dto: CreateRepositoryDto,
    // @Param('userId') userId: string,
    @Req() req,
  ) {
    return this.repositoryService.createRepository(dto, req.user.userId);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Patch(':categoryId')
  @ApiOperation({ summary: 'Update a category details' })
  updateRepository(
    @Body() dto: UpdateRepositoryDto,
    // @Param('userId') userId: string,
    @Param('categoryId') categoryId: string,
    @Req() req,
  ) {
    return this.repositoryService.updateRepository(
      dto,
      req.user.userId,
      categoryId,
    );
  }

  @Get(':categoryId')
  @ApiOperation({ summary: 'Get a category details by id' })
  getRepositoryDetails(@Param('categoryId') categoryId: string) {
    return this.repositoryService.getRepositoryDetails(categoryId);
  }

  @Get('all/:categoryId')
  @ApiOperation({ summary: 'Get all artwork in a category' })
  getAllArtInRepository(
    @Query() dto: PaginationDto,
    @Param('categoryId') categoryId: string,
  ) {
    return this.repositoryService.getAllArtInRepository(categoryId, dto);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all available categories' })
  getAllAvailableRepositories() {
    return this.repositoryService.getAllAvailableRepositories();
  }
}
