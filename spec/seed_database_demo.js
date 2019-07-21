import mongoose from 'mongoose';
import * as config from '../src/config';
import factory from './factories';
import { GOAL_TYPE } from "../src/models/goal";

//Connect to the MongoDB database
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(async () => {

    await seedDatabase();

    process.exit(0);
  })


async function seedDatabase() {
  console.log('Seed Database... ');
  mongoose.connection.db.dropDatabase();

  const organizaton = await factory.create('organization', { name: 'Unicorn startup' });

  // ---
  // <Users>
  //OrganizationAdmin
  const johanna = await factory.create('user', {
    firstname: 'Johanna',
    lastname: 'Greedy',
    email: 'johanna@unicorn.com',
    password: '12345678',
    organization_id: organizaton._id,
    role: 'organization_admin',
    confirmed: true
  });

  const peter = await factory.create('user', {
    firstname: 'Peter',
    lastname: 'Lustig',
    email: 'peter@unicorn.com',
    password: '12345678',
    organization_id: organizaton._id,
    confirmed: true
  });

  const thomas = await factory.create('user', {
    firstname: 'Thomas',
    lastname: 'Anderson',
    email: 'thomas@unicorn.com',
    password: '12345678',
    organization_id: organizaton._id,
    confirmed: true
  });

  const georg = await factory.create('user', {
    firstname: 'Georg',
    lastname: 'Porter',
    email: 'georg@unicorn.com',
    password: '12345678',
    organization_id: organizaton._id,
    confirmed: true
  });

  // </Users>
  // ---
  // <Teams>


  const salesTeam = await factory.create('team', {
    name: 'Sales',
    organization_id: organizaton._id,
  });
  await salesTeam.addUser({ user_id: johanna._id, role: 'leader' });
  // await salesTeam.addUser({ user_id: peter._id, role: 'member' });
  await salesTeam.addUser({ user_id: thomas._id, role: 'member' });

  const marketingTeam = await factory.create('team', {
    name: 'Marketing',
    organization_id: organizaton._id,
  });

  await marketingTeam.addUser({ user_id: georg._id, role: 'leader' });
  // await marketingTeam.addUser({ user_id: peter._id, role: 'member' });


  // </Teams>
  // ---
  // <Agreements>

  const OA_marketing_johanna_and_thomas = await factory.create('agreement', {
    reviewer: johanna._id,
    assignee: thomas._id,
    team: marketingTeam._id,
    organizaton: organizaton._id,

    start_date: new Date(2019, 1, 1),
    end_date: new Date(2019, 7, 1)
  });


  // </Agreements>
  // ---
  // <Goals>

  const objectiveAgreementGoal = await factory.create('goal', {
    title: 'Convert 25 salesforce Leads',
    created_by: johanna._id,
    assignee: thomas._id,
    reviewer: johanna._id,
    organization_id: organizaton._id,
    related_model: 'ObjectiveAgreement',
    maximum_progress: 25,
    progress_type: GOAL_TYPE.COUNT,
    progress: [
      {
        date: new Date(2019, 7, 13),
        is_reviewed: true,
        value: 6
      },
      {
        date: new Date(2019, 7, 14),
        is_reviewed: true,
        value: 5
      },
      {
        date: new Date(2019, 7, 15),
        is_reviewed: false,
        value: 8
      }
    ],
    related_to: OA_marketing_johanna_and_thomas._id
  });

  const objectiveAgreementSubGoal0 = await factory.create('goal', {
    title: 'Prioritize existing salesforce Leads',
    is_private: true,
    created_by: johanna._id,
    assignee: thomas._id,
    parent_goal: objectiveAgreementGoal._id,
    organization_id: organizaton._id,
    related_model: 'ObjectiveAgreement',
    related_to: OA_marketing_johanna_and_thomas._id,
    progress_type: GOAL_TYPE.BOOLEAN,
    progress: []
  });

  const objectiveAgreementSubGoal1 = await factory.create('goal', {
    title: 'Call 2 salesforce Leads per Day',
    is_private: true,
    created_by: johanna._id,
    assignee: thomas._id,
    parent_goal: objectiveAgreementGoal._id,
    organization_id: organizaton._id,
    related_model: 'ObjectiveAgreement',
    related_to: OA_marketing_johanna_and_thomas._id
  });

  const teamGoal = await factory.create('goal', {
    title: 'Increase social media attention by 15%',
    created_by: johanna._id,
    related_to: marketingTeam._id,
    related_model: 'Team',
    organization_id: organizaton._id
  });

  const organizationGoal = await factory.create('goal', {
    title: 'Increase revenue by 20%',
    created_by: georg._id,
    related_to: organizaton._id,
    related_model: 'Organization',
    organization_id: organizaton._id
  });

  // </Goals>

}

