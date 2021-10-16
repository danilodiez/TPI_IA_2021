import React from 'react';

function Button({ text = 'press me', type = 'primary' }) {
  return (
    <button type="button" class={`btn btn-${type}`}>
      {text}
    </button>
  );
}

export default Button;
