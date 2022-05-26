import { Interweave } from "interweave";
import { BiUpvote, BiDownvote } from "react-icons/bi";

const CommentEntry = ({ comment }) => {
    return (
        <article className="flex flex-col items-start gap-2 mb-8 mt-8">
            <div className="flex flex-row items-end gap-2">
                <h1 className="text-xl text-black font-semibold">
                    {comment.owner}
                </h1>
            </div>
            <Interweave content={comment.comment} />
            <div className="flex flex-row gap-1 items-center">
                <button>
                    <BiUpvote />
                </button>
                <span className="mr-2">{comment.upvote}</span>
                <button>
                    <BiDownvote />
                </button>
                <span>{comment.downvote}</span>
            </div>
        </article>
    );
};

export default CommentEntry;
