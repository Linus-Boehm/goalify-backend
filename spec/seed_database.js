import mongoose from 'mongoose';
import * as config from '../src/config';
import factory from './factories';
import {GOAL_TYPE} from "../src/models/goal";

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

  const organizaton = await factory.create('organization', { name: 'Orga' });

  // ---
  // <Users>
  //OrganizationAdmin
  const johanna = await factory.create('user', {
    firstname: 'Johanna',
    lastname: 'Greedy',
    email: 'johanna@orga.com',
    password: '12345678',
    organization_id: organizaton._id,
    role: 'organization_admin'
  });

  const peter = await factory.create('user', {
    firstname: 'Peter',
    lastname: 'Lustig',
    email: 'peter@orga.com',
    password: '12345678',
    organization_id: organizaton._id
  });

  const hubert = await factory.create('user', {
    firstname: 'Hubert',
    lastname: 'Anderson',
    email: 'hubert@orga.com',
    password: '12345678',
    organization_id: organizaton._id
  });

  // </Users>
  // ---
  // <Teams>

  const marketingTeam = await factory.create('team', {
    name: 'Marketing',
    organization_id: organizaton._id,
  });
  await marketingTeam.addUser({ user_id: peter._id, role: 'member' }); // test overwrite
  await marketingTeam.addUser({ user_id: peter._id, role: 'leader' });
  await marketingTeam.addUser({ user_id: johanna._id, role: 'member' });

  const salesTeam = await factory.create('team', {
    name: 'Sales',
    organization_id: organizaton._id,
  });
  await salesTeam.addUser({ user_id: hubert._id, role: 'leader' });
  await salesTeam.addUser({ user_id: peter._id, role: 'member' });

  // </Teams>
  // ---
  // <Agreements>

  const OA_marketing_peter_and_johanna = await factory.create('agreement', {
    reviewer: johanna._id,
    assignee: peter._id,
    team: marketingTeam._id,
    organizaton: organizaton._id,

    start_date: new Date(2019, 1, 1),
    end_date: new Date(2019, 7, 1)
  });

  const OA_marketing_hubert_and_peter = await factory.create('agreement', {
    reviewer: peter._id,
    assignee: hubert._id,
    team: salesTeam._id,
    organizaton: organizaton._id,

    start_date: new Date(2019, 1, 1),
    end_date: new Date(2019, 12, 31)
  });


  // </Agreements>
  // ---
  // <Goals>

  const privateGoal = await factory.create('goal', {
    title: 'Decrease stress level',
    is_private: true,
    created_by: peter._id,
    assignee: peter._id,
    organization_id: organizaton._id
  });

  const privateGoalJohanna = await factory.create('goal', {
    title: 'Increase amount of selled contracts',
    is_private: true,
    created_by: johanna._id,
    assignee: johanna._id,
    organization_id: organizaton._id,
    progress_type: GOAL_TYPE.COUNT,
    progress: [{date: new Date(2019,7,10), value: 4},{date: new Date(2019,7,8), value: 7},{date: new Date(2019,7,7), value: 2}]
  });

  const privateSubGoal0 = await factory.create('goal', {
    title: 'Meditate for 10 minutes every day',
    is_private: true,
    created_by: peter._id,
    assignee: peter._id,
    parent_goal: privateGoal._id,
    organization_id: organizaton._id
  });

  const objectiveAgreementGoal = await factory.create('goal', {
    title: 'Convert 25 salesforce Leads',
    created_by: peter._id,
    assignee: peter._id,
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
    related_to: OA_marketing_peter_and_johanna._id
  });

  const objectiveAgreementSubGoal0 = await factory.create('goal', {
    title: 'Prioritize existing salesforce Leads',
    is_private: true,
    created_by: peter._id,
    assignee: peter._id,
    parent_goal: objectiveAgreementGoal._id,
    organization_id: organizaton._id,
    related_model: 'ObjectiveAgreement',
    related_to: OA_marketing_peter_and_johanna._id,
    progress_type: GOAL_TYPE.BOOLEAN,
    progress: [

    ]
  });

  const objectiveAgreementSubGoal1 = await factory.create('goal', {
    title: 'Call 2 salesforce Leads per Day',
    is_private: true,
    created_by: peter._id,
    assignee: peter._id,
    parent_goal: objectiveAgreementGoal._id,
    organization_id: organizaton._id,
    related_model: 'ObjectiveAgreement',
    related_to: OA_marketing_peter_and_johanna._id
  });

  const objectiveAgreementGoal1 = await factory.create('goal', {
    title: 'Improve Sales',
    created_by: hubert._id,
    assignee: peter._id,
    organization_id: organizaton._id,
    related_model: 'ObjectiveAgreement',
    progress_type: GOAL_TYPE.QUALITATIVE,
    progress: [
      {
        date: new Date(2019, 7, 13),
        is_reviewed: true,
        value: 2
      },
      {
        date: new Date(2019, 7, 14),
        is_reviewed: true,
        value: 3
      },
      {
        date: new Date(2019, 7, 15),
        is_reviewed: false,
        value: 4
      }
    ],
    related_to: OA_marketing_hubert_and_peter._id
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
    created_by: hubert._id,
    related_to: organizaton._id,
    related_model: 'Organization',
    organization_id: organizaton._id
  });

  // </Goals>

}

