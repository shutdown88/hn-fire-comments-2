import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Comment from '../comment/Comment';
import useFirebase from '../firebase/useFirebase';

const renderComment = (c, onSave, onRead) => (
    <Comment id={c.id} isNew={c.isNew} onSave={onSave} onRead={onRead} />
);

const renderLoading = () => <p>Loading comments...</p>;

const renderBox = (title, comments, onSaved, onRead) => (
    <div>
        <h2>{title}</h2>
        <ul>
            {comments.map(c => (
                <li key={c.id}>{renderComment(c, onSaved, onRead)}</li>
            ))}
        </ul>
    </div>
);

const renderBoxes = (read, saved, comments, onSaved, onRead) => (
    <div>
        {renderBox(
            'Unread',
            comments.filter(c => !read.includes(c.id) && !saved.includes(c.id)),
            onSaved,
            onRead
        )}
        <hr />
        {renderBox(
            'Saved',
            comments.filter(c => saved.includes(c.id)),
            onSaved,
            onRead
        )}
        <hr />
        {renderBox(
            'Read',
            comments.filter(c => read.includes(c.id)),
            onSaved,
            onRead
        )}
    </div>
);

const PostComments = ({ postId, read, saved, onRead, onSaved }) => {
    const [{ loading, comments }, setCommentsStatus] = useState({
        loading: true,
        comments: []
    });

    useFirebase(
        postId,
        () => {
            setCommentsStatus({ loading: true, comments: [] });
        },
        snap => {
            const newComments = (snap.val().kids || []).map(id => ({ id }));

            setCommentsStatus(({ loading, comments }) => ({
                loading: false,
                comments:
                    !console.log('Post onValue called', `loading ${loading}`) &&
                    loading
                        ? newComments
                        : newComments.map(c =>
                              comments.map(x => x.id).includes(c.id)
                                  ? comments.find(x => x.id === c.id)
                                  : { ...c, isNew: true }
                          )
            }));
        }
    );

    return loading
        ? renderLoading()
        : renderBoxes(read, saved, comments, onSaved, onRead);
};

PostComments.propTypes = {
    postId: PropTypes.string.isRequired,
    read: PropTypes.arrayOf(PropTypes.number).isRequired,
    saved: PropTypes.arrayOf(PropTypes.number).isRequired,
    onRead: PropTypes.func.isRequired,
    onSaved: PropTypes.func.isRequired
};

export default PostComments;
