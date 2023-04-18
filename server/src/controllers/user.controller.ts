import to from 'await-to-js'

import User from '@/models/user.model'

import type { Request, Response } from 'express'
import type { IUser } from '@/types/types'

/**
 * .lean() returns an object rather than the mongoose document
 * this makes queries faster, but you cannot modify the returned result
 *
 * use .exec() to make query return a promise to use with to()
 */

export const getUsers = async (req: Request, res: Response) => {
  const [error, users] = await to(User.find({}).lean().exec())
  if (error) return res.status(500).send({ error })

  return res.json({ users })
}

export const getUser = async (
  req: Request<{ id: string }, Empty, Empty>,
  res: Response
) => {
  const { id } = req.params
  const [error, user] = await to(User.findById(id).lean().exec())
  if (error) return res.status(500).send({ error })

  return res.json({ user })
}

export const createUser = async (
  req: Request<Empty, Empty, Pick<IUser, 'firstName' | 'lastName'>>,
  res: Response
) => {
  const { firstName, lastName } = req.body
  if (!firstName) return res.status(400).send({ error: 'firstName required' })

  const [error, user] = await to(User.create({ firstName, lastName }))
  if (error) return res.status(500).send({ error })
  return res.json({ user })
}

export const updateUser = async (
  req: Request<{ id: string }, Empty, Pick<IUser, 'firstName' | 'lastName'>>,
  res: Response
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
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params
  const [error, user] = await to(User.findByIdAndDelete(id).lean().exec())
  if (error) return res.status(500).send({ error })
  return res.json({ user })
}
