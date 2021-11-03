import React from 'react';

const Button = ({
  text = 'default button text',
  type = 'primary',
  size = 'lg',
  disabled = false,
  onClick = () => {},
}) => {
  return (
    <button
      type="button"
      className={`btn btn-${type} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
      style={style}
    >
      {text}
    </button>
  );
};

export default Button;
