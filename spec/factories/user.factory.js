import UserModel from '../../src/models/user'

export default function (factory) {

  factory.define('user', UserModel, {
    firstname: factory.sequence('user.firstname', n => `firstname-${n}`),
    lastname: factory.sequence('user.lastname', n => `lastname-${n}`),

    email: factory.sequence('user.email', n => `user-${n}@goalify.com`),

    password: factory.sequence('user.password', n => `user${n}-123!`),

    organization_id: factory.assoc('organization', '_id')
  });

}