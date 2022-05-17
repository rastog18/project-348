import User from 'models/user.model'
import to from 'await-to-js'
import type { TypedRequest, TypedResponse } from 'types/express'
import type { IUser } from 'types/types'

type Empty = {}

type UsersResponse = {
  users: IUser[]
}

type UserResponse = {
  user: IUser | null
}

type ErrorResponse = {
  error: Error
}

type Response<T> = TypedResponse<T | ErrorResponse>

/**
 * .lean() returns an object rather than the mongoose document
 * this makes queries faster, but you cannot modify the returned result
 *
 * use .exec() to make query return a promise to use with to()
 */

export const getUsers = async (
  req: TypedRequest<Empty, Empty, Empty>,
  res: Response<UsersResponse>
) => {
  const [error, users] = await to(User.find({}).lean().exec())
  if (error) return res.status(500).send({ error })

  return res.json({ users })
}

export const getUser = async (
  req: TypedRequest<Empty, { id: string }, Empty>,
  res: Response<UserResponse>
) => {
  const { id } = req.params
  const [error, user] = await to(User.findById(id).lean().exec())
  if (error) return res.status(500).send({ error })

  return res.json({ user })
}

export const createUser = async (
  req: TypedRequest<Empty, Empty, Pick<IUser, 'firstName' | 'lastName'>>,
  res: Response<UserResponse>
) => {
  const { firstName, lastName } = req.body
  if (!firstName)
    return res.status(400).send({ error: new Error('firstName required') })

  const [error, user] = await to(User.create({ firstName, lastName }))
  if (error) return res.status(500).send({ error })
  return res.json({ user })
}

export const updateUser = async (
  req: TypedRequest<
    Empty,
    { id: string },
    Pick<IUser, 'firstName' | 'lastName'>
  >,
  res: Response<UserResponse>
) => {
  const { id } = req.params
  const { firstName, lastName } = req.body
  const [error, user] = await to(
    User.findByIdAndUpdate(
      id,
      { firstName, lastName },
      { returnDocument: 'after' }
    )
      .lean()
      .exec()
  )
  if (error) return res.status(500).send({ error })
  return res.json({ user })
}

export const deleteUser = async (
  req: TypedRequest<Empty, { id: string }, Empty>,
  res: Response<UserResponse>
) => {
  const { id } = req.params
  const [error, user] = await to(User.findByIdAndDelete(id).lean().exec())
  if (error) return res.status(500).send({ error })
  return res.json({ user })
}
