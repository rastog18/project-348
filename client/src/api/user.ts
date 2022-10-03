import axios from 'axios'

type IdParam = { id: string }
type UserParam = { firstName: string; lastName?: string }

type UserData = { user: IUser }
type UsersData = { users: IUser[] }

const UserInstance = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/api/user`,
  timeout: 1000,
})

export const getUser = ({ id }: IdParam) => UserInstance.get<UserData>(`/${id}`)

export const getUsers = () => UserInstance.get<UsersData>('/')

export const createUser = ({ firstName, lastName }: UserParam) =>
  UserInstance.post<UserData>('/', {
    firstName,
    lastName,
  })

export const updateUser = ({ id, firstName, lastName }: UserParam & IdParam) =>
  UserInstance.patch<UserData>(`/${id}`, {
    firstName,
    lastName,
  })

export const deleteUser = ({ id }: IdParam) =>
  UserInstance.delete<UserData>(`/${id}`)
