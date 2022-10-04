import { ButtonBase, styled } from '@mui/material'

import type { ButtonProps } from '@mui/material'
import type { FC } from 'react'

const CustomButton = styled(ButtonBase)({
  padding: '12px 16px',
  borderRadius: '20px',
  backgroundColor: '#93da93',
  transition: 'transform 100ms ease',

  '&:hover': {
    backgroundColor: '#a2e1a2',
  },

  '&:active': {
    transform: 'scale(0.96)',
  },
})

const Button: FC<ButtonProps> = ({ children, ...props }) => (
  <CustomButton {...props}>{children}</CustomButton>
)

export default Button
