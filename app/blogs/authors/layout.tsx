import React from 'react';

const AuthorLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div>
            <h1>My Blog Author layout</h1>
            {children}
        </div>
    );
};

export default AuthorLayout;