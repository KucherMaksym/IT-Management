import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./redux/store";
import {QueryClient, QueryClientProvider} from "react-query";
import axios from "axios";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));

export const customAxios = axios.create({
    withCredentials: true,
})

root.render(
    //<React.StrictMode>
    <Provider store={store}>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </QueryClientProvider>
    </Provider>
    //</React.StrictMode>
);

