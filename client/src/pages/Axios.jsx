import React, { useEffect, useState } from 'react';
import {
  Box, Container, TextField, Typography, Card, CardContent,
  Divider, Grid, Avatar, List, ListItem, ListItemAvatar, 
  ListItemText, Paper, Tabs, Tab, IconButton, Chip, Alert,
  Snackbar
} from '@mui/material';
import { 
  Person, PersonAdd, Edit, Delete, Refresh, 
  Search, Save, Cancel,
  Assessment
} from '@mui/icons-material';
import { deleteUser, getUser, getUsers, updateUser, createUser } from '../api/user';
import to from 'await-to-js';
import { useNavigate } from 'react-router-dom';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState('');
  const [deleteUserId, setDeleteUserId] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState(null);


  useEffect(() => {
    getAllUsers();
  }, []);

  const navigate = useNavigate();

  const showNotification = (message, type = 'success') => {
    setNotification({ open: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getAllUsers = async () => {
    setLoading(true);
    const [error, res] = await to(getUsers());
    setLoading(false);
    
    if (error) {
      showNotification('Failed to fetch users', 'error');
      return;
    }
    
    const { data } = res;
    if (data.users) setUsers(data.users);
    showNotification('User list refreshed successfully');
  };

  const onUserIdChange = (e) => {
    setUserId(e.target.value.trim());
  };

  const onUserFind = async () => {
    if (!userId) {
      showNotification('Please enter a user ID', 'warning');
      return;
    }
    
    setLoading(true);
    const [error, res] = await to(getUser({ id: userId }));
    setLoading(false);
    
    if (error) {
      setUser(null);
      showNotification('User not found', 'error');
      return;
    }
    
    const { data } = res;
    if (data.user) {
      setUser(data.user);
      showNotification('User found');
    }
  };

  const onUserDelete = async () => {
    if (!deleteUserId) {
      showNotification('Please enter a user ID to delete', 'warning');
      return;
    }
    
    setLoading(true);
    const [error] = await to(deleteUser({ id: deleteUserId }));
    setLoading(false);
    
    if (error) {
      showNotification('Failed to delete user', 'error');
      return;
    }
    
    setDeleteUserId('');
    getAllUsers();
    showNotification('User deleted successfully');
  };

  const onCreateUser = async (e) => {
    e.preventDefault();
    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();
  
    // 🆕 Add support for new fields (if they exist in the form)
    const puid = e.target.puid?.value.trim();
    const dormName = e.target.dormName?.value.trim();
    const dob = e.target.dob?.value;
    const collegeYear = e.target.collegeYear?.value.trim();
  
    if (!firstName) {
      showNotification('First name is required', 'warning');
      return;
    }
  
    setLoading(true);
    const [error] = await to(
      createUser({ firstName, lastName, puid, dormName, dob, collegeYear })
    );
    setLoading(false);
  
    if (error) {
      showNotification('Failed to create user', 'error');
      return;
    }
  
    e.target.reset();
    getAllUsers();
    showNotification('User created successfully');
  };
  

  const onUpdateUser = async (e) => {
    e.preventDefault();
    const id = e.target.id.value.trim();
    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();
  
    // 🆕 Grab additional fields (optional if present in DOM)
    const puid = e.target.puid?.value.trim();
    const dormName = e.target.dormName?.value.trim();
    const dob = e.target.dob?.value;
    const collegeYear = e.target.collegeYear?.value.trim();
  
    if (!id) {
      showNotification('User ID is required', 'warning');
      return;
    }
  
    setLoading(true);
    const [error] = await to(
      updateUser({ id, firstName, lastName, puid, dormName, dob, collegeYear })
    );
    setLoading(false);
  
    if (error) {
      showNotification('Failed to update user', 'error');
      return;
    }
  
    e.target.reset();
    getAllUsers();
    showNotification('User updated successfully');
  };
  

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getRandomColor = (id) => {
    const colors = ['#3f51b5', '#f44336', '#009688', '#ff9800', '#9c27b0', '#2196f3'];
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper elevation={0} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ 
          p: 3, 
          background: 'linear-gradient(45deg, #2196F3 30%, #3f51b5 90%)',
          color: 'white'
        }}>
          <Typography variant="h4" fontWeight="bold">
            User Management Portal
          </Typography>
          <Typography variant="subtitle1">
            Create, read, update and delete user information
          </Typography>
        </Box>
        
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<Person />} label="Users" />
          <Tab icon={<Search />} label="Find" />
          <Tab icon={<PersonAdd />} label="Create" />
          <Tab icon={<Edit />} label="Update" />
          <Tab icon={<Delete />} label="Delete" />
          <Tab icon={<Assessment />} label="Reports" onClick={() => navigate('/reports')} />


        </Tabs>
      
        <Box sx={{ p: 3 }}>
          {/* Tab 1: All Users */}
          {activeTab === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">All Users</Typography>
                <IconButton 
                  onClick={getAllUsers} 
                  color="primary"
                  disabled={loading}
                  sx={{ 
                    bgcolor: 'rgba(33, 150, 243, 0.1)', 
                    '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.2)' } 
                  }}
                >
                  <Refresh />
                </IconButton>
              </Box>
              
              {users.length ? (
                <Grid container spacing={2}>
                  {users.map((user) => {
                  const isExpanded = expandedUserId === user._id;

                  return (
                    <Grid item xs={12} sm={6} md={4} key={user._id}>
                      <Card 
                        elevation={2} 
                        onClick={() => setExpandedUserId(isExpanded ? null : user._id)}
                        sx={{ 
                          borderRadius: 2, 
                          cursor: 'pointer',
                          transition: 'transform 0.2s, max-height 0.3s ease',
                          '&:hover': { transform: 'translateY(-4px)' },
                        }}
                      >
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Avatar 
                              sx={{ 
                                bgcolor: getRandomColor(user._id),
                                width: 50,
                                height: 50,
                                mr: 2
                              }}
                            >
                              {getInitials(user.firstName, user.lastName)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6">
                                {user.firstName} {user.lastName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {user._id}
                              </Typography>
                            </Box>
                          </Box>

                          {isExpanded && (
                          <>
                            <Divider sx={{ my: 1 }} />
                            <Box mt={1} pl={1}>
                              {user.puid && (
                                <Typography variant="body2" gutterBottom>
                                  <strong style={{ fontWeight: 600 }}>PUID:</strong> {user.puid}
                                </Typography>
                              )}
                              {user.dormName && (
                                <Typography variant="body2" gutterBottom>
                                  <strong style={{ fontWeight: 600 }}>Dorm:</strong> {user.dormName}
                                </Typography>
                              )}
                              {user.dob && (
                                <Typography variant="body2" gutterBottom>
                                  <strong style={{ fontWeight: 600 }}>DOB:</strong>{' '}
                                  {new Date(user.dob).toLocaleDateString()}
                                </Typography>
                              )}
                              {user.collegeYear && (
                                <Typography variant="body2" gutterBottom>
                                  <strong style={{ fontWeight: 600 }}>College Year:</strong> {user.collegeYear}
                                </Typography>
                              )}
                            </Box>
                          </>
                        )}

                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}

                </Grid>
              ) : (
                <Alert severity="info">No users available. Create one to get started.</Alert>
              )}
            </Box>
          )}

          {/* Tab 2: Search User */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Find a User by ID</Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  mb: 3
                }}
              >
                <TextField
                  label="User ID"
                  value={userId}
                  onChange={onUserIdChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={onUserFind}
                        disabled={loading || !userId}
                        color="primary"
                        edge="end"
                      >
                        <Search />
                      </IconButton>
                    ),
                  }}
                />
              </Box>
              
              {user && (
                <Card elevation={3} sx={{ borderRadius: 2, mb: 2 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <Avatar 
                        sx={{ 
                          bgcolor: getRandomColor(user._id),
                          width: 60,
                          height: 60,
                          mr: 3
                        }}
                      >
                        {getInitials(user.firstName, user.lastName)}
                      </Avatar>
                      <Box>
                        <Typography variant="h5">
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Chip 
                          label={`ID: ${user._id}`} 
                          size="small" 
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}
              
              {userId && !user && (
                <Alert severity="warning">No user found with this ID</Alert>
              )}
            </Box>
          )}

          {/* Tab 3: Create User */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>Create New User</Typography>
              <form onSubmit={onCreateUser}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="First Name" 
                      name="firstName" 
                      required 
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="Last Name" 
                      name="lastName" 
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="PUID" 
                      name="puid" 
                      required 
                      fullWidth 
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="Dorm Name" 
                      name="dormName" 
                      fullWidth 
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="Date of Birth" 
                      name="dob" 
                      type="date" 
                      fullWidth 
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="College Year" 
                      name="collegeYear" 
                      fullWidth 
                      variant="outlined"
                      placeholder="Freshman, Sophomore, Junior..."
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end">
                      <IconButton 
                        type="submit" 
                        disabled={loading}
                        color="primary"
                        sx={{ 
                          bgcolor: 'rgba(33, 150, 243, 0.1)', 
                          '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.2)' } 
                        }}
                      >
                        <PersonAdd />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Box>
          )}

          {/* Tab 4: Update User */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>Update Existing User</Typography>
              <form onSubmit={onUpdateUser}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField 
                      label="User ID" 
                      name="id" 
                      required 
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="New First Name" 
                      name="firstName" 
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="New Last Name" 
                      name="lastName" 
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="PUID" 
                      name="puid" 
                      required 
                      fullWidth 
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="Dorm Name" 
                      name="dormName" 
                      fullWidth 
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="Date of Birth" 
                      name="dob" 
                      type="date" 
                      fullWidth 
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="College Year" 
                      name="collegeYear" 
                      fullWidth 
                      variant="outlined"
                      placeholder="Freshman, Sophomore, Junior..."
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end">
                      <IconButton 
                        type="submit" 
                        disabled={loading}
                        color="primary"
                        sx={{ 
                          bgcolor: 'rgba(33, 150, 243, 0.1)', 
                          '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.2)' }
                        }}
                      >
                        <Save />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Box>
          )}

          {/* Tab 5: Delete User */}
          {activeTab === 4 && (
            <Box>
              <Typography variant="h6" gutterBottom>Delete a User</Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2
                }}
              >
                <TextField
                  label="User ID to Delete"
                  value={deleteUserId}
                  onChange={(e) => setDeleteUserId(e.target.value.trim())}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={onUserDelete}
                        disabled={loading || !deleteUserId}
                        color="error"
                        edge="end"
                      >
                        <Delete />
                      </IconButton>
                    ),
                  }}
                />
              </Box>
              <Alert severity="warning" sx={{ mt: 2 }}>
                Warning: This action cannot be undone. The user will be permanently deleted.
              </Alert>
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={closeNotification} 
          severity={notification.type} 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}