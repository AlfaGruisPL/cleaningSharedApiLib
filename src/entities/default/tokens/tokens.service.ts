import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { TokenEntity } from './entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import ms from 'ms';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(TokenEntity)
    private tokensRepository: Repository<TokenEntity>,
  ) {}

  /**
   Function create token in database end return true or false
   * */
  async addTokenToDB(
    user: Partial<UserEntity>,
    refreshToken = false,
  ): Promise<TokenEntity> {
    const userId = user.id;
    const tokenObj = new TokenEntity();
    tokenObj.refresh = refreshToken;
    tokenObj.user = new UserEntity();
    tokenObj.user.id = userId;
    tokenObj.endTime = this.addTime(refreshToken);
    return await this.tokensRepository.save(tokenObj);
  }

  async addTokenToDBByTokenId(
    tokenId: number,
    refreshToken = false,
  ): Promise<[UserEntity, number]> {
    const find_user = await this.tokensRepository.findOneOrFail({
      where: { id: tokenId },
      select: ['user'],
      relations: {
        user: {
          userInGroups: true,
        },
      },
    });
    const tokenObj = new TokenEntity();
    tokenObj.refresh = refreshToken;
    tokenObj.user = new UserEntity();
    tokenObj.user.id = find_user.user.id;
    tokenObj.endTime = this.addTime(refreshToken);
    await this.tokensRepository.save(tokenObj);
    return [tokenObj.user, tokenObj.id];
  }

  async checkTokenActive(tokenId: number) {
    try {
      //  console.log('token id is: ', tokenId);
      const k = await this.tokensRepository.findOneOrFail({
        where: {
          id: tokenId,
        },
      });
      return k;
    } catch (error) {
      return undefined;
    }
  }

  private addTime(refresh: boolean) {
    return new Date(new Date().getTime() + ms(refresh ? '31d' : '15m'));
  }
}
