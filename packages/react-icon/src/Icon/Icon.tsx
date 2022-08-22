import React from 'react';
import CSS from 'csstype';

import * as IconTypes from '../Icon.types';
import IconRender, { IconRenderProps } from '../IconFactory/IconRender';
import IconStack, { IconStackProps } from '../IconStack/IconStack';

import '../fontawesome/css/all.min.css';

export interface CSSProperties extends CSS.Properties<string | number> {
    '--fa-primary-color'?: CSS.Property.Color;
    '--fa-secondary-color'?: CSS.Property.Color;
    '--fa-primary-opacity'?: CSS.Property.Opacity;
    '--fa-secondary-opacity'?: CSS.Property.Opacity;
}

export interface IconProps {
    icon: IconTypes.IconNames;
    styling?: IconTypes.IconStyle;
    animation?: IconTypes.IconAnimation;
    size?: IconTypes.IconSize;
    rotation?: IconTypes.IconRotation;
    className?: string;
    style?: CSSProperties;

    primaryColor?: CSS.Property.Color;
    secondaryColor?: CSS.Property.Color;
    primaryOpacity?: CSS.Property.Opacity;
    secondaryOpacity?: CSS.Property.Opacity;
    swapOpacity?: boolean;
}
export type IconPropsOrDefault = Omit<IconProps, 'icon'> & { icon?: IconTypes.IconNames };

interface Subcomponents {
    Stack: React.FC<IconStackProps>;
    Render: React.FC<IconRenderProps>;
}

const Icon: React.FC<IconProps> & Subcomponents = (props: IconProps) => {
    const styling: IconTypes.IconStyle = props.styling || 'regular';
    let prefix;

    switch (styling) {
        case 'regular':
            prefix = 'far';
            break;
        case 'light':
            prefix = 'fal';
            break;
        case 'solid':
            prefix = 'fas';
            break;
        case 'duotone':
            prefix = 'fad';
            break;
    }

    const animation = props.animation ? `fa-${props.animation}` : '';
    const size = props.size ? `fa-${props.size}` : '';
    const rotation = props.rotation ? `fa-${props.rotation}` : '';

    const style: CSSProperties = props.style ?? {};
    if (props.primaryColor) style['--fa-primary-color'] = props.primaryColor;
    if (props.secondaryColor) style['--fa-secondary-color'] = props.secondaryColor;
    if (props.primaryOpacity) style['--fa-primary-opacity'] = props.primaryOpacity;
    if (props.secondaryOpacity) style['--fa-secondary-opacity'] = props.secondaryOpacity;

    return (
        <i
            className={`${prefix} fa-${props.icon} ${animation} ${size} ${rotation} ${props.className || ''} ${
                props.swapOpacity ? 'fa-swap-opacity' : ''
            }`}
            style={style}
        ></i>
    );
};

Icon.Stack = IconStack;
Icon.Render = IconRender;

export default Icon;
