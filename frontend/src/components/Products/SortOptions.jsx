import { useSearchParams } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { FaSortAmountDown } from 'react-icons/fa'

const SORT_OPTIONS = [
  { value: '', label: 'Mặc định' },
  { value: 'priceAsc', label: 'Giá: Thấp → Cao' },
  { value: 'priceDesc', label: 'Giá: Cao → Thấp' },
  { value: 'nameAsc', label: 'Tên: A → Z' },
  { value: 'nameDesc', label: 'Tên: Z → A' },
  { value: 'popularity', label: 'Phổ biến nhất' }
]

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const theme = useTheme()
  const current = searchParams.get('sortBy') || ''

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams)
    if (e.target.value) {
      params.set('sortBy', e.target.value)
    } else {
      params.delete('sortBy')
    }
    setSearchParams(params)
  }

  return (
    <div className="flex items-center gap-2">
      <FaSortAmountDown className="text-gray-400 w-4 h-4" />
      <select
        onChange={handleSortChange}
        value={current}
        className="rounded-lg px-3 py-2 text-sm font-medium shadow-sm hover:shadow transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        style={{
          border: `1.5px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary
        }}
      >
        {SORT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

export default SortOptions
