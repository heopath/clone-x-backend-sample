import { Get, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Feed } from './feed.entity'

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(Feed)
    private feedRepository: Repository<Feed>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getFeeds() {
    const feeds = await this.feedRepository.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    return feeds.map((feed) => ({
      id: feed.id,
      content: feed.content,
      created_at: feed.created_at,
      user: {
        id: feed.user.id,
        name: feed.user.name,
      },
    }));
  }

  async createFeed(feed: CreateFeedDto, userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newFeed = this.feedRepository.create({
      content: feed.content,
      user,
    });

      return await this.feedRepository.save(newFeed);
    }

    async deleteFeed(id: number) {
      return await this.feedRepository.delete(id);
    }

/*     async getFeedWithUsers() {
      const feeds = await this.feedRepository.find({
      relations: ['user'],
      order: {created_at : 'DESC' },
    });

    const feedWithUserInfo = feeds.map((feed) => ({
      ...feed,
      user: {
        id: feed.user.id,
        name: feed.user.name,
      },
    }))
    return feedWithUserInfo;
  } */
}
