import React from 'react';
import { Box, Button, TextField, styled } from '@mui/material';

const FieldBox = styled(Box)(({}) => ({
  display: 'flex',
  alignItems: 'flex-end',
  '& .MuiFormLabel-root': {
    backgroundColor: 'white',
    paddingLeft: '4px',
    paddingRight: '4px',
    top: '-4px',
  },
}));

export const TextBox = ({
  label,
  inputProps,
  placeholder,
  type,
  row,
  variant,
  size = 'medium',
  fullWidth = true,
  Icon,
  iconClass,
  field,
  touched,
  value,
  initialValue,
  error,
  disabled = false,
  onChange,
  autoFocus = false,
}) => {
  return (
    <FieldBox>
      {Icon && (
        <div className={iconClass}>
          <Icon />
        </div>
      )}
      <TextField
        multiline={row ? true : false}
        InputProps={inputProps ? { inputProps } : {}}
        id={label ? label.toLowerCase() : undefined}
        label={label ? label : false}
        placeholder={placeholder ? placeholder : undefined}
        rows={row ? row : 1}
        variant={variant ? variant : 'standard'}
        type={type ? type : 'text'}
        fullWidth={fullWidth}
        error={(touched || value !== initialValue) && Boolean(error)}
        helperText={touched || value !== initialValue ? error : ''}
        onChange={onChange ? onChange : undefined}
        disabled={disabled}
        size={size}
        autoFocus={autoFocus}
        {...field}
      />
    </FieldBox>
  );
};

export const ContainedButton = ({
  text,
  type = 'button',
  onClick,
  fullWidth,
}) => {
  return (
    <Button
      variant='contained'
      type={type}
      onClick={() => {
        if (onClick) onClick();
      }}
      fullWidth={fullWidth}
    >
      {text}
    </Button>
  );
};
