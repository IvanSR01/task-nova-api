import { Auth } from 'src/auth/decorators/auth.decorator'
import { TaskService } from './task.service'
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { User } from 'src/user/decorators/user.decorator'
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto'

@Controller('task')
export class TaskController {
	constructor(private readonly TaskService: TaskService) {}

	@Get(':id')
	@Auth()
	async getAll(@Param('id') id:string) {
		return this.TaskService.getById(id)
	}

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
	async toggleCompleted(@User('_id') _id:string, @Body('taskId') taskId: string){
		return this.TaskService.toggleCompleted(_id, taskId)
	}	

	@Delete('')
	@Auth()
	async deleteTask(@User('_id') _id:string, @Body('taskId') taskId: string) {
		return this.TaskService.deleteTask(_id, taskId)
	}
}
