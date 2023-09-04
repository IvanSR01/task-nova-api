import { Auth } from 'src/auth/decorators/auth.decorator'
import { TaskService } from './task.service'
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { User } from 'src/user/decorators/user.decorator'
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto'

@Controller('task')
export class TaskController {
	constructor(private readonly TaskService: TaskService) {}

	@Get('all')
	@Auth()
	async getAll(@User('_id') _id: string) {
		return this.TaskService.getAll(_id)
	}

	@Get(':id')
	@Auth()
	async getById(@Param('id') id: string) {
		return this.TaskService.getById(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('')
	@Auth()
	async createTask(@User('_id') _id: string, @Body() dto: CreateTaskDto) {
		return this.TaskService.createTask({ _id, ...dto })
	}

	@Put('')
	@Auth()
	async updateTask(@Body() dto: UpdateTaskDto) {
		return this.TaskService.updateTask(dto)
	}

	@Put('completed')
	@Auth()
	async toggleCompleted(@Body('taskId') taskId: string) {
		return this.TaskService.toggleCompleted(taskId)
	}

	@Delete('')
	@Auth()
	async deleteTask(@Body('taskId') taskId: string) {
		return this.TaskService.deleteTask(taskId)
	}
}
