import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  const testUser = {
    email: 'e2e-test@example.com',
    password: 'TestPassword123!',
    firstName: 'E2E',
    lastName: 'Test',
    phone: '+971501234567',
  };

  let authCookies: string[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply global configurations
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

    // Clean up test user if exists
    await prismaService.user.deleteMany({
      where: { email: testUser.email },
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prismaService.user.deleteMany({
      where: { email: testUser.email },
    });

    await prismaService.$disconnect();
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user.email).toBe(testUser.email.toLowerCase());
          expect(res.body.user.firstName).toBe(testUser.firstName);
          expect(res.body.user).not.toHaveProperty('passwordHash');
          expect(res.body).toHaveProperty('message', 'Registration successful');
        });
    });

    it('should return 409 if user already exists', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(409)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 409);
          expect(res.body).toHaveProperty('error');
          expect(res.body.message).toContain('already exists');
        });
    });

    it('should return 400 for invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...testUser,
          email: 'invalid-email',
        })
        .expect(400);
    });

    it('should return 400 for weak password', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...testUser,
          email: 'another@example.com',
          password: '123', // Too weak
        })
        .expect(400);
    });

    it('should return 400 for missing required fields', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          // Missing password, firstName, lastName
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login successfully with correct credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe(testUser.email.toLowerCase());

          // Check that auth cookies are set
          const cookies = res.headers['set-cookie'];
          expect(cookies).toBeDefined();
          expect(cookies.some((c: string) => c.includes('auth_token'))).toBe(true);
          expect(cookies.some((c: string) => c.includes('refresh_token'))).toBe(true);

          // Store cookies for later tests
          authCookies = cookies;
        });
    });

    it('should return 401 for invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'wrong@example.com',
          password: testUser.password,
        })
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 401);
          expect(res.body.message).toContain('Invalid credentials');
        });
    });

    it('should return 401 for invalid password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('Invalid credentials');
        });
    });

    it('should return 400 for missing credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400);
    });
  });

  describe('/auth/me (GET)', () => {
    it('should return current user profile', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Cookie', authCookies)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe(testUser.email.toLowerCase());
          expect(res.body.firstName).toBe(testUser.firstName);
          expect(res.body).not.toHaveProperty('passwordHash');
        });
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .expect(401);
    });
  });

  describe('/auth/logout (POST)', () => {
    it('should logout successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', authCookies)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'Logout successful');

          // Check that cookies are cleared
          const cookies = res.headers['set-cookie'];
          expect(cookies).toBeDefined();
        });
    });

    it('should return 401 when already logged out', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .expect(401);
    });
  });

  describe('/auth/refresh (POST)', () => {
    let refreshCookie: string;

    beforeAll(async () => {
      // Login to get refresh token
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      const cookies = res.headers['set-cookie'];
      refreshCookie = cookies.find((c: string) => c.includes('refresh_token')) || '';
    });

    it('should refresh access token with valid refresh token', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', refreshCookie)
        .expect(200)
        .expect((res) => {
          const cookies = res.headers['set-cookie'];
          expect(cookies).toBeDefined();
          expect(cookies.some((c: string) => c.includes('auth_token'))).toBe(true);
        });
    });

    it('should return 401 without refresh token', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .expect(401);
    });
  });
});
