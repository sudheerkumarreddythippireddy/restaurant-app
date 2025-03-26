import './index.css'
import {AiOutlineShoppingCart} from 'react-icons/ai'

const Navbar = ({cartCount, restaurantName}) => (
  <nav className="nav-container">
    <h1 className="heading">{restaurantName}</h1>
    <div className="cart-container">
      <p className="orders">My Orders</p>
      <AiOutlineShoppingCart size={30} />
      <div className="count-container">
        <p className="count">{cartCount}</p>
      </div>
    </div>
  </nav>
)

export default Navbar
