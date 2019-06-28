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

  const johanna = await factory.create('user', {
    firstname: 'johanna',
    lastname: 'greedy',
    email: 'johanna@orga.com',
    password: '1234!-johanna',
    organization_id: organizaton._id
  });

  const peter = await factory.create('user', {
    firstname: 'peter',
    lastname: 'lustig',
    email: 'peter@orga.com',
    password: '1234!-peter',
    organization_id: organizaton._id
  });

  const hubert = await factory.create('user', {
    firstname: 'hubert',
    lastname: 'anderson',
    email: 'hubert@orga.com',
    password: '1234!-hubert',
    organization_id: organizaton._id
  });

  // </Users>
  // ---
  // <Teams>

  const marketingTeam = await factory.create('team', {
    name: 'Marketing',
    organization_id: organizaton._id,
  });
  await marketingTeam.addUser(johanna, 'member'); // test overwrite
  await marketingTeam.addUser(johanna, 'leader');
  await marketingTeam.addUser(peter, 'member');

  const salesTeam = await factory.create('team', {
    name: 'Sales',
    organization_id: organizaton._id,
  });
  await salesTeam.addUser(hubert, 'leader');
  await salesTeam.addUser(peter, 'member');

  // </Teams>
  // ---
  // <Goals>

  const privateGoal = await factory.create('goal', {
    title: 'Private Goal',
    is_private: true,
    created_by: peter._id,
    assignee: peter._id,
    organization_id: organizaton._id
  });

  // TODO add to OA
  const objectiveAgreementGoal = await factory.create('goal', {
    title: 'Objective agreement Goal',
    created_by: peter._id,
    assignee: peter._id,
    organization_id: organizaton._id
  });

  const teamGoal = await factory.create('goal', {
    title: 'Team Goal',
    created_by: johanna._id,
    related_to: marketingTeam._id,
    related_model: 'Team',
    organization_id: organizaton._id
  });

  const organizationGoal = await factory.create('goal', {
    title: 'Organization Goal',
    created_by: hubert._id,
    related_to: organizaton._id,
    related_model: 'Organization',
    organization_id: organizaton._id
  });

  // </Goals>

}

