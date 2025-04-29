import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Grid, TextField,
  MenuItem, Button, CircularProgress, Paper, Divider, Table, TableHead,
  TableBody, TableRow, TableCell, Snackbar, Alert, IconButton, Avatar,
  Chip, Tabs, Tab
} from '@mui/material';
import { 
  BarChart, FilterList, Refresh, ShowChart, 
  TableChart, Assessment, Search, 
  People
} from '@mui/icons-material';
import to from 'await-to-js';
import axios from 'axios';
import { generateReport } from '../api/user';
import { useNavigate } from 'react-router-dom';

const ReportsPage = () => {
  const [dorms, setDorms] = useState([]);
  const [filters, setFilters] = useState({
    dorm: '',
    collegeYear: '',
    dobFrom: '',
    dobTo: ''
  });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  const [expandedUserId, setExpandedUserId] = useState(null);

  useEffect(() => {
    fetchDorms();
  }, []);
  const navigate = useNavigate();
  const fetchDorms = async () => {
    setLoading(true);
    const [error, res] = await to(axios.get('/api/dorms'));
    setLoading(false);
    if (!error && res.data.dorms) {
      setDorms(res.data.dorms);
      showNotification('Dorms loaded successfully');
    } else {
      showNotification('Failed to load dorms', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ open: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const generateReportHandler = async () => {
    setLoading(true);
    try {
      const [error, res] = await to(generateReport(filters));
      setLoading(false);
      
      if (error || !res?.data?.success) {
        showNotification(error?.message || 'Failed to generate report', 'error');
        return;
      }
      
      // Make sure to handle both cases where data might be in different places
      setUsers(res.data.users || []);
      setStats(res.data.stats || {
        total: 0,
        avgAge: 0,
        diningUserCount: 0,
        dormOccupancyPercent: 0
      });
      
      showNotification('Report generated successfully');
    } catch (err) {
      setLoading(false);
      showNotification('An error occurred', 'error');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getRandomColor = (id) => {
    const colors = ['#3f51b5', '#f44336', '#009688', '#ff9800', '#9c27b0', '#2196f3'];
    const hash = (id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const resetFilters = () => {
    setFilters({
      dorm: '',
      collegeYear: '',
      dobFrom: '',
      dobTo: ''
    });
    showNotification('Filters reset');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper elevation={0} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ 
          p: 3, 
          background: 'linear-gradient(45deg, #009688 30%, #26a69a 90%)',
          color: 'white'
        }}>
          <Typography variant="h4" fontWeight="bold">
            Reports Dashboard
          </Typography>
          <Typography variant="subtitle1">
            Filter users and view statistics across dorms and college years
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
          <Tab icon={<FilterList />} label="Filters" />
          <Tab icon={<Assessment />} label="Stats" disabled={!stats} />
          <Tab icon={<TableChart />} label="User Data" disabled={users.length === 0} />
          <Tab icon={<People />} label="User" onClick={() => navigate('/')} />

        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Tab 1: Filters */}
          {activeTab === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Report Filters</Typography>
                <Box>
                  <IconButton 
                    onClick={resetFilters} 
                    color="primary"
                    sx={{ 
                      mr: 1,
                      bgcolor: 'rgba(0, 150, 136, 0.1)', 
                      '&:hover': { bgcolor: 'rgba(0, 150, 136, 0.2)' } 
                    }}
                  >
                    <Refresh />
                  </IconButton>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={generateReportHandler} 
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ShowChart />}
                  >
                    Generate Report
                  </Button>
                </Box>
              </Box>

              <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Select Criteria
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Select Dorm"
                        name="dorm"
                        value={filters.dorm}
                        onChange={handleFilterChange}
                        variant="outlined"
                      >
                        <MenuItem value="">All Dorms</MenuItem>
                        {dorms.map((dorm) => (
                          <MenuItem key={dorm.id} value={dorm.name}>{dorm.name}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="College Year"
                        name="collegeYear"
                        value={filters.collegeYear}
                        onChange={handleFilterChange}
                        variant="outlined"
                      >
                        <MenuItem value="">All Years</MenuItem>
                        {['Freshman', 'Sophomore', 'Junior', 'Senior'].map((year) => (
                          <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="DOB From"
                        type="date"
                        name="dobFrom"
                        InputLabelProps={{ shrink: true }}
                        value={filters.dobFrom}
                        onChange={handleFilterChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="DOB To"
                        type="date"
                        name="dobTo"
                        InputLabelProps={{ shrink: true }}
                        value={filters.dobTo}
                        onChange={handleFilterChange}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {stats && (
                <Alert 
                  severity="success" 
                  sx={{ mb: 2 }}
                  action={
                    <Button 
                      color="inherit" 
                      size="small" 
                      onClick={() => setActiveTab(1)}
                    >
                      View Stats
                    </Button>
                  }
                >
                  Report generated with {users.length} users. Check the Stats tab for details.
                </Alert>
              )}

              {users.length > 0 && (
                <Alert 
                  severity="info" 
                  sx={{ mb: 2 }}
                  action={
                    <Button 
                      color="inherit" 
                      size="small" 
                      onClick={() => setActiveTab(2)}
                    >
                      View Data
                    </Button>
                  }
                >
                  View the full data table in the User Data tab.
                </Alert>
              )}
            </Box>
          )}

          {/* Tab 2: Stats */}
          {activeTab === 1 && stats && (
            <Box>
              <Typography variant="h6" gutterBottom>Summary Statistics</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card 
                    elevation={2} 
                    sx={{ 
                      borderRadius: 2, 
                      bgcolor: 'rgba(33, 150, 243, 0.1)',
                      height: '100%'
                    }}
                  >
                    <CardContent>
                      <Typography variant="overline" color="textSecondary">
                        Total Users
                      </Typography>
                      <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                        {stats.total}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card 
                    elevation={2} 
                    sx={{ 
                      borderRadius: 2, 
                      bgcolor: 'rgba(0, 150, 136, 0.1)',
                      height: '100%'
                    }}
                  >
                    <CardContent>
                      <Typography variant="overline" color="textSecondary">
                        Average Age
                      </Typography>
                      <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                        {stats.avgAge}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card 
                    elevation={2} 
                    sx={{ 
                      borderRadius: 2, 
                      bgcolor: 'rgba(156, 39, 176, 0.1)',
                      height: '100%'
                    }}
                  >
                    <CardContent>
                      <Typography variant="overline" color="textSecondary">
                        Dorm Occupancy
                      </Typography>
                      <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                        {stats.dormOccupancyPercent}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card 
                    elevation={2} 
                    sx={{ 
                      borderRadius: 2, 
                      bgcolor: 'rgba(255, 152, 0, 0.1)',
                      height: '100%'
                    }}
                  >
                    <CardContent>
                      <Typography variant="overline" color="textSecondary">
                        Dining Dorm Users
                      </Typography>
                      <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                        {stats.diningUserCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Card elevation={2} sx={{ borderRadius: 2, mt: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Applied Filters
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    <Chip 
                      label={filters.dorm ? `Dorm: ${filters.dorm}` : "All Dorms"} 
                      color="primary" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={filters.collegeYear ? `Year: ${filters.collegeYear}` : "All Years"} 
                      color="primary" 
                      variant="outlined" 
                    />
                    {filters.dobFrom && (
                      <Chip 
                        label={`From: ${filters.dobFrom}`} 
                        color="primary" 
                        variant="outlined" 
                      />
                    )}
                    {filters.dobTo && (
                      <Chip 
                        label={`To: ${filters.dobTo}`} 
                        color="primary" 
                        variant="outlined" 
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Tab 3: User Data */}
          {activeTab === 2 && users.length > 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">User Data ({users.length})</Typography>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search data..."
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />,
                  }}
                  sx={{ width: 200 }}
                />
              </Box>

              {/* Grid view of users */}
              <Grid container spacing={2} mb={3}>
                {users.slice(0, 6).map(user => {
                  const isExpanded = expandedUserId === user.puid;
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} key={user.puid}>
                      <Card 
                        elevation={2} 
                        onClick={() => setExpandedUserId(isExpanded ? null : user.puid)}
                        sx={{ 
                          borderRadius: 2, 
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'translateY(-4px)' },
                        }}
                      >
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Avatar 
                              sx={{ 
                                bgcolor: getRandomColor(user.puid),
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
                                PUID: {user.puid}
                              </Typography>
                            </Box>
                          </Box>

                          {isExpanded && (
                            <>
                              <Divider sx={{ my: 1 }} />
                              <Box mt={1} pl={1}>
                                <Typography variant="body2" gutterBottom>
                                  <strong style={{ fontWeight: 600 }}>DOB:</strong>{' '}
                                  {new Date(user.dob).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  <strong style={{ fontWeight: 600 }}>College Year:</strong> {user.collegeYear}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  <strong style={{ fontWeight: 600 }}>Dorm:</strong> {user.dormName}
                                </Typography>
                              </Box>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Full Data Table
              </Typography>

              <Paper sx={{ 
                width: '100%', 
                overflow: 'hidden',
                borderRadius: 2,
                boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.05)'
              }}>
                <Box sx={{ maxHeight: 440, overflow: 'auto' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Full Name</TableCell>
                        <TableCell>PUID</TableCell>
                        <TableCell>DOB</TableCell>
                        <TableCell>College Year</TableCell>
                        <TableCell>Dorm</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map(user => (
                        <TableRow 
                          key={user.puid}
                          hover
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                sx={{ 
                                  width: 28, 
                                  height: 28, 
                                  mr: 1,
                                  bgcolor: getRandomColor(user.puid),
                                  fontSize: '0.8rem'
                                }}
                              >
                                {getInitials(user.firstName, user.lastName)}
                              </Avatar>
                              {user.firstName} {user.lastName}
                            </Box>
                          </TableCell>
                          <TableCell>{user.puid}</TableCell>
                          <TableCell>{new Date(user.dob).toLocaleDateString()}</TableCell>
                          <TableCell>{user.collegeYear}</TableCell>
                          <TableCell>{user.dormName}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Paper>
            </Box>
          )}
        </Box>
      </Paper>

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
};

export default ReportsPage;