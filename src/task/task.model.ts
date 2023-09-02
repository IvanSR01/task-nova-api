import { Ref, prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { UserModel } from 'src/user/user.model'

export interface TaskModel extends Base {}

export class TaskModel extends TimeStamps {

	@prop()
	title:string

	@prop()
	content: string

	@prop()
	priority: string

	@prop({ default: false })
	isCompleted: boolean

	@prop()
	deadline: Date

}
