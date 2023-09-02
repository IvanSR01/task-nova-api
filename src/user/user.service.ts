import { genSalt, hash } from 'bcryptjs'
import {
	Injectable,
	NotFoundException,
	BadRequestException,
	Inject,
	forwardRef,
} from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from './user.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { UpdateUserDto } from './dto/user.dto'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
	) {}

	async byId(id: string) {
		const user = await this.UserModel.findById(id).populate('')

		if (!user) throw new NotFoundException('User not found')

		const days = this.getDaysUser(user)
		user.days = days
		await user.save()

		return user
	}

	async updateProfile({ _id, userName, email, password, img }: UpdateUserDto) {
		const user = await this.byId(_id)

		if (userName) {
			const oldUser = await this.UserModel.findOne({ userName: userName })
			if (oldUser) throw new BadRequestException('Username is busy')
			user.userName = userName
		}

		if (email) {
			const oldUser = await this.UserModel.findOne({ email: email })
			if (oldUser) throw new BadRequestException('Email is busy')
			user.email = email
		}

		if (password) {
			const salt = await genSalt(10)
			user.password = await hash(password, salt)
		}

		if (img) {
			user.img = img
		}

		const doc = await user.save()
		return doc
	}

	getDaysUser(user: UserModel) {
		var today = new Date()
		var userDays = user.createdAt
		today.setDate(today.getDate() - userDays.getDate())
		console.log(today.getDate())
		return today.getDate()
	}
}
