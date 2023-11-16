'use strict'

import debug from "./debugLogger.js";

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_GAME_ID':
            return {
                ...state,
                game: {
                    ...state.game,
                    gameId: action.gameId,
                },
            };

        case 'join/grant':
            debug.log("join grant");
            return {
                ...state,
                game: {
                    myPlayerId: action.data.myPlayerId,
                    playerRole: action.data.role,
                    started: action.data.started,
                    players: Object.values(action.data.state),
                },
            };

        case 'join/deny':
            return {
                ...state,
                game: false
            };

        case 'lobby/addPlayer':
            return {
                ...state,
                game: {
                    ...state.game,
                    players: state.game.players.concat(action.data)
                },
            };

        case 'lobby/playerReady':
            return {
                ...state,
                game: {
                    ...state.game,
                    players: state.game.players.map((p, i, a) => {
                        if (p.id === action.data.id) {
                            let newPlayer = JSON.parse(JSON.stringify(p));
                            newPlayer.ready = action.data.ready;

                            return newPlayer;
                        } else {
                            return p;
                        }
                    })
                },
            }

        case 'lobby/enableStart':
            return {
                ...state,
                game: {
                    ...state.game,
                    enabled: action.data.enabled,
                },
            };

        case 'game/start':
            return {
                ...state,
                game: {
                    ...state.game,
                    started: true,
                    playerRole: action.data.role,
                },
            };

        case 'game/eliminatePlayer':
            debug.log("MESSAGE STUB: ", "game/eliminatePlayer");
            return {
                ...state,
            };

        default:
            if (action.type.slice(0, 8) === "@@redux/") {
                // do nothing
            } else {
                debug.log("missed message:", action);
            }

            return {
                ...state,
            };
    }
}

export default reducer;

//            case 'lobby/playerNotReady':
//                let notReadyCopy = JSON.parse(JSON.stringify(players));
//
//                for (let player of notReadyCopy) {
//                    if (player.name === action.data.name) {
//                        player.ready = false;
//                    }
//                }
//
//                changePlayers(notReadyCopy);
//                break;
