import { Controller, Get, UseGuards, Body, Req, Post, Delete, Param } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { JwtAuthGuard } from 'src/users/jwt-auth.guard';
import { CreateFeedDto } from './dto/create-feed.dto';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('feeds')
export class FeedsController {
    constructor(private readonly feedsService: FeedsService) {}

    @Get()
    getFeeds() {
        return this.feedsService.getFeeds();
    }

    @Post()
    createdFeed(
        @Body() feed:CreateFeedDto,
         @Req() request:Request & {user: {id:number}}, 
    ) {
        const userId = request.user.id;
        return this.feedsService.createFeed({ ...feed }, userId);    
    }

    @Delete(':id')
    deleteFeed(@Param('id') id: number) {
        return this.feedsService.deleteFeed(id);
    }
}
