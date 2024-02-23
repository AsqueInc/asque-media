import { Controller, Get, Param } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('search-endpoints')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get(':title/:location')
  @ApiOperation({ summary: 'Search for items ' })
  search(@Param('title') title: string, @Param('location') location: string) {
    return this.searchService.search(location, title);
  }
}
