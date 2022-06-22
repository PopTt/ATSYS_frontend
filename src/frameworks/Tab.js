import { Box, Tabs } from '@mui/material';

export function TabPanel({ children, value, index }) {
  return (
    <div role='tabpanel' hidden={value !== index}>
      {value === index && (
        <div style={{ width: '1000px', margin: '0 auto' }}>{children}</div>
      )}
    </div>
  );
}

export const TabsPanel = ({ value, setValue, width = '1000px', children }) => {
  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        width: width,
        margin: '0 auto',
      }}
    >
      <Tabs value={value} onChange={(_, value) => setValue(value)}>
        {children}
      </Tabs>
    </Box>
  );
};
