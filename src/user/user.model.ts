import { Ref, prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { TaskModel } from 'src/task/task.model'

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
	@prop({ unique: true })
	userName: string

	@prop({ unique: true })
	email: string

	@prop()
	password: string

	@prop({ default: 'uploads/avatar/defaultAvatar.jpg' })
	img: string

	@prop({default: 0})
	days: number

	@prop({ default: 'No target' })
	target: string

	@prop({ default: [] })
	task: Ref<TaskModel>[]

	@prop({ default: [] })
	history: Ref<TaskModel>[]
}
