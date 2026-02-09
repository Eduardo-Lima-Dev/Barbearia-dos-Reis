import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, Query, ParseIntPipe } from '@nestjs/common';
import { HaircutsService } from './haircuts.service';
import { CreateHaircutDto, UpdateHaircutDto } from './dto/haircut.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AnyFilesInterceptor } from '@nestjs/platform-express'; // Use FilesInterceptor for specific field
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiConsumes, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('haircuts')
@Controller('haircuts')
export class HaircutsController {
    constructor(private readonly haircutsService: HaircutsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor('files', 4, {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        }
    }))
    create(
        @Body() createHaircutDto: CreateHaircutDto,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        return this.haircutsService.create(createHaircutDto, files || []);
    }

    @Get()
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10'
    ) {
        return this.haircutsService.findAll(+page, +limit);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.haircutsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    update(@Param('id') id: string, @Body() updateHaircutDto: UpdateHaircutDto) {
        return this.haircutsService.update(id, updateHaircutDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    remove(@Param('id') id: string) {
        return this.haircutsService.remove(id);
    }
}
