import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  getAllUsers() {
    return this.usersRepository.find();
  }

    async getUserById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
        throw new HttpException('User not found', 
            HttpStatus.NOT_FOUND
        );
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      created_at: user.created_at,
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    if (!createUserDto.email) {
      throw new HttpException(
        'Email must not be null or empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!createUserDto.name) {
      throw new HttpException(
        'Name must not be null or empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!createUserDto.password) {
      throw new HttpException(
        'Password must not be null or empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }

  async login(loginDto: LoginDto) {
    if (!loginDto.email) {
      throw new HttpException(
        'Email must not be null or empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!loginDto.password) {
      throw new HttpException(
        'Password must not be null or empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    const payload = { id: user.id, email: user.email };

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      access_token: this.jwtService.sign(payload),
    };
  }
}