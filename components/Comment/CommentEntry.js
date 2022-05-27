import { Interweave } from "interweave";
import UpvoteDownvote from "./UpvoteDownvote";
import { mapDispatchToProps, mapStateToProps } from "../Redux/setter";
import { connect } from "react-redux";

const CommentEntry = ({ loggedIn, comment, problem_id }) => {
    return (
        <article className="flex flex-col items-start gap-2 mb-8 mt-8">
            <div className="flex flex-row items-end gap-2">
                <h1 className="text-xl text-black font-semibold">
                    {comment.owner}
                </h1>
            </div>
            <Interweave content={comment.comment} />
            {/* pass problem_id to UpvoteDownvote.js */}
            <UpvoteDownvote comment={comment} problem_id={problem_id}/>
        </article>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentEntry);