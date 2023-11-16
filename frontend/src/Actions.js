export const wsConnect = (socketPath) => ({ type: 'WS_CONNECT', socketPath });
export const wsConnecting = () => ({ type: 'WS_CONNECTING' });
export const wsConnected = () => ({ type: 'WS_CONNECTED' });
export const wsDisconnect = () => ({ type: 'WS_DISCONNECT'});
export const wsDisconnected = () => ({ type: 'WS_DISCONNECTED' });
export const wsMessage = msg => ({ type: 'WS_MESSAGE', msg });

export const setGameId = gameId => ({ type: 'SET_GAME_ID', gameId });
