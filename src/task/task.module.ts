import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { TaskModel } from './task.model';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: TaskModel,
				schemaOptions: {
					collection: 'Task',
				},
			},
		]),
		UserModule
	],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}
