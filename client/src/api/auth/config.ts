import { injectSetToken, injectStore } from '.'

import type { ActionCreatorWithPayload, Store } from '@reduxjs/toolkit'

export const inject = (
  store: Store,
  setToken: ActionCreatorWithPayload<{ token: string }>
) => {
  injectStore(store)
  injectSetToken(setToken)
}
