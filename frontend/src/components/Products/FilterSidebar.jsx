import { useState, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Radio,
  Checkbox,
  Slider,
  Button,
  Divider,
  Grid
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

// --- Color Mapping Utility ---
const getColorCode = (colorName) => {
  const lowerCaseName = colorName.toLowerCase()
  switch (lowerCaseName) {
  case 'đen':
    return '#000000'
  case 'trắng':
    return '#ffffff'
  case 'đỏ':
  case 'đỏ rượu':
  case 'đỏ burgundy':
    return '#800020'
  case 'xanh dương':
  case 'xanh navy':
    return '#000080'
  case 'xanh lá':
    return '#008000'
  case 'vàng':
    return '#ffc107'
  case 'vàng mustard':
  case 'vàng mù tạt':
    return '#ffdb58'
  case 'xám':
    return '#808080'
  case 'hồng':
  case 'hồng phấn':
    return '#ffc0cb'
  case 'nâu':
    return '#964b00'
  case 'be':
    return '#f5f5dc'
  case 'tím':
    return '#800080'
  case 'xanh mint':
    return '#3eb489'
  case 'xanh teal':
    return '#008080'
  case 'xanh rêu':
    return '#556b2f'
  default:
    return 'transparent'
  }
}

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const theme = useTheme()
  const location = useLocation()

  const MAX_PRICE_VALUE = 500 //500.000 VNĐ

  const [filters, setFilters] = useState({
    category: '',
    gender: '',
    color: '',
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 500
  })

  const [priceRange, setPriceRange] = useState([0, 500])

  // Dữ liệu bộ lọc
  const categories = [
    'Thời trang nam',
    'Thời trang nữ',
    'Thời Trang Trẻ Em',
    'Giày dép',
    'Phụ Kiện',
    'Sắc đẹp',
    'Khác'
  ]

  const colors = [
    'Vàng Mustard',
    'Đen',
    'Hồng Phấn',
    'Nâu',
    'Tím',
    'Vàng',
    'Xanh Navy',
    'Trắng',
    'Đỏ',
    'Xanh Mint',
    'Xám',
    'Xanh Lá',
    'Họa Tiết Đen Trắng',
    'Đỏ Burgundy',
    'Xanh Teal',
    'Be',
    'Xanh Rêu',
    'Vàng Mù Tạt',
    'Đỏ Rượu'
  ]

  const sizes = [
    'S',
    'M',
    'L',
    'XL',
    'XXL',
    'XS',
    'X',
    '29',
    '30',
    '31',
    '32',
    '34',
    '39',
    '40',
    '41',
    '42'
  ]

  const materials = [
    'Cotton Thấm Hút',
    'Len Mềm Mại',
    'Cotton',
    'Cotton Pha',
    'Denim Cotton Mềm',
    'Thun Gân Cotton Co Giãn',
    'Vải Cotton/Lụa Pha',
    'Voan/Cotton Mỏng',
    'Cotton Dệt Nổi',
    'Vải Lụa/Voan Mềm',
    'Vải Nỉ (Fleece)',
    'Vải Denim'
  ]

  const brands = [
    'ZENITH APPAREL',
    'Haint Boutique',
    'FASHION HUB',
    'RUSTIC WEAR',
    'URBAN CHIC',
    'LUXURY HANDBAGS (Ví dụ)',
    'OFFICE ELEGANCE'
  ]

  const genders = ['Nam', 'Nữ', 'Unisex']

  // --- Logic Hooks ---
  useEffect(() => {
    const params = Object.fromEntries([...searchParams])
    const maxP = Number(params.maxPrice) || 500
    setFilters({
      category: params.category || '',
      gender: params.gender || '',
      color: params.color || '',
      size: params.size ? params.size.split(',') : [],
      material: params.material ? params.material.split(',') : [],
      brand: params.brand ? params.brand.split(',') : [],
      minPrice: Number(params.minPrice) || 0,
      maxPrice: maxP
    })
    setPriceRange([0, maxP])
  }, [searchParams])

  // --- Event Handlers ---
  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams(searchParams)

    // 1. Xóa các filters cũ mà component này quản lý
    const filterKeys = Object.keys(filters)
    filterKeys.forEach((key) => params.delete(key))

    // 2. Thêm các filters mới
    filterKeys.forEach((key) => {
      const value = newFilters[key]

      // BỎ QUA 'collection' vì nó là route param
      if (key === 'collection') return

      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(','))
      } else if (key === 'maxPrice' && value !== 500) {
        params.set('maxPrice', value.toString())
      } else if (key === 'minPrice' && value !== 0) {
        params.set('minPrice', value.toString())
      } else if (
        !Array.isArray(value) &&
        value !== '' &&
        value !== false &&
        key !== 'minPrice' &&
        key !== 'maxPrice'
      ) {
        params.set(key, value.toString())
      }
    })

    const newCategory = newFilters.category
    const currentPath = location.pathname

    if (newCategory) {
      // Ví dụ: Nếu URL ban đầu là /collections/thoi-trang-nam
      // Và người dùng chọn Category, ta sẽ chuyển hướng đến /collections
      // hoặc giữ nguyên path nhưng chỉ dùng query params.

      const basePath = '/collections'
      const newUrl = `${basePath}?${params.toString()}`

      if (currentPath !== basePath) {
        window.history.replaceState({}, '', newUrl)
      }
      setSearchParams(params)

    } else {
      setSearchParams(params)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target
    let newFilters = { ...filters }

    if (type === 'checkbox') {
      newFilters[name] = checked
        ? [...(newFilters[name] || []), value]
        : newFilters[name].filter((item) => item !== value)
    } else if (type === 'radio') {
      const isCurrentlySelected = filters[name] === value
      newFilters[name] = isCurrentlySelected ? '' : value
    } else if (name === 'color') {
      const isSelected = filters.color === value
      newFilters.color = isSelected ? '' : value
    }

    setFilters(newFilters)
    updateURLParams(newFilters)
  }

  const handlePriceChange = (event, newValue) => {
    // newValue là một số (từ 0 đến MAX_PRICE_VALUE)
    const newFilters = { ...filters, minPrice: 0, maxPrice: newValue }
    setPriceRange([0, newValue])
    setFilters(newFilters)
    updateURLParams(newFilters)
  }

  const clearFilters = () => {
    const reset = {
      category: '',
      gender: '',
      color: '',
      size: [],
      material: [],
      brand: [],
      minPrice: 0,
      maxPrice: 500
    }
    setFilters(reset)
    setPriceRange([0, 500])

    // Xóa các params liên quan đến filter, giữ lại search và sortBy
    const currentSearchParams = new URLSearchParams(searchParams)
    const search = currentSearchParams.get('search')
    const sortBy = currentSearchParams.get('sortBy')

    const finalParams = new URLSearchParams()
    if (search) finalParams.set('search', search)
    if (sortBy) finalParams.set('sortBy', sortBy)

    setSearchParams(finalParams)
  }

  // Component chung cho Radio/Checkbox Group
  const FilterGroup = ({ title, items, name, type }) => {
    const isChecked = (value) => {
      if (type === 'radio') {
        return filters[name] === value
      } else {
        return filters[name]?.includes(value)
      }
    }

    return (
      <Accordion
        defaultExpanded={
          name === 'category' || name === 'gender' || name === 'price'
        }
        sx={{
          boxShadow: 'none',
          '&:before': { display: 'none' },
          border: 'none',
          '& .MuiAccordionSummary-root': {
            minHeight: '40px',
            padding: '0 8px'
          }
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: 0 }}>
          <Typography
            variant='subtitle1'
            fontWeight='medium'
            color='text.primary'
          >
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: '8px 8px 16px 8px' }}>
          <Grid container spacing={1}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} key={item}>
                <FormControlLabel
                  sx={{
                    marginRight: 0,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.875rem'
                    }
                  }}
                  control={
                    type === 'radio' ? (
                      <Radio
                        size='small'
                        name={name}
                        value={item}
                        checked={isChecked(item)}
                        onClick={handleFilterChange}
                        onChange={() => {}}
                        sx={{ p: '4px' }}
                      />
                    ) : (
                      <Checkbox
                        size='small'
                        name={name}
                        value={item}
                        checked={isChecked(item)}
                        onChange={handleFilterChange}
                        sx={{ p: '4px' }}
                      />
                    )
                  }
                  label={item}
                />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
        <Divider />
      </Accordion>
    )
  }

  // Component riêng cho Màu sắc
  const ColorFilterGroup = () => (
    <Accordion
      defaultExpanded
      sx={{
        boxShadow: 'none',
        '&:before': { display: 'none' },
        border: 'none',
        '& .MuiAccordionSummary-root': {
          minHeight: '40px',
          padding: '0 8px'
        }
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: 0 }}>
        <Typography variant='subtitle1' fontWeight='medium' color='text.primary'>
          Màu sắc
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: '8px 8px 16px 8px' }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5
          }}
        >
          {colors.map((color) => {
            const colorCode = getColorCode(color)
            const isSelected = filters.color === color
            const isComplex = colorCode === 'transparent'
            const isWhite = colorCode === '#ffffff'

            return (
              <Box
                key={color}
                onClick={() =>
                  handleFilterChange({
                    target: { name: 'color', value: color, type: 'text' }
                  })
                }
                title={color}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  backgroundColor: colorCode,
                  border: `1px solid ${
                    isWhite || isComplex
                      ? theme.palette.divider
                      : 'transparent'
                  }`,
                  boxShadow: isSelected
                    ? `0 0 0 3px ${theme.palette.primary.main}, 0 0 0 4px ${theme.palette.background.paper}`
                    : 'none',
                  position: 'relative',
                  ...(isComplex && {
                    backgroundImage: `linear-gradient(45deg, ${theme.palette.divider} 25%, transparent 25%), linear-gradient(-45deg, ${theme.palette.divider} 25%, transparent 25%), linear-gradient(135deg, transparent 75%, ${theme.palette.divider} 75%), linear-gradient(-135deg, transparent 75%, ${theme.palette.divider} 75%)`,
                    backgroundSize: '8px 8px',
                    backgroundColor: theme.palette.background.default
                  }),
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              />
            )
          })}
        </Box>
      </AccordionDetails>
      <Divider />
    </Accordion>
  )

  // Component riêng cho Khoảng giá
  const PriceFilterGroup = () => (
    <Accordion
      defaultExpanded
      sx={{
        boxShadow: 'none',
        '&:before': { display: 'none' },
        border: 'none',
        '& .MuiAccordionSummary-root': {
          minHeight: '40px',
          padding: '0 8px'
        }
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: 0 }}>
        <Typography variant='subtitle1' fontWeight='medium' color='text.primary'>
          Khoảng giá
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: '8px 16px 16px 16px' }}>
        <Slider
          size='small'
          value={priceRange[1]}
          min={0}
          max={MAX_PRICE_VALUE}
          step={10} // Bước nhảy 10.000 VNĐ
          onChange={handlePriceChange}
          aria-labelledby='price-range-slider'
          valueLabelDisplay='auto'
          valueLabelFormat={(value) => `₫${value}.000`}
          sx={{
            '& .MuiSlider-thumb': {
              height: 12,
              width: 12
            }
          }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 1
          }}
        >
          <Typography variant='body2' color='text.secondary'>
            0đ
          </Typography>
          <Typography
            variant='body2'
            fontWeight='medium'
            color='text.secondary'
          >
            Đến {priceRange[1].toLocaleString('en-US')}.000đ
          </Typography>
        </Box>
      </AccordionDetails>
      <Divider />
    </Accordion>
  )

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        height: '100%',
        minWidth: 250
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1
        }}
      >
        <Typography
          variant='h6'
          fontWeight='bold'
          color='text.primary'
          sx={{ textTransform: 'uppercase', fontSize: '1rem' }}
        >
          Bộ Lọc Tìm Kiếm
        </Typography>
      </Box>

      <Divider sx={{ mb: 1 }} />

      {/* Danh mục */}
      <FilterGroup
        title='Danh mục'
        items={categories}
        name='category'
        type='radio'
      />

      {/* Giới tính */}
      <FilterGroup
        title='Giới tính'
        items={genders}
        name='gender'
        type='radio'
      />

      {/* Màu sắc */}
      <ColorFilterGroup />

      {/* Kích cỡ */}
      <FilterGroup title='Kích cỡ' items={sizes} name='size' type='checkbox' />

      {/* Chất liệu */}
      <FilterGroup
        title='Chất liệu'
        items={materials}
        name='material'
        type='checkbox'
      />

      {/* Thương hiệu */}
      <FilterGroup
        title='Thương hiệu'
        items={brands}
        name='brand'
        type='checkbox'
      />

      {/* Khoảng giá */}
      <PriceFilterGroup />

      {/* Nút xóa bộ lọc */}
      <Box sx={{ p: '8px 8px 0 8px' }}>
        <Button
          fullWidth
          variant='outlined'
          color='primary'
          onClick={clearFilters}
          sx={{
            mt: 1,
            fontWeight: 'bold',
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.light + '10'
            }
          }}
        >
          Xóa tất cả bộ lọc
        </Button>
      </Box>
    </Box>
  )
}

export default FilterSidebar
