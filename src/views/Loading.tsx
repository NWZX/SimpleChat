import { Spinner, SpinnerSize } from '@fluentui/react';
import React from 'react';
import { Helmet } from 'react-helmet';
import { FluentGrid, FluentGridItem } from 'src/components/FluentGrid';

interface Props {
    title: string;
}

const Loading = ({ title }: Props): JSX.Element => {
    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta charSet="utf-8" />
            </Helmet>
            <FluentGrid justify="center" style={{ minHeight: '100vh' }}>
                <FluentGridItem xs={12}>
                    <Spinner
                        styles={{ circle: { borderWidth: '0.4rem' } }}
                        size={SpinnerSize.large}
                        label="Loading..."
                    />
                </FluentGridItem>
            </FluentGrid>
        </>
    );
};

export default Loading;
