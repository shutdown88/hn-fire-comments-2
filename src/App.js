import React, { useState, useRef } from 'react';

import PostComments from './comments/PostComments';

import './App.css';

// TODO mark as unread not working

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

const App = () => {
    const [activePostId, setActivePostId] = useState(null);
    const [readSavedMap, setReadSavedMap] = useState({});

    const inputRef = useRef(null);

    const setPostId = () => {
        setActivePostId(inputRef.current.value);
    };

    const saveComment = id => {
        setReadSavedMap(readSavedMap => ({
            ...readSavedMap,
            [id]: COMMENT_STATUS.SAVED
        }));
    };

    const readComment = id => {
        setReadSavedMap(readSavedMap => ({
            ...readSavedMap,
            [id]: COMMENT_STATUS.READ
        }));
    };

    const resetPostId = () => {
        inputRef.current.value = '';
        setActivePostId(null);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1 className="App-title">HN fire comments</h1>
            </header>
            <div>
                <label htmlFor="postId">
                    Post ID:
                    <input type="text" name="postId" ref={inputRef} />
                </label>
                <button onClick={setPostId}>Set Post ID</button>
                <button onClick={resetPostId}>Reset</button>
            </div>
            <div>
                <p>{activePostId && `Post id ${activePostId}`}</p>
                {activePostId && (
                    <PostComments
                        postId={activePostId}
                        read={getReadComments(readSavedMap)}
                        saved={getSavedComments(readSavedMap)}
                        onRead={readComment}
                        onSaved={saveComment}
                    />
                )}
            </div>
        </div>
    );
};

export default App;
