// src/screens/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CategoryIcon from '@mui/icons-material/Category'; // For Genres
import MusicNoteIcon from '@mui/icons-material/MusicNote'; // For Audio
import Divider from '@mui/material/Divider';
import PolicyIcon from '@mui/icons-material/Policy'; // For Privacy Policy
import DescriptionIcon from '@mui/icons-material/Description'; // For Terms of Service

const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <List>
        <ListItem button component={Link} to="/genres">
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Genres" />
        </ListItem>
        <ListItem button component={Link} to="/audio">
          <ListItemIcon>
            <MusicNoteIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Audio" />
        </ListItem>
        <ListItem button component={Link} to="/audio-list">
          <ListItemIcon>
            <MusicNoteIcon />
          </ListItemIcon>
          <ListItemText primary="Edit Audio" />
        </ListItem>
        <ListItem button component={Link} to="/privacy"> {/* Add link */}
          <ListItemIcon>
            <PolicyIcon />
          </ListItemIcon>
          <ListItemText primary="Privacy Policy" />
        </ListItem>
        <ListItem button component={Link} to="/terms"> {/* Add link */}
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Terms of Service" />
        </ListItem>
     
        {/* Add more links as you add more features (e.g., Users, Reports) */}
      </List>
    </Box>
  );
};

export default Dashboard;