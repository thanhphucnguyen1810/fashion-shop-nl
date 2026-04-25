import { Link, useLocation } from 'react-router-dom'

const ShipperSidebar = () => {
  const { pathname } = useLocation()

  const menu = [
    { name: 'Dashboard', path: '/shipper' },
    { name: 'Đơn hàng', path: '/shipper/orders' }
  ]

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Shipper</h2>

      <ul className="space-y-2">
        {menu.map(item => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block px-3 py-2 rounded ${
                pathname === item.path
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ShipperSidebar
