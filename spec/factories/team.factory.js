import TeamModel from '../../src/models/team'

export default function (factory) {

  factory.define('team', TeamModel, {
    name: factory.sequence('team.name', n => `Team ${n}`),

    organization_id: factory.assoc('organization', '_id')
  });

}