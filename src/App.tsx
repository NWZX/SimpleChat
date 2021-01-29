import React from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './routes';

const App = (): JSX.Element => {
    const routing = useRoutes(routes);
    return <div>{routing}</div>;
};

export default App;
