import ObjectiveAgreementModel from '../../src/models/objective_agreement'

export default function (factory) {

  factory.define('agreement', ObjectiveAgreementModel, {
    organization: factory.assoc('organization', '_id'),

    assignee: factory.assoc('user', '_id'),
    reviewer: factory.assoc('user', '_id'),
  });
}