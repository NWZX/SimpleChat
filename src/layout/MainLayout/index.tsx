import React from 'react';
import { Outlet } from 'react-router';

interface Props {}

const MainLayout = ({}: Props): JSX.Element => {
    return (
        <div style={{ overflow: 'hidden', padding: 5 }}>
            <Outlet />
        </div>
    );
};

export default MainLayout;
