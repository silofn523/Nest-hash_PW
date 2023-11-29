import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto, UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
   constructor(
      private readonly userService: UserService
   ) {}

   @Get()
   getAllUser() {
      return this.userService.getAllUser()
   }

   @Get(':id')
   getOneUser(@Param('id') id: number) {
      return this.userService.getOneUser(id)
   }

   @Post()
   createUser(@Body() userDto: UserDto) {
      return this.userService.createUser(userDto)
   }

   @Delete(':id')
   deleteUser(@Param('id') id: number) {
      return this.userService.deleteUser(id)
   }

   @Patch(':id')
   updateUser(
      @Param('id') id: number,
      @Body() updateUserDto: UpdateUserDto,
   ) {
      return this.userService.updateUser(id,updateUserDto)
   }
}

