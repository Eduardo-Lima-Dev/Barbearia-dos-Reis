import { Module } from '@nestjs/common';
import { HaircutsService } from './haircuts.service';
import { HaircutsController } from './haircuts.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        MulterModule.register({
            dest: './uploads',
        }),
    ],
    controllers: [HaircutsController],
    providers: [HaircutsService],
})
export class HaircutsModule { }
