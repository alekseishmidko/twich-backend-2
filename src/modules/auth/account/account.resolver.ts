import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AccountService } from './account.service';

import { UserModel } from '@/src/modules/auth/account/models/user.model';
import { CreateUserInput } from '@/src/modules/auth/account/inputs/create-user.input';

@Resolver('Account')
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => [UserModel], { name: 'getAllUsers' })
  public async findAll() {
    return this.accountService.findAll();
  }

  @Mutation(() => UserModel, { name: 'createUser' })
  public async create(@Args('data') input: CreateUserInput) {
    return this.accountService.create(input);
  }
}
