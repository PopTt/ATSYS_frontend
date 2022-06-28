import React, { useEffect, useState } from 'react';
import { useActor } from '@xstate/react';
import {
  Box,
  Button,
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
import AccountIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

import { UserEvent } from '../EventComponent/index.js';
import { InstructorManagement } from '../AdminComponent/Instructor.js';
import * as PermissionChecker from '../../helpers/permission.js';
import { BigTitle } from '../../frameworks/Typography.js';

const drawerWidth = 240;

export const Home = ({ authService, user }) => {
  const [sections, setSections] = useState(['Dashboard', 'Event']);
  const [currentSection, setCurrentSection] = useState(0);

  const adminPermission = PermissionChecker.AdminLevelPermission(
    user.permission_type
  );

  useEffect(() => {
    if (adminPermission) setSections(['Dashboard', 'Event', 'Instructors']);
  }, [user]);

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
            {sections.map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => setCurrentSection(index)}>
                  <ListItemIcon>
                    {index === 0 && <DashboardIcon />}
                    {index === 1 && <EventIcon />}
                    {index === 2 && <AccountIcon />}
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
          <UserEvent
            authService={authService}
            user={user}
            adminPermission={adminPermission}
          />
        )}
        {adminPermission && currentSection == 2 && (
          <InstructorManagement
            authService={authService}
            user={user}
            adminPermission={adminPermission}
          />
        )}
      </Box>
    </Box>
  );
};

const Dashboard = ({ authService, user }) => {
  const [_, send] = useActor(authService);

  return (
    <div>
      <BigTitle title={`Welcome Back, ${user.getFullName()}`} />
      <br />
      <Button
        variant='contained'
        onClick={() => {
          send({ type: 'LOGOUT' });
        }}
      >
        Logout
      </Button>
    </div>
  );
};
