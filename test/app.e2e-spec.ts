import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './../src/app.controller';
import { AppService } from './../src/app.service';

describe('AppController (e2e)', () => {
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    //Just a sample
    expect(1).toBe(1);
  });
});
