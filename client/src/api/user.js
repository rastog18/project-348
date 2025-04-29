import axios from 'axios'

const UserClient = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api/user`,
  timeout: 1000,
})

// Get a single user by ID
export const getUser = ({ id }) => UserClient.get(`/${id}`)

// Get all users
export const getUsers = () => UserClient.get()

// Create a new user
export const createUser = ({ firstName, lastName, puid, dormName, dob, collegeYear }) =>
  UserClient.post('/', {
    firstName,
    lastName,
    puid,
    dormName,
    dob,
    collegeYear,
  })

// Update an existing user
export const updateUser = ({ id, firstName, lastName, puid, dormName, dob, collegeYear }) =>
  UserClient.patch(`/${id}`, {
    firstName,
    lastName,
    puid,
    dormName,
    dob,
    collegeYear,
  })

// Delete a user
export const deleteUser = ({ id }) => UserClient.delete(`/${id}`)

// Correct: Hit /report for report generation
export const generateReport = (filters) => UserClient.post('/report', filters)

