import React, { useEffect, useState } from 'react';
import { useActor } from '@xstate/react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';

import { UserEvent } from '../EventComponent/UserEvent.js';
import { BigTitle } from '../../frameworks/Title.js';

const drawerWidth = 240;

export const UserHome = ({ authService }) => {
  const [currentSection, setCurrentSection] = useState(0);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position='fixed'
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant='h6' noWrap component='div'>
            AtSys
          </Typography>
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
        {currentSection == 0 && <Dashboard authService={authService} />}
        {currentSection == 1 && <UserEvent authService={authService} />}
      </Box>
    </Box>
  );
};

const Dashboard = ({ authService }) => {
  const [user_state, user_send] = useActor(authService);

  return (
    <div>
      <BigTitle title={`Welcome Back, ${user_state.context.user.last_name}`} />
    </div>
  );
};
