import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { OvertimeModule } from './overtime/overtime.module';
import { UsersModule } from './users/users.module';
import { DepartementsModule } from './departements/departements.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, DepartementsModule, UsersModule, OvertimeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
