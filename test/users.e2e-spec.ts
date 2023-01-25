import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Users', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    const uncleared = await request(app.getHttpServer()).get('/users');
    await Promise.all(
      uncleared.body.map(async (user) => {
        return request(app.getHttpServer()).delete(`/users/${user.id}`);
      }),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('Post user, get all, get by id', async () => {
    const testUser = {
      id: 1,
      name: 'test user 1',
    };
    const data = await request(app.getHttpServer())
      .post('/users')
      .send(testUser)
      .expect(201);
    expect(data.body).toEqual({
      ...testUser,
      id: expect.any(Number),
    });
    const users = await request(app.getHttpServer()).get('/users').expect(200);
    expect(users.body).toEqual(expect.any(Array));
    expect(users.body.length).toBe(1);
    expect(users.body[0]).toEqual({
      ...testUser,
      id: expect.any(Number),
    });
    const testUser2 = await request(app.getHttpServer())
      .get(`/users/${data.body.id}`)
      .expect(200);
    expect(testUser2.body).toEqual({ ...data.body, tasks: [] });
    return request(app.getHttpServer())
      .delete(`/users/${data.body.id}`)
      .expect(200);
  });

  it('post user, get by id, update, get by id, delete', async () => {
    const testUser1 = {
      name: 'Test user 1',
    };
    const data = await request(app.getHttpServer())
      .post('/users')
      .send(testUser1)
      .expect(201);
    expect(data.body).toEqual({
      ...testUser1,
      id: expect.any(Number),
    });
    const testUser2 = await request(app.getHttpServer())
      .get(`/users/${data.body.id}`)
      .expect(200);
    expect(testUser2.body).toEqual({
      ...testUser1,
      id: expect.any(Number),
      tasks: [],
    });
    const testUser3 = await request(app.getHttpServer())
      .patch(`/users/${testUser2.body.id}`)
      .send({ name: 'Test user 1 updated' })
      .expect(200);
    expect(testUser3.body).toEqual({
      ...data.body,
      name: 'Test user 1 updated',
      tasks: [],
    });
    const updatedUser = await request(app.getHttpServer())
      .get(`/users/${data.body.id}`)
      .expect(200);
    expect(updatedUser.body).toEqual(testUser3.body);
    return request(app.getHttpServer())
      .delete(`/users/${data.body.id}`)
      .expect(200);
  });
});
