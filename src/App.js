import React, { Component } from 'react';

import PostComments from './comments/PostComments';

import './App.css';

const COMMENT_STATUS = {
    READ: 'read',
    SAVED: 'saved'
};

const getCommentsWithStatus = (status, readSavedMap) =>
    Object.keys(readSavedMap)
        .filter(id => readSavedMap[id] === status)
        .map(x => parseInt(x, 10));

const getReadComments = readSavedMap =>
    getCommentsWithStatus(COMMENT_STATUS.READ, readSavedMap);

const getSavedComments = readSavedMap =>
    getCommentsWithStatus(COMMENT_STATUS.SAVED, readSavedMap);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { activePostId: null, readSavedMap: {} };

        this.input = null;
    }

    setPostId = () => {
        const activePostId = this.input.value;
        this.setState({ activePostId });
    };

    saveComment = id => {
        this.setState(({ readSavedMap }) => ({
            readSavedMap: {
                ...readSavedMap,
                [id]: COMMENT_STATUS.SAVED
            }
        }));
    };

    readComment = id => {
        this.setState(({ readSavedMap }) => ({
            readSavedMap: {
                ...readSavedMap,
                [id]: COMMENT_STATUS.READ
            }
        }));
    };

    resetPostId = () => {
        this.input.value = '';
        this.setState({ activePostId: null });
    };

    render = () => (
        <div className="App">
            <header className="App-header">
                <h1 className="App-title">HN fire comments</h1>
            </header>
            <div>
                <label htmlFor="postId">
                    Post ID:
                    <input
                        type="text"
                        name="postId"
                        ref={input => {
                            this.input = input;
                        }}
                    />
                </label>
                <button onClick={this.setPostId}>Set Post ID</button>
                <button onClick={this.resetPostId}>Reset</button>
            </div>
            <div>
                <p>
                    {this.state.activePostId &&
                        `Post id ${this.state.activePostId}`}
                </p>
                {this.state.activePostId && (
                    <PostComments
                        postId={this.state.activePostId}
                        read={getReadComments(this.state.readSavedMap)}
                        saved={getSavedComments(this.state.readSavedMap)}
                        onRead={this.readComment}
                        onSaved={this.saveComment}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
