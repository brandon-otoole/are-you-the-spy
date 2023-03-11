const LoggerMiddleware = store => next => action => {
    console.log("MWM", action);

    return next(action);
};

export default LoggerMiddleware;
