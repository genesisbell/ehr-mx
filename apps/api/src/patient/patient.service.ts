import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma, PatientStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { CreateProvisionalPatientDto } from './dto/create-provisional-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientQueryDto } from './dto/patient-query.dto';

interface AuditContext {
  userId: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService) {}

  async createProvisional(
    dto: CreateProvisionalPatientDto,
    ctx: AuditContext,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const patient = await tx.patient.create({
        data: {
          name: dto.name,
          paternalSurname: dto.paternalSurname,
          maternalSurname: dto.maternalSurname,
          phone: dto.phone,
          status: PatientStatus.PROVISIONAL,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: ctx.userId,
          action: 'PATIENT_CREATED',
          entityType: 'Patient',
          entityId: patient.id,
          metadata: { ...dto, status: 'PROVISIONAL' },
          ipAddress: ctx.ipAddress,
          userAgent: ctx.userAgent,
        },
      });

      return patient;
    });
  }

  async create(dto: CreatePatientDto, ctx: AuditContext) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const patient = await tx.patient.create({
          data: {
            curp: dto.curp,
            name: dto.name,
            paternalSurname: dto.paternalSurname,
            maternalSurname: dto.maternalSurname,
            phone: dto.phone,
            birthDate: new Date(dto.birthDate),
            sex: dto.sex,
            status: PatientStatus.COMPLETE,
          },
        });

        await tx.auditLog.create({
          data: {
            userId: ctx.userId,
            action: 'PATIENT_CREATED',
            entityType: 'Patient',
            entityId: patient.id,
            metadata: { ...dto, status: 'COMPLETE' },
            ipAddress: ctx.ipAddress,
            userAgent: ctx.userAgent,
          },
        });

        return patient;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'A patient with this CURP already exists',
        );
      }
      throw error;
    }
  }

  async findAll(query: PatientQueryDto) {
    const where: Prisma.PatientWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      const term = query.search;
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { paternalSurname: { contains: term, mode: 'insensitive' } },
        { maternalSurname: { contains: term, mode: 'insensitive' } },
        { curp: { equals: term.toUpperCase() } },
        { phone: { contains: term } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.patient.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.patient.count({ where }),
    ]);

    return { data, total, page: query.page, limit: query.limit };
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  async update(id: string, dto: UpdatePatientDto, ctx: AuditContext) {
    const existing = await this.findOne(id);

    const data: Prisma.PatientUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.paternalSurname !== undefined)
      data.paternalSurname = dto.paternalSurname;
    if (dto.maternalSurname !== undefined)
      data.maternalSurname = dto.maternalSurname;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.curp !== undefined) data.curp = dto.curp;
    if (dto.birthDate !== undefined)
      data.birthDate = new Date(dto.birthDate);
    if (dto.sex !== undefined) data.sex = dto.sex;

    // Auto-promote to COMPLETE if all required fields are present
    const willHaveCurp = dto.curp ?? existing.curp;
    const willHaveBirthDate = dto.birthDate ?? existing.birthDate;
    const willHaveSex = dto.sex ?? existing.sex;
    if (
      existing.status === PatientStatus.PROVISIONAL &&
      willHaveCurp &&
      willHaveBirthDate &&
      willHaveSex
    ) {
      data.status = PatientStatus.COMPLETE;
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const patient = await tx.patient.update({
          where: { id },
          data,
        });

        await tx.auditLog.create({
          data: {
            userId: ctx.userId,
            action: 'PATIENT_UPDATED',
            entityType: 'Patient',
            entityId: id,
            metadata: { changes: { ...dto }, previousStatus: existing.status },
            ipAddress: ctx.ipAddress,
            userAgent: ctx.userAgent,
          },
        });

        return patient;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'A patient with this CURP already exists',
        );
      }
      throw error;
    }
  }
}
