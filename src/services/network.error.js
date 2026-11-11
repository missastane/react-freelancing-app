
const listeners = new Set();

let networkError = null;

export const setNetworkError = (error) => {
    networkError = error;

    listeners.forEach((listener) => {
        listener(networkError);
    });
};

export const clearNetworkError = () => {
    networkError = null;

    listeners.forEach((listener) => {
        listener(null);
    });
};

export const getNetworkError = () => networkError;

export const subscribeNetworkError = (listener) => {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
};
