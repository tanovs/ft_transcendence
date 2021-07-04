import {
  Button,
  ButtonProps,
} from 'semantic-ui-react';
import './CustomButton.css';

const CustomButtonDefaultProps: ButtonProps = {
  fluid: true,
  size: 'mini',
  color: 'black',
  inverted: true,
  className: 'buttonStyle',
  animated: 'vertical',
};

interface CustomButtonWrapperProps {
  props?: ButtonProps;
  hidden: any;
  visible: any;
};


const CustomButton: React.FC<CustomButtonWrapperProps> = ({props, visible, hidden}) => {
  return (
    <Button {...CustomButtonDefaultProps} {...props} >
      <Button.Content visible>
        {visible}
      </Button.Content>
      <Button.Content hidden>
        {hidden}
      </Button.Content>
    </Button>
  );
}

export default CustomButton;
