import { IsDate, IsString } from 'class-validator'

export class CreateTaskDto {
	_id: string

	@IsString()
	title: string

	content?: string

	@IsString()
	priority: string

	@IsDate()
	deadline: Date
}

export class UpdateTaskDto {
	taskId: string

	title: string

	content: string

	priority?: string

	deadline: Date

	isCompleted?: boolean
}
