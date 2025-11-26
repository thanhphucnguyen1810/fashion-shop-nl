import { useSearchParams } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const theme = useTheme()

  const handleSortChange = (e) => {
    const sortBy = e.target.value
    // searchParams chứa TẤT CẢ params hiện tại (bao gồm search và filters)
    searchParams.set('sortBy', sortBy)
    setSearchParams(searchParams) // Đặt lại params, kích hoạt CollectionPage fetch data
  }
  return (
    <div
      className="mb-6 flex items-center justify-end"
      style={{ color: theme.palette.text.primary }}
    >
      <select
        id="sort"
        onChange={handleSortChange}
        value={searchParams.get('sortBy') || ''}
        className="rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        style={{
          border: `1.5px solid ${theme.palette.grey[300]}`,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary
        }}
      >
        <option value="">Mặc định</option>
        <option value="priceAsc">Giá: Tăng dần</option>
        <option value="priceDesc">Giá: Giảm dần</option>
        <option value="nameAsc">Tên: A → Z</option>
        <option value="nameDesc">Tên: Z → A</option>
        <option value="popularity">Phổ biến</option>
      </select>
    </div>
  )
}

export default SortOptions
