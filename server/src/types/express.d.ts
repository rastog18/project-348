import type { IUserAuth } from './types'

declare global {
  namespace Express {
    interface User extends IUserAuth {}
  }
}
