import { FC } from "react";
import Comment, { CommentProps } from "./Comment";

interface Props {
  comments: CommentProps[];
};

const Comments: FC<Props> = ({ comments }) => {
  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>
          <Comment comment={comment} level={1} />
        </div>
      ))}
    </div>
  );
};

export default Comments;