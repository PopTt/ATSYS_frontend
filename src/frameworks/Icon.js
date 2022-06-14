import React from 'react';
import { Tooltip, IconButton } from '@mui/material';

export const IconBox = ({
  source,
  title,
  alt = 'Icon',
  isCursor = false,
  needBackground = false,
  width = 35,
  height = 35,
  onClick,
}) => {
  return (
    <Tooltip title={title}>
      <IconButton
        onClick={onClick}
        style={{
          backgroundColor: needBackground ? 'white' : 'none',
          cursor: title !== '' || isCursor ? 'pointer' : 'default',
        }}
      >
        <img src={source} width={width} height={height} alt={alt} />
      </IconButton>
    </Tooltip>
  );
};
