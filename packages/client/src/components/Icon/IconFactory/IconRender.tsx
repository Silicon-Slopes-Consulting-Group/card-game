import React from 'react';
import Icon, { IconType } from '../';
import { hasOwnProperty } from '../../../utils/objects-utils';
import { IconProps, IconPropsOrDefault } from '../Icon/Icon';
import IconStack, { IconStackProps } from '../IconStack/IconStack';

export interface IconRenderProps {
    icon: IconType;
    default?: IconPropsOrDefault;
    force?: IconPropsOrDefault;
}

const IconRender : React.FC<IconRenderProps> = (props) => {
    if(React.isValidElement(props.icon)) {
        if((props.default || props.force) && !hasOwnProperty(props.icon.props, 'children')) {
            let iconProps = props.icon.props;
            if(props.default) iconProps = {...props.default, ...iconProps};
            if(props.force) iconProps = {...iconProps, ...props.force};
            return <Icon {...iconProps} />;
        } else {
            return props.icon;
        }
    }

    if(typeof props.icon === 'string') {
        let iconProps = {icon: props.icon};
        if(props.default) iconProps = {...props.default, ...iconProps};
        if(props.force) iconProps = {...iconProps, ...props.force};
        return (<Icon {...iconProps} />);
    }

    if(hasOwnProperty(props.icon, 'children')) {
        const stackProps = { ...props.icon } as unknown as IconStackProps;
        return <IconStack {...stackProps} />;
    }

    let iconProps = { ...props.icon } as unknown as IconProps;
    if(props.default) iconProps = {...props.default, ...iconProps};
    if(props.force) iconProps = {...iconProps, ...props.force};
    return <Icon {...iconProps} />;
};

export default IconRender;