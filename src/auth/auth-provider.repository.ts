import { EntityRepository, Repository } from 'typeorm';

import { AuthProvider } from './auth-provider.entity';

@EntityRepository(AuthProvider)
export class AuthProviderRepository extends Repository<AuthProvider> {
}
