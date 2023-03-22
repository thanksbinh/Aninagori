import { FC } from "react";
import Comment from "./Comment";
import { CommentProps } from "./Comment.types";

interface Props {
  comments: CommentProps[];
};

const Comments: FC<Props> = ({ comments }) => {
  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>
          <Comment comment={comment} />
        </div>
      ))}
    </div>
  );
};

export default Comments;