import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from "../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    usersService: UsersService;
    constructor(usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
        this.usersService = usersService;
    }

    async validate(payload: { email: string, sub: string, isAdmin: boolean, iat: number, exp: number }) {
        const user = await this.usersService.findOne(payload.sub);
        if (!user) {
            throw new UnauthorizedException('User not found or invalid token');
        }
        return { userId: user.id, email: user.email, isAdmin: user.isAdmin };
    }
}
