import User from 'models/user.model'
import to from 'await-to-js'

/**
 * .lean() returns an object rather than the mongoose document
 * this makes queries faster, but you cannot modify the returned result
 *
 *
 */

export const getUsers = async (req, res) => {
  const [error, users] = await to(User.find({}).lean())
  if (error) return res.status(500).send({ error })

  return res.json({ users })
}

export const getUser = async (req, res) => {
  const { id } = req.params
  const [error, user] = await to(User.findById(id).lean())
  if (error) return res.status(500).send({ error })

  return res.json({ user })
}

export const createUser = async (req, res) => {
  const { firstName, lastName } = req.body
  if (!firstName) return res.status(400).send({ error: 'firstName required' })

  const [error, user] = await to(User.create({ firstName, lastName }))
  if (error) return res.status(500).send({ error })
  return res.json({ user })
}

export const updateUser = async (req, res) => {
  const { id } = req.params
  const { firstName, lastName } = req.body
  const [error, user] = await to(
    User.findByIdAndUpdate(
      id,
      { firstName, lastName },
      { returnDocument: 'after' }
    ).lean()
  )
  if (error) return res.status(500).send({ error })
  return res.json({ user })
}

export const deleteUser = async (req, res) => {
  const { id } = req.params
  const [error, user] = await to(User.findByIdAndDelete(id).lean())
  if (error) return res.status(500).send({ error })
  return res.json({ user })
}
