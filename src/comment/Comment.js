import React, { useState } from 'react';
import PropTypes from 'prop-types';

import useFirebase from '../firebase/useFirebase';

const renderLoading = () => <p>Loading comment...</p>;

const Comment = props => {
    const [{ loading, commentData }, setCommentState] = useState({
        loading: true,
        commentData: null
    });

    useFirebase(
        props.id,
        () => {
            setCommentState({ loading: true, commentData: null });
        },
        snap => {
            const comment = snap && snap.val();
            console.log('Comment onValue called', comment);

            if (comment) {
                const { id, time, by, text } = comment;

                setCommentState({
                    loading: false,
                    commentData: {
                        id,
                        time: new Date(time * 1000),
                        by,
                        text
                    }
                });
            }
        }
    );

    const renderData = () => (
        <div>
            <button onClick={() => props.onSave(props.id)}>Save</button>
            <button onClick={() => props.onRead(props.id)}>Mark as Read</button>
            <button>Mark as Unread</button>
            <div
                style={{
                    textAlign: 'left',
                    border: props.isNew ? '2px solid red' : '1px solid black'
                }}
                dangerouslySetInnerHTML={{
                    __html: commentData.text
                }}
            />
        </div>
    );

    return <div>{loading ? renderLoading() : renderData()}</div>;
};

Comment.defaultProps = {
    isNew: false
};

Comment.propTypes = {
    id: PropTypes.number.isRequired,
    onSave: PropTypes.func.isRequired,
    onRead: PropTypes.func.isRequired,
    isNew: PropTypes.bool
};

export default Comment;
