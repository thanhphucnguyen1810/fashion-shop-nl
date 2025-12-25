import { useTheme } from '@mui/material/styles'

const AuthHeader = ({ title, subtitle }) => {
  const theme = useTheme()
  return (
    <div className='text-center mb-6'>
      <h2
        className='text-3xl font-extrabold tracking-wider mb-2'
        style={{ color: theme.palette.primary.main }}
      >
        TheAurora
      </h2>
      {title && (
        <h2 className='text-xl font-bold' style={{ color: theme.palette.text.primary }}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className='mt-2 text-sm opacity-80' style={{ color: theme.palette.text.secondary }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default AuthHeader
