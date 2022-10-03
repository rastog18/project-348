declare global {
  type Empty = {}

  interface SignedUser {
    _id: string
  }

  type ErrorObject = {
    error: Error
  }
}

export {}
