import React from 'react';
import ReactDOM from 'react-dom/client';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import './style.css';

import App from './App';
import Join from './Join';
import Game, { gameLoader } from './Game';
import New from './New';
import Home from './Home';
import Setup from './Setup';

import ErrorPage from './ErrorPage';

const RequireAuth: FC<{ children: React.ReactElement }> = ({ children }) => {
    const userIsLogged = localStorage.getItem('name');

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
            },
            {
                path: "/:gameId",
                element:
                    <RequireAuth>
                      <Game />
                    </RequireAuth>
                ,
                loader: gameLoader,
            },
            {
                path: "join",
                element: <Join />,
            },
            {
                path: "gamer/:gameId",
                element:
                    <RequireAuth>
                      <Game />
                    </RequireAuth>
                ,
            },
            {
                path: "new",
                element: <New />,
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
    <RouterProvider router={router}/>
  </React.StrictMode>
);

  //<React.StrictMode>
  //  { <RouterProvider router={router}/> }
  //</React.StrictMode>

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
