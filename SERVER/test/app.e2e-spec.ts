import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

/**
 * End-to-end smoke test. Requires DATABASE_URL and SIMRS_DATABASE_URL to
 * point at reachable (test) MariaDB instances - run `npm run prisma:migrate:deploy`
 * against a test database first. Run with: npm run test:e2e
 */
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET) reports database connectivity', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res: any) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.services).toHaveProperty('appDatabase');
        expect(res.body.services).toHaveProperty('simrsDatabase');
      });
  });

  it('GET /api/v1/doctors is public and returns the standard envelope', () => {
    return request(app.getHttpServer())
      .get('/api/v1/doctors')
      .expect(200)
      .expect((res: any) => {
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.meta).toHaveProperty('totalItems');
      });
  });

  it('POST /api/v1/auth/login rejects an invalid body with 422 + field errors', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'not-an-email' })
      .expect((res: any) => {
        expect(res.body.success).toBe(false);
        expect(res.body.errors).toBeDefined();
      });
  });

  it('GET /api/v1/users is protected and returns 401 without a token', () => {
    return request(app.getHttpServer())
      .get('/api/v1/users')
      .expect(401)
      .expect((res: any) => {
        expect(res.body.success).toBe(false);
      });
  });
});
