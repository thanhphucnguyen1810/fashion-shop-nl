import React from 'react'

const InputField = ({ label, name, type = 'text', value, onChange, disabled = false, theme, required = true }) => (
  <div>
    <label style={{ color: theme.palette.text.primary }} className='block'>{label}</label>
    <input
      type={type}
      className='w-full p-2 rounded border border-gray-400'
      style={{
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.default
      }}
      name={name}
      value={value}
      required={required}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
)

export default React.memo(InputField)
