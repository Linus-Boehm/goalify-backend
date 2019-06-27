import OrganizatonModel from '../../src/models/organization'

export default function (factory) {

  factory.define('organization', OrganizatonModel, {
    name: factory.sequence('organization.name', n => `Organization ${n}`)

  });

}