import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';

import { UserEvent } from '../EventComponent/index.js';
import { BigTitle } from '../../frameworks/Typography.js';

const drawerWidth = 240;

export const Home = ({ authService, user }) => {
  const [currentSection, setCurrentSection] = useState(0);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position='fixed'
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <BigTitle title='AtSys' weight='500' />
        </Toolbar>
      </AppBar>
      <Drawer
        variant='permanent'
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {['Dashboard', 'Event'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => setCurrentSection(index)}>
                  <ListItemIcon>
                    {index === 0 && <DashboardIcon />}
                    {index === 1 && <EventIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {currentSection == 0 && (
          <Dashboard authService={authService} user={user} />
        )}
        {currentSection == 1 && (
          <UserEvent authService={authService} user={user} />
        )}
      </Box>
    </Box>
  );
};

const Dashboard = ({ authService, user }) => {
  return (
    <div>
      <BigTitle title={`Welcome Back, ${user.getFullName()}`} />
    </div>
  );
};
