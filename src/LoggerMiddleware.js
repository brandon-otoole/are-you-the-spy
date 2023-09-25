const LoggerMiddleware = store => next => action => {
    console.debug("MWD", action);

    return next(action);
};

export default LoggerMiddleware;
