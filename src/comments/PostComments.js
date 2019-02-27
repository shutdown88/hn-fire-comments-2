import React, { Component } from 'react';
import PropTypes from 'prop-types';

import firebase from '../firebase/firebase';
import Comment from '../comment/Comment';

const renderComment = (c, onSave, onRead) => (
    <Comment id={c.id} isNew={c.isNew} onSave={onSave} onRead={onRead} />
);

const renderLoading = () => <p>Loading comments...</p>;

export default class PostComments extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, comments: [] };

        this.database = firebase.database();
        this.firebaseCallback = null;
    }

    componentDidMount() {
        this.registerForId(this.props.postId);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.postId !== this.props.postId) {
            /* eslint-disable react/no-did-update-set-state */
            this.setState({ loading: true, comments: [] });
            /* eslint-enable react/no-did-update-set-state */
            this.registerForId(this.props.postId);
        }
    }

    componentWillUnmount() {
        this.unregister();
    }

    onValue = snap => {
        console.log('Post onValue called');
        const newComments = (snap.val().kids || []).map(id => ({ id }));

        this.setState(({ loading, comments }) => ({
            loading: false,
            comments: loading
                ? newComments
                : newComments.map(
                      c =>
                          comments.map(x => x.id).includes(c.id)
                              ? comments.find(x => x.id === c.id)
                              : { ...c, isNew: true }
                  )
        }));
    };

    registerForId = id => {
        this.unregister();
        this.firebaseRef = this.database.ref(`/v0/item/${id}`);
        this.firebaseCallback = this.firebaseRef.on('value', this.onValue);
    };

    unregister = () => {
        if (this.firebaseRef && this.firebaseCallback) {
            this.firebaseRef.off('value', this.firebaseCallback);
        }
    };

    renderBox = (title, filterFn) => (
        <div>
            <h2>{title}</h2>
            <ul>
                {this.state.comments
                    .filter(filterFn)
                    .map(c => (
                        <li key={c.id}>
                            {renderComment(
                                c,
                                this.props.onSaved,
                                this.props.onRead
                            )}
                        </li>
                    ))}
            </ul>
        </div>
    );

    renderBoxes = () => (
        <div>
            {this.renderBox(
                'Unread',
                c =>
                    !this.props.read.includes(c.id) &&
                    !this.props.saved.includes(c.id)
            )}
            <hr />
            {this.renderBox('Saved', c => this.props.saved.includes(c.id))}
            <hr />
            {this.renderBox('Read', c => this.props.read.includes(c.id))}
        </div>
    );

    render = () => (this.state.loading ? renderLoading() : this.renderBoxes());
}

PostComments.propTypes = {
    postId: PropTypes.string.isRequired,
    read: PropTypes.arrayOf(PropTypes.number).isRequired,
    saved: PropTypes.arrayOf(PropTypes.number).isRequired,
    onRead: PropTypes.func.isRequired,
    onSaved: PropTypes.func.isRequired
};
