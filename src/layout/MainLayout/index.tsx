import React from 'react';
import { Outlet } from 'react-router';

interface Props {}

const MainLayout = ({}: Props): JSX.Element => {
    return (
        <div style={{ minHeight: '100vh', overflow: 'hidden', padding: 20 }}>
            <Outlet />
        </div>
    );
};

export default MainLayout;
