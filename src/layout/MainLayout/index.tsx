import React from 'react';
import { Outlet } from 'react-router';

interface Props {}

const MainLayout = ({}: Props): JSX.Element => {
    return (
        <div>
            <Outlet />
        </div>
    );
};

export default MainLayout;
