import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Warehouses (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  let operatorAuthCookies: string[] = [];
  let operatorId: number;
  let warehouseId: string;

  const operatorUser = {
    email: 'e2e-operator@example.com',
    password: 'OperatorPass123!',
    firstName: 'Operator',
    lastName: 'Test',
    phone: '+971507654321',
  };

  const testWarehouse = {
    name: 'E2E Test Warehouse',
    description: 'A test warehouse for E2E testing',
    address: 'Sheikh Zayed Road, Dubai',
    emirate: 'Dubai',
    district: 'DIFC',
    latitude: 25.2048,
    longitude: 55.2708,
    hasClimateControl: true,
    has24x7Access: true,
    hasSecurityCameras: true,
    contactPhone: '+971501234567',
    contactEmail: 'warehouse@example.com',
    workingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);

    // Clean up test data
    await prismaService.user.deleteMany({
      where: { email: operatorUser.email },
    });

    // Register operator user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(operatorUser);

    // Update user role to operator
    const user = await prismaService.user.findUnique({
      where: { email: operatorUser.email },
    });

    await prismaService.user.update({
      where: { id: user.id },
      data: { role: 'operator' },
    });

    // Create operator profile
    const operator = await prismaService.operator.create({
      data: {
        userId: user.id,
        companyName: 'Test Storage Company',
        tradeLicense: 'TRD-12345',
        isVerified: true,
      },
    });

    operatorId = operator.id;

    // Login as operator
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: operatorUser.email,
        password: operatorUser.password,
      });

    operatorAuthCookies = loginRes.headers['set-cookie'];
  });

  afterAll(async () => {
    // Clean up test data
    if (warehouseId) {
      await prismaService.warehouse.deleteMany({
        where: { id: warehouseId },
      });
    }

    await prismaService.operator.deleteMany({
      where: { id: operatorId },
    });

    await prismaService.user.deleteMany({
      where: { email: operatorUser.email },
    });

    await prismaService.$disconnect();
    await app.close();
  });

  describe('/operator/warehouses (POST)', () => {
    it('should create a warehouse successfully', () => {
      return request(app.getHttpServer())
        .post('/operator/warehouses')
        .set('Cookie', operatorAuthCookies)
        .send(testWarehouse)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(testWarehouse.name);
          expect(res.body.emirate).toBe(testWarehouse.emirate);
          expect(res.body.operatorId).toBe(operatorId);
          expect(res.body.status).toBe('draft');

          warehouseId = res.body.id;
        });
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .post('/operator/warehouses')
        .send(testWarehouse)
        .expect(401);
    });

    it('should return 400 for invalid data', () => {
      return request(app.getHttpServer())
        .post('/operator/warehouses')
        .set('Cookie', operatorAuthCookies)
        .send({
          name: 'Test',
          // Missing required fields
        })
        .expect(400);
    });
  });

  describe('/warehouses (GET)', () => {
    it('should return list of warehouses', () => {
      return request(app.getHttpServer())
        .get('/warehouses')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.meta).toHaveProperty('total');
          expect(res.body.meta).toHaveProperty('page');
          expect(res.body.meta).toHaveProperty('limit');
        });
    });

    it('should filter by emirate', () => {
      return request(app.getHttpServer())
        .get('/warehouses')
        .query({ emirate: 'Dubai' })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
          res.body.data.forEach((warehouse: any) => {
            expect(warehouse.emirate).toBe('Dubai');
          });
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('/warehouses')
        .query({ page: 1, limit: 5 })
        .expect(200)
        .expect((res) => {
          expect(res.body.meta.page).toBe(1);
          expect(res.body.meta.limit).toBe(5);
          expect(res.body.data.length).toBeLessThanOrEqual(5);
        });
    });

    it('should search by name', () => {
      return request(app.getHttpServer())
        .get('/warehouses')
        .query({ search: 'Test' })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  describe('/warehouses/:id (GET)', () => {
    it('should return warehouse by id', () => {
      return request(app.getHttpServer())
        .get(`/warehouses/${warehouseId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(warehouseId);
          expect(res.body.name).toBe(testWarehouse.name);
          expect(res.body).toHaveProperty('operator');
        });
    });

    it('should return 404 for non-existent warehouse', () => {
      return request(app.getHttpServer())
        .get('/warehouses/non-existent-id')
        .expect(404);
    });
  });

  describe('/operator/warehouses/:id (PATCH)', () => {
    it('should update warehouse successfully', () => {
      const updateData = {
        name: 'Updated Warehouse Name',
        description: 'Updated description',
      };

      return request(app.getHttpServer())
        .patch(`/operator/warehouses/${warehouseId}`)
        .set('Cookie', operatorAuthCookies)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(warehouseId);
          expect(res.body.name).toBe(updateData.name);
          expect(res.body.description).toBe(updateData.description);
        });
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .patch(`/operator/warehouses/${warehouseId}`)
        .send({ name: 'Test' })
        .expect(401);
    });

    it('should return 404 for non-existent warehouse', () => {
      return request(app.getHttpServer())
        .patch('/operator/warehouses/non-existent-id')
        .set('Cookie', operatorAuthCookies)
        .send({ name: 'Test' })
        .expect(404);
    });
  });

  describe('/operator/warehouses/:id (DELETE)', () => {
    it('should delete warehouse successfully', () => {
      return request(app.getHttpServer())
        .delete(`/operator/warehouses/${warehouseId}`)
        .set('Cookie', operatorAuthCookies)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
        });
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .delete(`/operator/warehouses/${warehouseId}`)
        .expect(401);
    });
  });
});
