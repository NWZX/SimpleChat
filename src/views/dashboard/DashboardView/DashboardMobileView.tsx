import React from 'react';
import { Helmet } from 'react-helmet';
import ContactMobileView from './ContactView/ContactMobileView';

interface Props {
    title: string;
}

const DashboardMobileView = ({ title }: Props): JSX.Element => {
    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <link rel="canonical" href={window.location.href} />
            </Helmet>
            <ContactMobileView />
        </>
    );
};

export default DashboardMobileView;
