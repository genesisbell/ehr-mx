import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Role } from '@ehr-mx/shared';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/interfaces/request-user.interface';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { CreateProvisionalPatientDto } from './dto/create-provisional-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientQueryDto } from './dto/patient-query.dto';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post('provisional')
  @Roles(Role.RECEPTION, Role.NURSE)
  @HttpCode(HttpStatus.CREATED)
  createProvisional(
    @Body() dto: CreateProvisionalPatientDto,
    @CurrentUser() user: RequestUser,
    @Req() req: Request,
  ) {
    return this.patientService.createProvisional(dto, {
      userId: user.userId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Post()
  @Roles(Role.DOCTOR)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreatePatientDto,
    @CurrentUser() user: RequestUser,
    @Req() req: Request,
  ) {
    return this.patientService.create(dto, {
      userId: user.userId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Get()
  findAll(@Query() query: PatientQueryDto) {
    return this.patientService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.DOCTOR)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePatientDto,
    @CurrentUser() user: RequestUser,
    @Req() req: Request,
  ) {
    return this.patientService.update(id, dto, {
      userId: user.userId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }
}
