import React from 'react';
import { Route } from 'react-router-dom';
import Offline from './Offline';

const RouteOnlineOnly = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={matchProps => (
            navigator.onLine ? <Component {...matchProps} /> : <Offline />
        )} />
    );
};

export default RouteOnlineOnly;