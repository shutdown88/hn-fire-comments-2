import { useEffect, useRef } from 'react';
import firebase from './firebase';

const useFirebase = (itemId, onLoading, onValue) => {
    const databaseRef = useRef(null);

    // Just first render
    useEffect(() => {
        databaseRef.current = firebase.database();
    }, []);

    // Every time itemId changes
    useEffect(() => {
        console.log(`Subscribing to ${itemId}`);
        onLoading();
        const firebaseRef = databaseRef.current.ref(`/v0/item/${itemId}`);
        const firebaseCallback = firebaseRef.on('value', onValue);

        return () => {
            console.log(`Unsubscribing from ${itemId}`);
            firebaseRef.off('value', firebaseCallback);
        };
    }, [itemId]);
};

export default useFirebase;
