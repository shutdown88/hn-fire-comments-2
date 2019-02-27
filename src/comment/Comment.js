import React, { Component } from 'react';
import PropTypes from 'prop-types';

import firebase from '../firebase/firebase';

const renderLoading = () => <p>Loading comment...</p>;

export default class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, commentData: null };

        this.database = firebase.database();
        this.firebaseCallback = null;
    }

    componentDidMount() {
        this.registerForId(this.props.id);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id) {
            /* eslint-disable react/no-did-update-set-state */
            this.setState({ loading: true, commentData: null });
            /* eslint-enable react/no-did-update-set-state */
            this.registerForId(this.props.id);
        }
    }

    componentWillUnmount() {
        this.unregister();
    }

    onValue = snap => {
        const comment = snap && snap.val();
        console.log('Comment onValue called', comment);

        if (comment) {
            const { id, time, by, text } = comment;

            this.setState({
                loading: false,
                commentData: {
                    id,
                    time: new Date(time * 1000),
                    by,
                    text
                }
            });
        }
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

    renderData = () => (
        <div>
            <button onClick={() => this.props.onSave(this.props.id)}>
                Save
            </button>
            <button onClick={() => this.props.onRead(this.props.id)}>
                Mark as Read
            </button>
            <button>Mark as Unread</button>
            <div
                style={{
                    textAlign: 'left',
                    border: this.props.isNew
                        ? '2px solid red'
                        : '1px solid black'
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.commentData.text
                }}
            />
        </div>
    );

    render = () => (
        <div>{this.state.loading ? renderLoading() : this.renderData()}</div>
    );
}

Comment.defaultProps = {
    isNew: false
};

Comment.propTypes = {
    id: PropTypes.number.isRequired,
    onSave: PropTypes.func.isRequired,
    onRead: PropTypes.func.isRequired,
    isNew: PropTypes.bool
};
