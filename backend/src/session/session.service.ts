import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Session } from './session.model';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session)
    private readonly model: ReturnModelType<typeof Session>,
  ) {}

  async findOne(conditions) {
    let session = await this.model.findOne(conditions);
    if (!session) {
      session = await this.create(conditions);
    }
    return session;
  }

  create(sessionDTO) {
    const session = new this.model(sessionDTO);
    return session.save();
  }

  update(sessionDTO) {
    return this.model.findOneAndUpdate(
      sessionDTO,
      {
        $set: {
          lastActiveAt: new Date(),
        },
      },
      { new: true, upsert: true },
    );
  }

  delete(conditions) {
    return this.model.findOneAndDelete(conditions);
  }
}
