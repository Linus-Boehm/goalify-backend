import mongoose from 'mongoose';
import * as config from '../src/config';
import factory from './factories';

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
    firstname: 'johanna',
    lastname: 'greedy',
    email: 'johanna@orga.com',
    password: '12345678',
    organization_id: organizaton._id,
    role: 'organization_admin'
  });

  const peter = await factory.create('user', {
    firstname: 'peter',
    lastname: 'lustig',
    email: 'peter@orga.com',
    password: '12345678',
    organization_id: organizaton._id
  });

  const hubert = await factory.create('user', {
    firstname: 'hubert',
    lastname: 'anderson',
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
  await marketingTeam.addUser(johanna._id, 'member'); // test overwrite
  await marketingTeam.addUser(johanna._id, 'leader');
  await marketingTeam.addUser(peter._id, 'member');

  const salesTeam = await factory.create('team', {
    name: 'Sales',
    organization_id: organizaton._id,
  });
  await salesTeam.addUser(hubert._id, 'leader');
  await salesTeam.addUser(peter._id, 'member');

  // </Teams>
  // ---
  // <Goals>

  const privateGoal = await factory.create('goal', {
    title: 'Decrease stress level',
    is_private: true,
    created_by: peter._id,
    assignee: peter._id,
    organization_id: organizaton._id
  });

  const privateSubGoal0 = await factory.create('goal', {
    title: 'Meditate for 10 minutes every day',
    is_private: true,
    created_by: peter._id,
    assignee: peter._id,
    parent_goal: privateGoal._id,
    organization_id: organizaton._id
  });

  // TODO add to OA
  const objectiveAgreementGoal = await factory.create('goal', {
    title: 'Convert 25 salesforce Leads',
    created_by: peter._id,
    assignee: peter._id,
    organization_id: organizaton._id
  });

  const objectiveAgreementSubGoal0 = await factory.create('goal', {
    title: 'Prioritize existing salesforce Leads',
    is_private: true,
    created_by: peter._id,
    assignee: peter._id,
    parent_goal: objectiveAgreementGoal._id,
    organization_id: organizaton._id
  });

  const objectiveAgreementSubGoal1 = await factory.create('goal', {
    title: 'Call 2 salesforce Leads per Day',
    is_private: true,
    created_by: peter._id,
    assignee: peter._id,
    parent_goal: objectiveAgreementGoal._id,
    organization_id: organizaton._id
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

