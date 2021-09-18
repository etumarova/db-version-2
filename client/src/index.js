import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';
import { auth0Domain, auth0ClientId } from './config';

ReactDOM.render(
    <React.StrictMode>
        <Auth0Provider
            domain={auth0Domain}
            clientId={auth0ClientId}
            redirectUri={window.location.origin}
            audience={`https://${auth0Domain}/api/v2/`}
            scope="read:current_user update:current_user_metadata read:users read:user_idp_tokens"
        >
            <App />
        </Auth0Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
