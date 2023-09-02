import { UserService } from 'src/user/user.service'
import {
	Body,
	Controller,
	Get,
	Param,
	Put,
	HttpCode,
	UsePipes,
	ValidationPipe,
	Delete,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from './decorators/user.decorator'
import { UpdateUserDto } from './dto/user.dto'

@Controller('users')
export class UserController {
	constructor(private readonly UserService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@User('_id') _id: string) {
		return this.UserService.byId(_id)
	}

	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Put('update')
	@Auth()
	async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
		return this.UserService.updateProfile({ _id, ...dto })
	}

}
