import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { LoginInput } from '@/src/modules/auth/session/inputs/login.input';
import { GqlContext } from '@/src/shared/types/gql-context.types';
import { UserModel } from '@/src/modules/auth/account/models/user.model';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator';
import { SessionModel } from '@/src/modules/auth/session/models/session.model';
import { AuthModel } from '@/src/modules/auth/account/models/auth.model';

@Resolver('Session')
export class SessionResolver {
  public constructor(private readonly sessionService: SessionService) {}
  @Authorization()
  @Query(() => [SessionModel], { name: 'findSessionsByUser' })
  public async findByUser(@Context() { req }: GqlContext) {
    return this.sessionService.findByUser(req);
  }

  @Authorization()
  @Query(() => SessionModel, { name: 'findCurrentSession' })
  public async findCurrent(@Context() { req }: GqlContext) {
    return this.sessionService.findCurrent(req);
  }

  @Mutation(() => AuthModel, { name: 'loginUser' })
  public async login(
    @Context() { req }: GqlContext,
    @Args('data') input: LoginInput,
    @UserAgent() userAgent: string,
  ) {
    return this.sessionService.login(req, input, userAgent);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'logoutUser' })
  public async logout(@Context() { req }: GqlContext) {
    return this.sessionService.logout(req);
  }

  @Mutation(() => Boolean, { name: 'clearSessionCookie' })
  public async clearSession(@Context() { req }: GqlContext) {
    return this.sessionService.clearSession(req);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'removeSession' })
  //id session
  public async remove(@Context() { req }: GqlContext, @Args('id') id: string) {
    return this.sessionService.remove(req, id);
  }
}
