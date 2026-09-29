import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  block = false,
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  icon = null,
  ...props
}) {
  const variantClass = variant ? `btn-${variant}` : '';
  const blockClass = block ? 'btn-block' : '';
  const classes = ['btn', variantClass, blockClass, className].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
}
