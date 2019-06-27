import { factory, MongooseAdapter } from 'factory-girl'
import UserFactory from './user.factory'
import OrganizationFactory from './organization.factory'
import TeamFactory from './team.factory'
import GoalFactory from './goal.factory'


factory.setAdapter(new MongooseAdapter());

UserFactory(factory)
OrganizationFactory(factory)
TeamFactory(factory)
GoalFactory(factory)

export default factory;