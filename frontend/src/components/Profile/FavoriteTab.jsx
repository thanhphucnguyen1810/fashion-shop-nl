import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import FavoriteCard from '~/components/Profile/FavoriteCard'

import { removeFavorite } from '~/redux/slices/authSlice'

const FavoriteTab = ({ theme }) => {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const favorites = user?.favorites || []

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])


  const handleRemoveFavorite = (productId) => {
    dispatch(removeFavorite(productId))
    toast.info('Đã xóa sản phẩm khỏi danh sách yêu thích.', { duration: 1000 })
  }
  return (
    <>
      <div className='p-6'>
        <h2 className='text-2xl font-semibold mb-4 border-b pb-3' style={{ color: theme.palette.text.primary, borderColor: theme.palette.divider }}>Sản phẩm yêu thích</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {favorites.length > 0 ? (
            favorites.map((product) => <FavoriteCard key={product._id} product={product} theme={theme} onRemoveFavorite={handleRemoveFavorite} />)
          ) : (
            <p style={{ color: theme.palette.text.secondary }}>Bạn chưa có sản phẩm yêu thích nào. Hãy đi khám phá!</p>
          )}
        </div>
      </div>
    </>
  )
}

export default FavoriteTab
