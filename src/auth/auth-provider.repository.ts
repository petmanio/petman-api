import { EntityRepository, Repository } from 'typeorm';

import { AuthProviderType } from '../../common/enum';

import { AuthProvider } from './auth-provider.entity';

@EntityRepository(AuthProvider)
export class AuthProviderRepository extends Repository<AuthProvider> {
  async createAndSave(externalId, accessToken): Promise<AuthProvider> {
    const authProvider = this.create();
    authProvider.type = AuthProviderType.FACEBOOK;
    authProvider.externalId = externalId;
    authProvider.accessToken = accessToken;

    await this.save(authProvider);

    return authProvider;
  }

  async findOneByExternalId(externalId: string): Promise<AuthProvider> {
    return this.findOne({
      where: {
        externalId,
        deleted: null,
      },
      relations: ['user'],
    });
  }
}
