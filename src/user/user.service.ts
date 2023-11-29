import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { UpdateUserDto, UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
   constructor(
      @InjectRepository(User)
      private userDB: Repository<User>
   ) {}

   async getAllUser(): Promise<User[]> {
      return await this.userDB.find()
   }

   async getOneUser(id: number): Promise<User> {
      const user =  await this.userDB.findOneBy({ id })
      
      if (!user) {  
         throw new NotFoundException(`Can't find user with id ${id}`)
     }
     return user
   }

   async createUser(userDto: UserDto):Promise<void> {
      const { username, password } = userDto;

      const salt = await bcrypt.genSalt(); 
      const hashed_PW = await bcrypt.hash(password, salt)

      const user = this.userDB.create({ username, password: hashed_PW })

      try {
         await this.userDB.save(user)

      } catch (err) { 
         if (err.code === '23505') { 
            throw new ConflictException('Existing username')

         } else { 
            throw new InternalServerErrorException();
            
         }
      }
   }

   async deleteUser(id: number):Promise<void> {
      const user = await this.userDB.delete({ id })
        
      if(user.affected === 0) {
          throw new NotFoundException(`Can't find user with id ${id}`)
      }
   }

   async updateUser(id: number, updateUserDto: UpdateUserDto):Promise<{ success: boolean }> {
      const result = await this.userDB.update(
         { id },
         updateUserDto
     )

     if (result.affected) { // ffected 값이 1이면 트루 값 반환 
         return {
           success: true
         }
     } else {
         return {
           success: false // affected 값이 0이면 즉, 업뎃하려는 유저 아이디가 없으면 false값 반환
         }
     }
   }
}
