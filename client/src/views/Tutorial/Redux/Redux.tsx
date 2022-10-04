import { Container, Stack, TextField, Typography, styled } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Button from 'components/Button'
import { countSelector, decrement, increment } from 'store/slices/counterSlice'

import type { ChangeEvent } from 'react'

// "Extend" the custom button to override and apply new styles
const RoundButton = styled(Button)({
  width: '50px',
  height: '50px',
  borderRadius: '50%',
})

export default function Redux() {
  const dispatch = useDispatch()
  const count = useSelector(countSelector)
  const [amount, setAmount] = useState(1)

  const onIncrement = () => {
    dispatch(increment({ amount }))
  }

  const onDecrement = () => {
    dispatch(decrement({ amount }))
  }

  const onAmountChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // set amount equal to whatever is typed into the input field
    // if the value can't be parsed as a number, set amount to 0
    setAmount(parseInt(e.target.value) || 0)
  }

  return (
    <Container sx={{ py: 10 }}>
      <Typography variant="h5">Counter example using redux</Typography>
      <Typography variant="body1" sx={{ mt: 5 }}>
        Count: {count}
      </Typography>
      <Stack direction="row" alignItems="baseline" spacing={2} mt={3}>
        <RoundButton variant="contained" onClick={onIncrement}>
          +{amount}
        </RoundButton>
        <RoundButton variant="contained" onClick={onDecrement}>
          -{amount}
        </RoundButton>
        <TextField
          label="Set amount"
          value={amount}
          type="number"
          onChange={onAmountChange}
        />
      </Stack>
    </Container>
  )
}
