import { EntityRepository, Repository } from 'typeorm';

import { State } from './state.entity';

@EntityRepository(State)
export class StateRepository extends Repository<State> {
}
