import { UserService } from './../user/user.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { TaskModel } from './task.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto'

@Injectable()
export class TaskService {
	constructor(
		@InjectModel(TaskModel) private readonly TaskModel: ModelType<TaskModel>,
		private readonly UserService: UserService
	) {}

	async getById(_id: string) {
		const task = await this.TaskModel.findById(_id)
		if (task) throw new NotFoundException('Tasks not found')
		return task
	}

	async createTask({ _id, title, content, deadline, priority }: CreateTaskDto) {
		const user = await this.UserService.byId(_id)
		const newTask = new this.TaskModel({
			title,
			content,
			deadline,
			priority,
		})
		user.task.push(newTask)
		await user.save()
		const doc = await newTask.save()
		return doc
	}

	async updateTask({
		taskId,
		title,
		content,
		deadline,
		priority,
	}: UpdateTaskDto) {
		const task = await this.TaskModel.findById(taskId)

		if (!task) throw new NotFoundException('Task not found')

		if (title) task.title = title

		if (priority) task.priority = priority

		if (content) task.content = content

		if (deadline) task.deadline = deadline

		const doc = await task.save()
		return doc
	}

	async toggleCompleted(taskId: string, _id: string) {
		const task = await this.getById(taskId)
		const user = await this.UserService.byId(_id)
		if (task.isCompleted) {
			task.isCompleted = false
			if (user.history.length > 1) {
				user.history.filter((item) => {
					return item._id !== task._id
				})
			} else {
				user.history = []
			}
			const doc = await task.save()
			await user.save()
			return doc
		}
		task.isCompleted = true
		user.history.push(task)
		const doc = await task.save()
		await user.save()
		return doc
	}

	async deleteTask(_id: string, taskId: string) {
		const user = await this.UserService.byId(_id)
		const task = await this.TaskModel.findByIdAndDelete(taskId)
		if (user.task.length > 1) {
			user.task.filter((item) => {
				return item._id !== task._id
			})
		} else {
			user.task = []
		}
		await user.save()
		return task
	}
}
