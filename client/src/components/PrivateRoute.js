import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function PrivateRoute({ component: Component, ...rest }) {
  const { isAuthenticated } = useAuth0();
  return (
    <Route
      {...rest}
      render={(props) =>
        (isAuthenticated || localStorage.getItem('user')) ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/', state: { referer: props.location } }} />
        )
      }
    />
  );
}

export default PrivateRoute;
