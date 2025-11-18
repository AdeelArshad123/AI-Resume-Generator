import { useState, useCallback } from 'react';

export const useHistoryState = <T>(initialState: T) => {
    const [history, setHistory] = useState([initialState]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const present = history[currentIndex];

    const setState = useCallback((newState: T | ((prevState: T) => T)) => {
        setHistory(currentHistory => {
            const currentState = currentHistory[currentIndex];
            const resolvedState = typeof newState === 'function'
                ? (newState as (prevState: T) => T)(currentState)
                : newState;

            // If the new state is the same as the current, do nothing
            if (JSON.stringify(resolvedState) === JSON.stringify(currentState)) {
                return currentHistory;
            }

            const newHistory = currentHistory.slice(0, currentIndex + 1);
            newHistory.push(resolvedState);
            setCurrentIndex(newHistory.length - 1);
            return newHistory;
        });
    }, [currentIndex]);

    const undo = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prevIndex => prevIndex - 1);
        }
    }, [currentIndex]);

    const redo = useCallback(() => {
        if (currentIndex < history.length - 1) {
            setCurrentIndex(prevIndex => prevIndex + 1);
        }
    }, [currentIndex, history.length]);

    const reset = useCallback(() => {
        setHistory([initialState]);
        setCurrentIndex(0);
    }, [initialState]);


    const canUndo = currentIndex > 0;
    const canRedo = currentIndex < history.length - 1;

    return {
        state: present,
        setState,
        undo,
        redo,
        canUndo,
        canRedo,
        reset,
    };
};