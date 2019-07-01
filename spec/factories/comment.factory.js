import CommentModel from "../../src/models/comment";

export default function(factory) {
  factory.define("comment", CommentModel, {
    text: factory.sequence("comment.text", n => `text-${n}`),
    date: factory.sequence("comment.date", n => `date-${n}`),
    createdBy: factory.assoc("user", "_id")
  });
}
