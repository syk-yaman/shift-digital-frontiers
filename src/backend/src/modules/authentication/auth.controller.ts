import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { SignUpDto, SignInDto } from '../users/user.dto';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    @ApiOperation({ summary: '[Public] Sign up a new user' })
    @ApiBody({ type: SignUpDto })
    async signUp(@Body() userDto: SignUpDto) {
        return this.authService.signUp(userDto);
    }

    @Post('signin')
    @ApiOperation({ summary: '[User] Sign in an existing user' })
    @ApiBody({ type: SignInDto })
    @ApiBearerAuth()
    @UseGuards(LocalAuthGuard)
    async signIn(@Request() req) {
        return this.authService.login(req.user);
    }
}
