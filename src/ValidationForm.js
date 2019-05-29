import React from "react";
import PropTypes from "prop-types";
import { View,Keyboard } from "react-native";
import rules from "./rules";

export default class ValidationForm extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
    this.validationComponents = [];
    this.attachToForm = this.attachToForm.bind(this);
    this.firstError = null;
  }

  isValid() {
    let isValid = true;
    let index = 0;
    this.validationComponents.forEach( (component) => {
      let temp = component.isValid(rules);
      if(isValid && !temp) {
        isValid = false;
        //component.props.component.props.onRef.inputRef.focus();
        this.firstError = component.props.id;
      }
    });
    return isValid;
  }

  validate() {
    //Keyboard.dismiss();
    const { onSubmit, onError } = this.props;

    if (this.isValid()) {
      onSubmit();
      return;
    }

    if (onError) {
      onError(this.firstError);
    }
  }

  getChildContext() {
    return {
      form: {
        attachToForm: this.attachToForm,
      },
    };
  }

  attachToForm(component) {
    this.validationComponents.push(component);
  }

  render() {
    const { children, ...rest } = this.props;
    return <View {...rest}>{children}</View>;
  }
}

ValidationForm.addValidationRule = (name, callback) => {
  rules[name] = callback;
};

ValidationForm.childContextTypes = {
  form: PropTypes.element.object,
};

ValidationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onError: PropTypes.func,
};
