import React from 'react';
import { Helmet } from 'react-helmet';

interface Props {
    title: string;
}

const NotFoundView = ({ title }: Props): JSX.Element => {
    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <link rel="canonical" href={window.location.href} />
            </Helmet>
        </>
    );
};

export default NotFoundView;
