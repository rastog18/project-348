import axios from 'axios'

type IdParam = { id: string }
type UserParam = { firstName: string; lastName?: string }

type UserData = { user: IUser }
type UsersData = { users: IUser[] }

const UserClient = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/api/user`,
  timeout: 1000,
})

export const getUser = ({ id }: IdParam) => UserClient.get<UserData>(`/${id}`)

export const getUsers = () => UserClient.get<UsersData>('/')

export const createUser = ({ firstName, lastName }: UserParam) =>
  UserClient.post<UserData>('/', {
    firstName,
    lastName,
  })

export const updateUser = ({ id, firstName, lastName }: UserParam & IdParam) =>
  UserClient.patch<UserData>(`/${id}`, {
    firstName,
    lastName,
  })

export const deleteUser = ({ id }: IdParam) =>
  UserClient.delete<UserData>(`/${id}`)
