import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { User } from '@/modules/auth/decorators/user.decorator';
import { InstructorGuard } from '@/modules/auth/guards/instructor.guard';

import { CreateTemplateUseCase } from '../use-cases/create-template.use-case';
import { DeleteTemplateUseCase } from '../use-cases/delete-template.use-case';
import { GetInstructorTemplateInfoUseCase } from '../use-cases/get-instructor-template-info.use-case';
import { GetInstructorTemplatesUseCase } from '../use-cases/get-instructor-templates.use-case';
import { UpdateTemplateUseCase } from '../use-cases/update-template.use-case';
import { TemplateDto, UpdateTemplateDto } from './dtos/template.dto';
import {
  TemplateListResponse,
  TemplateResponse,
} from './dtos/template.response';

@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@Controller('instructors/:instructorId/templates')
@UseGuards(InstructorGuard)
export class TemplateController {
  constructor(
    private readonly createTemplateUseCase: CreateTemplateUseCase,
    private readonly getTemplatesUseCase: GetInstructorTemplatesUseCase,
    private readonly getTemplateInfoUseCase: GetInstructorTemplateInfoUseCase,
    private readonly updateTemplateUseCase: UpdateTemplateUseCase,
    private readonly deleteTemplateUseCase: DeleteTemplateUseCase,
  ) {}

  @Post()
  async createTemplate(
    @Body() dto: TemplateDto,
    @Param('instructorId') instructorId: string,
    @User('id') userId: string,
  ) {
    await this.createTemplateUseCase.execute({
      ...dto,
      instructorId,
      actorId: userId,
    });
    return { error: false, message: 'created' };
  }

  @Get()
  async getInstructorTemplates(
    @Param('instructorId') instructorId: string,
    @User('id') userId: string,
  ) {
    const templates = await this.getTemplatesUseCase.execute(
      userId,
      instructorId,
    );
    return plainToInstance(TemplateListResponse, templates);
  }

  @Get(':templateId')
  async getTemplateInfo(
    @Param('instructorId') instructorId: string,
    @Param('templateId') templateId: string,
    @User('id') userId: string,
  ) {
    const template = await this.getTemplateInfoUseCase.execute(
      userId,
      templateId,
    );
    return plainToInstance(TemplateResponse, template);
  }

  @Patch(':templateId')
  async updateTemplate(
    @Param('templateId') templateId: string,
    @User('id') userId: string,
    @Body() dto: UpdateTemplateDto,
  ) {
    await this.updateTemplateUseCase.execute({
      actorId: userId,
      templateId,
      ...dto,
    });
    return { error: false, message: 'updated' };
  }

  @Delete(':templateId')
  async deleteTemplate(
    @Param('templateId') templateId: string,
    @User('id') userId: string,
  ) {
    await this.deleteTemplateUseCase.execute(userId, templateId);
    return { error: false, message: 'deleted' };
  }
}
