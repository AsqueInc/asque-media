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
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@ApiSecurity('JWT-auth')
@ApiTags('repository-endpoints')
@Controller('repository')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a repository to categorize artwork' })
  CreateRepository(
    @Body() dto: CreateRepositoryDto,
    @Param('userId') userId: string,
  ) {
    return this.repositoryService.createRepository(dto, userId);
  }

  @Patch(':userId/:repositoryId')
  @ApiOperation({ summary: 'Update a repository details' })
  updateRepository(
    @Body() dto: UpdateRepositoryDto,
    @Param('userId') userId: string,
    @Param('repositoryId') repositoryId: string,
  ) {
    return this.repositoryService.updateRepository(dto, userId, repositoryId);
  }

  @Get(':repositoryId')
  @ApiOperation({ summary: 'Get a repository details by id' })
  getCategoryDetails(@Param('repositoryId') repositoryId: string) {
    return this.repositoryService.getRepositoryDetails(repositoryId);
  }

  @Get('all/:repositoryId')
  @ApiOperation({ summary: 'Get all artwork in a repository' })
  getAllArtInRepository(
    @Query() dto: PaginationDto,
    @Param('repositoryId') repositoryId: string,
  ) {
    return this.repositoryService.getAllArtInRepository(repositoryId, dto);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all available repositories' })
  getAllAvailableRepositories() {
    return this.repositoryService.getAllAvailableRepositories();
  }
}
