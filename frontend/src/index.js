import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';

import reducer from "./reducer.js";

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import './style.css';

import WSMiddleware from './WSMiddleware';
import LoggerMiddleware from './LoggerMiddleware';

import App from './App';
import Game from './Game';
import Home from './Home';
import Setup from './Setup';

import ErrorPage from './ErrorPage';

const middleware = []
const DEBUG_TEST = ["DEBUG", "TRUE"].join('_');
if (DEBUG_TEST == "DEBUG_PLACEHOLDER") {
    middleware.push(LoggerMiddleware);
}
middleware.push(WSMiddleware);

const store = createStore(
    reducer,
    { game: { players: [] } },
    compose(
        applyMiddleware(...middleware),
    )
)

const RequireAuth: FC<{ children: React.ReactElement }> = ({ children }) => {
    const userIsLogged = localStorage.getItem('isSetup');

    if (!userIsLogged) {
        return <Setup />
    }

    return children;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "",
                element: <Home />,
            }, {
                path: "/:gameId",
                element:
                    <RequireAuth>
                      <Game />
                    </RequireAuth>
            }, {
                path: "setup",
                element: <Setup />,
            }
        ]
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <Provider store = {store}>
    <RouterProvider router={router}/>
   </Provider>
  </React.StrictMode>
);
