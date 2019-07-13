import { factory, MongooseAdapter } from 'factory-girl'
import UserFactory from './user.factory'
import OrganizationFactory from './organization.factory'
import TeamFactory from './team.factory'
import GoalFactory from './goal.factory'
import AgreementFactory from './agreements.factory'


factory.setAdapter(new MongooseAdapter());

// init factories
UserFactory(factory)
OrganizationFactory(factory)
TeamFactory(factory)
GoalFactory(factory)
AgreementFactory(factory)

export default factory;