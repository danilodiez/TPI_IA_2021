import React from 'react';

// TODO: Add styles
function Button({
  text = 'default button text',
  type = 'primary',
  size = 'lg',
  disabled = false,
  handleClick = () => console.log('Default onClick action'),
}) {
  return (
    <button
      type="button"
      className={`btn btn-${type} btn-${size}`}
      disabled={disabled}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}

export default Button;
