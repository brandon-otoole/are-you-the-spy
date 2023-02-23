export const wsConnect = (host, gameId) => ({ type: 'WS_CONNECT', host, gameId });
export const wsConnecting = host => ({ type: 'WS_CONNECTING', host });
export const wsConnected = host => ({ type: 'WS_CONNECTED', host });
export const wsDisconnect = host => ({ type: 'WS_DISCONNECT', host });
export const wsDisconnected = host => ({ type: 'WS_DISCONNECTED', host });
export const wsJoin = gameId => ({ type: 'WS_JOIN', gameId });

export const setGameId = gameId => ({ type: 'SET_GAME_ID', gameId });
