import React from 'react';
import { IconProps } from '../Icon/Icon';
import { IconSize } from '../Icon.types';

export interface IconStackProps {
    children: React.ReactElement<IconProps>[];
    size?: IconSize;
}

const IconStack = (props: IconStackProps) => {
    let [child1, child2] = props.children;

    child1 = React.cloneElement(child1, { className: (child1.props.className || '') + ' fa-stack-1x' });
    child2 = React.cloneElement(child2, { className: (child2.props.className || '') + ' fa-stack-1x' });

    const size = props.size ? `fa-${props.size}` : '';

    return (
        <span className={`fa-stack ${size}`}>
            {child1}
            {child2}
        </span>
    );
};

export default IconStack;
