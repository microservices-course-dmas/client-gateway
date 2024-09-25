import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { LoginUserDto, RegisterUserDto } from './dto';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import { User } from './decorators';
import { CurrenUserI } from './interfaces/current-user.interface';
import { Token } from './decorators/token.decorator';


@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Post('register')
  registerUser(@Body() registerUser: RegisterUserDto) {
    return this.client.send('auth.register.user', registerUser).pipe(
      catchError(error => {
        throw new RpcException(error)
      }));;
  }

  @Post('login')
  loginUser(@Body() loginUser: LoginUserDto) {
    return this.client.send('auth.login.user', loginUser).pipe(
      catchError(error => {
        throw new RpcException(error)
      }));;;
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyUser(@User() user:CurrenUserI, @Token() token:string) {    
    console.log('user', user);
    return { user, token };
    
    
  }
}
