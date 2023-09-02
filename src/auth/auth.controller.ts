import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterhDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService){}
 
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Post('login')
	async login(@Body() dto: LoginDto){
		return this.authService.login(dto)
	}
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: RegisterhDto){
		return this.authService.register(dto)
	}

	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Post('login/access-token')
	async getNewToken(@Body() data: RefreshTokenDto){
		return this.authService.generatorNewToken(data)
	}

}
