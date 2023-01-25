import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Tasks,', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    const unclearedUsers = await request(app.getHttpServer()).get('/users');
    await Promise.all(
      unclearedUsers.body.map(async (user) => {
        return request(app.getHttpServer()).delete(`/users/${user.id}`);
      }),
    );
    const unclearedTasks = await request(app.getHttpServer()).get('/tasks');
    await Promise.all(
      unclearedTasks.body.map(async (task) => {
        return request(app.getHttpServer()).delete(`/tasks/${task.id}`);
      }),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('Post user, post task, get by id, update, get by id, delete', async () => {
    const userToPost = {
      name: 'Test user 1',
    };
    const userPostRes = await request(app.getHttpServer())
      .post('/users')
      .send(userToPost)
      .expect(201);
    const userData = await request(app.getHttpServer()).get(
      `/users/${userPostRes.body.id}`,
    );
    const taskToPost = {
      name: 'Test task 1',
      authorId: userData.body.id,
    };
    const taskPostRes = await request(app.getHttpServer())
      .post('/tasks')
      .send(taskToPost)
      .expect(201);
    expect(taskPostRes.body).toEqual({
      id: expect.any(Number),
      name: taskToPost.name,
      author: userData.body,
    });
    await request(app.getHttpServer())
      .delete(`/tasks/${taskPostRes.body.id}`)
      .expect(200);
    return request(app.getHttpServer())
      .delete(`/users/${userPostRes.body.id}`)
      .expect(200);
  });

  it('Post user, post task, get all tasks, delete user & task', async () => {
    const userToPost = {
      name: 'Test user 1',
    };
    const userPostRes = await request(app.getHttpServer())
      .post('/users')
      .send(userToPost)
      .expect(201);
    const userData = await request(app.getHttpServer()).get(
      `/users/${userPostRes.body.id}`,
    );
    const taskToPost = {
      name: 'Test task 1',
      authorId: userData.body.id,
    };
    const taskPostRes = await request(app.getHttpServer())
      .post('/tasks')
      .send(taskToPost)
      .expect(201);
    expect(taskPostRes.body).toEqual({
      id: expect.any(Number),
      name: taskToPost.name,
      author: userData.body,
    });
    const getAllTasksRes = await request(app.getHttpServer())
      .get('/tasks')
      .expect(200);
    expect(getAllTasksRes.body.length).toBe(1);
    expect(getAllTasksRes.body[0]).toEqual({
      id: expect.any(Number),
      name: 'Test task 1',
    });
    await request(app.getHttpServer())
      .delete(`/tasks/${taskPostRes.body.id}`)
      .expect(200);
    return request(app.getHttpServer())
      .delete(`/users/${userPostRes.body.id}`)
      .expect(200);
  });
});
