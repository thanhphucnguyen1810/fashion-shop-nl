import React from 'react'

const InputField = ({ id, label, type, name, value, onChange, placeholder, Icon, theme }) => {
  return (
    <div className='mb-5'>
      <label htmlFor={id} className='block text-sm font-semibold mb-2' style={{ color: theme.palette.text.secondary }}>
        {label}
      </label>
      <div className='relative'>
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className='w-full p-3 pl-10 border-2 rounded-xl transition duration-300 focus:border-opacity-100'
          placeholder={placeholder}
          style={{
            backgroundColor: theme.palette.background.default,
            borderColor: theme.palette.divider,
            color: theme.palette.text.primary,
            borderOpacity: 0.5
          }}
          onFocus={(e) => {
            e.target.style.borderColor = theme.palette.primary.main
            e.target.style.boxShadow = `0 0 0 2px ${theme.palette.primary.main}30`
          }}
          onBlur={(e) => {
            e.target.style.borderColor = theme.palette.divider
            e.target.style.boxShadow = 'none'
          }}
        />
        {/* Sử dụng Icon component của MUI */}
        <Icon sx={{ fontSize: 20 }} className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" style={{ color: theme.palette.text.secondary }} />
      </div>
    </div>
  )
}


export default React.memo(InputField)
