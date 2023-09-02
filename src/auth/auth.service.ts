import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from 'src/user/user.model';
import { LoginDto, RegisterhDto } from './dto/auth.dto';
import { genSalt, hash, compare } from 'bcryptjs'
import { RefreshTokenDto } from './dto/refreshToken.dto';
@Injectable()
export class AuthService {

	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly jwtService: JwtService
	) {}

	async login({ dataLogin, password }: LoginDto) {
		const user = await this.validationUser(dataLogin, password)
		const tokens = await this.generatorToken(user.id)
		return {
			user: this.returnUserData(user),
			...tokens,
		}
	}

	async register({ email, target, userName, password }: RegisterhDto) {
		const oldUser =
			(await this.findByEmail(email)) ||
			(await this.UserModel.findOne({ userName: userName }))

		if (oldUser)
			throw new BadRequestException(
				'User with this email or username is already in the system'
			)

		const salt = await genSalt(10)

		const newUser = new this.UserModel({
			email,
			target,
			userName,
			password: await hash(password, salt),
		})
		const user = await newUser.save()

		const tokens = await this.generatorToken(user.id)

		return {
			user: this.returnUserData(user),
			...tokens,
		}
	}

	async generatorNewToken({refreshToken}: RefreshTokenDto) {
		if (!refreshToken) throw new UnauthorizedException('Please sing in!')

		const result = await this.jwtService.verifyAsync(refreshToken)

		if (!result) throw new UnauthorizedException('Invalid token!')

		const user = await this.UserModel.findById(result)

		const tokens = await this.generatorToken(user.id)

		return {
			user: this.returnUserData(user),
			...tokens,
		}
	}

	async findByEmail(email: string) {
		return this.UserModel.findOne({ email: email })
	}

	async validationUser(dataLogin: string, password: string) {
		let user
		if (dataLogin.includes('@') && dataLogin.includes('.')) {
			user = await this.findByEmail(dataLogin)
		} else {
			user = await this.UserModel.findOne({ userName: dataLogin })
		}
		if (!user) throw new UnauthorizedException('User not found')

		const isValidPass = await compare(password, user.password)
		if (!isValidPass) throw new UnauthorizedException('Invalid password')

		return user
	}

	async generatorToken(userId: string) {
		const data = { _id: userId }

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '15d',
		})

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '1h',
		})

		return { accessToken, refreshToken }
	}

	returnUserData(user: UserModel) {
		return {
			_id: user._id,
			email: user.email,
			fullName: user.target,
			userName: user.userName,
		}
	}
}
