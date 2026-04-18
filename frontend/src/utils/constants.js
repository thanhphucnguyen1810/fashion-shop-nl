
let apiRoot = ''
if (import.meta.env.MODE === 'development') {
  apiRoot = 'http://localhost:8000'
}
if (import.meta.env.MODE === 'production') {
  apiRoot = 'https://fashion-shop-nl.onrender.com'
}
export const API_ROOT = apiRoot
