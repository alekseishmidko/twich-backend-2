import { Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';

import { UserModel } from '@/src/modules/auth/account/models/user.model';

@Resolver('Account')
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => [UserModel], { name: 'getAllUsers' })
  public async findAll() {
    return this.accountService.findAll();
  }
}
