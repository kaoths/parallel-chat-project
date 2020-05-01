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

  findOne(conditions) {
    return this.model.findOne(conditions);
  }

  create(sessionDTO) {
    const session = new this.model(sessionDTO);
    return session.save();
  }

  update(sessionDTO) {
    return this.model.findOneAndUpdate(
      sessionDTO,
      {
        lastActiveAt: new Date(),
      },
      { new: true, upsert: true },
    );
  }

  delete(conditions) {
    return this.model.findOneAndDelete(conditions);
  }
}
