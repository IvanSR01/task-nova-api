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

	async getAll(_id: string) {
		const author = this.UserService.byId(_id)

		const task = []
		const historyTask = []

		const tasks = await this.TaskModel.find({ author: author })

		for (let i = 0; i < tasks.length; i++) {
			const taskOne = tasks[i]
			if (taskOne.isCompleted) {
				historyTask.push(taskOne)
			} else {
				task.push(taskOne)
			}
			return
		}
		return { task, historyTask }
	}

	async getById(_id: string) {
		const task = await this.TaskModel.findById(_id)
		if (!task) throw new NotFoundException('Tasks not found')
		return task
	}

	async createTask({ _id, title, content, deadline, priority }: CreateTaskDto) {
		const user = await this.UserService.byId(_id)
		const newTask = new this.TaskModel({
			author: user,
			title,
			content,
			deadline,
			priority,
		})
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

	async toggleCompleted(taskId: string) {
		const task = await this.getById(taskId)
		if (task.isCompleted) {
			task.isCompleted = false
			const doc = await task.save()
			return doc
		}
		task.isCompleted = true
		const doc = await task.save()
		return doc
	}

	async deleteTask(taskId: string) {
		return this.TaskModel.findByIdAndDelete(taskId)
	}
}
