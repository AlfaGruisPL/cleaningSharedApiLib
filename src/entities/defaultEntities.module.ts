import { Module } from '@nestjs/common';
import { UsersModule } from './default/users/users.module';
import { TokensModule } from './default/tokens/tokens.module';
import { AspectsModule } from './aspects/aspects.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [UsersModule, TokensModule, AspectsModule, ProjectsModule],
  controllers: [],
  exports: [UsersModule, TokensModule, AspectsModule, ProjectsModule],
})
export class DefaultEntitiesModule {}
