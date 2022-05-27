import { BiUpvote, BiDownvote } from "react-icons/bi";
import "react-quill/dist/quill.snow.css";

import { useContext } from "react";
import { FirebaseContext, getData, postData } from "../../components/firebase";
import { mapDispatchToProps, mapStateToProps } from "../Redux/setter";
import "react-quill/dist/quill.snow.css";
import { connect } from "react-redux";

import { getAuth } from "firebase/auth";

const UpvoteDownvote = ({ loggedIn, problem_id, comment }) => {
    const { db } = useContext(FirebaseContext);
    const comment_id = comment.id;

    // get UID and upvote record
    const auth = getAuth();
    const uid = auth.currentUser.uid;

    const upvoteRecord = null;
    const downvoteRecord = null;

    let newUpvote = comment.upvote;
    let newDownvote = comment.downvote;

    async function getUser(){
        await getData(db, `/user/${uid}`).then((_user) => {
            upvoteRecord = _user.upvoted;
            downvoteRecord = _user.downvoted;
        }).catch(e => console.log(e));
    }
    getUser();

    async function upvote() {
        // create upvote record if user does not have it
        if (!upvoteRecord) {
            upvoteRecord = {};
        }
        if(upvoteRecord[comment_id] === true) {
            upvoteRecord[comment_id] = false;
            newUpvote = newUpvote - 1;
        } else{
            upvoteRecord[comment_id] = true;
            newUpvote = newUpvote + 1;
        }

        await postData(db, `/comment/${problem_id}/${comment_id}`, {
            ...comment,
            upvote: newUpvote
        }).catch((e) => {
            console.log(e);
        });

        await postData(db, `/user/${uid}`, {
            ...loggedIn,
            upvoted: upvoteRecord,
        }).catch((e) => {
            console.log(e);
        });
    }

    async function downvote() {
        if (!downvoteRecord) {
            downvoteRecord = {};
        }
        if(downvoteRecord[comment_id] === true) {
            downvoteRecord[comment_id] = false;
            newDownvote = newDownvote - 1;
        } else{
            downvoteRecord[comment_id] = true;
            newDownvote = newDownvote + 1;
        }

        await postData(db, `/comment/${problem_id}/${comment_id}`, {
            ...comment,
            downvote: newDownvote
        }).catch((e) => {
            console.log(e);
        });

        await postData(db, `/user/${uid}`, {
            ...loggedIn,
            downvote: downvoteRecord,
        }).catch((e) => {
            console.log(e);
        });
    }

    return (
        <div className="flex flex-row gap-1 items-center">
            <button onClick={() => upvote()}>
                <BiUpvote />
            </button>
            <span className="mr-2">{comment.upvote}</span>
            <button onClick={() => downvote()}>
                <BiDownvote />
            </button>
            <span>{comment.downvote}</span>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(UpvoteDownvote);
