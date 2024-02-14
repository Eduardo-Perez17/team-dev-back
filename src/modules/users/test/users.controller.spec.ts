import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Controllers
import { UsersController } from '../users.controller';

// Services
import { UsersService } from '../users.service';

describe('Test for endpoint Users', () => {
  let app: INestApplication;
  let usersController: UsersController;
  let jwtService: JwtService;
  let token: string;

  beforeEach(async () => {
    const user: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    app = user.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    usersController = user.get<UsersController>(UsersController);
    jwtService = user.get<JwtService>(JwtService);
    token = jwtService.sign({ username: 'eduardo' });
  });

  describe('Get user by id from database', () => {
    it('Get user by id response succesfully', async () => {
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
