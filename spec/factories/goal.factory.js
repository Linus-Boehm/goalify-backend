import GoalModel from '../../src/models/goal'

export default function (factory) {

  factory.define('goal', GoalModel, {
    title: factory.sequence('goal.title', n => `Goal ${n}`),

    created_by: factory.assoc('user', '_id')
  });

}