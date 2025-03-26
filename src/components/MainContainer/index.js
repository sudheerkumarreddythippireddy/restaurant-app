import {useEffect, useState} from 'react'
import Loader from 'react-loader-spinner'
import Navbar from '../Navbar'
import './index.css'

const MainContainer = () => {
  const [menuData, setMenuData] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details',
        )
        const data = await response.json()
        const restaurant = data[0]
        const menuCategories = restaurant.table_menu_list.map(category => ({
          menuCategory: category.menu_category,
          menuCategoryImage: category.manu_category_image,
          categoryId: category.menu_category_id,
          dishes: category.category_dishes.map(dish => ({
            dishId: dish.dish_id,
            name: dish.dish_name,
            price: dish.dish_price,
            image: dish.dish_image,
            currency: dish.dish_currency,
            calories: dish.dish_calories,
            description: dish.dish_description,
            addOnCat: dish.addonCat,
            dishType: dish.dish_Type,
            dishAvailability: dish.dish_Availability,
          })),
        }))
        setMenuData({restaurant, menuCategories})
        setSelectedCategory(menuCategories[0])
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleIncrement = dishId => {
    setCart(prevCart => ({
      ...prevCart,
      [dishId]: (prevCart[dishId] || 0) + 1,
    }))
  }

  const handleDecrement = dishId => {
    setCart(prevCart => {
      if (!prevCart[dishId] || prevCart[dishId] === 0) return prevCart // Prevent decrementing below 0
      const updatedCart = {...prevCart, [dishId]: prevCart[dishId] - 1}
      if (updatedCart[dishId] <= 0) {
        delete updatedCart[dishId]
      }
      return updatedCart
    })
  }

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0)

  if (loading) {
    return (
      <div className="loader-container">
        <Loader type="TailSpin" color="#00BFFF" height={80} width={80} />
      </div>
    )
  }

  return (
    <div>
      <Navbar
        cartCount={cartCount}
        restaurantName={menuData.restaurant.restaurant_name}
      />

      <div className="main-container">
        <ul className="category-slide">
          {menuData.menuCategories.map(category => (
            <li
              className="category-item"
              key={category.categoryId}
              onClick={() => setSelectedCategory(category)}
            >
              <button
                type="button"
                className={`menu-button ${
                  selectedCategory?.categoryId === category.categoryId
                    ? 'active-category'
                    : 'no-active'
                }`}
              >
                {category.menuCategory}
              </button>
            </li>
          ))}
        </ul>
        <ul className="dishes-container">
          {selectedCategory?.dishes.map(dish => (
            <li className="dish-card" key={dish.dishId}>
              <div className="first-container">
                {dish.dishType === 2 ? (
                  <div className="green-container">
                    <div className="green"></div>
                  </div>
                ) : (
                  <div className="red-container">
                    <div className="red"></div>
                  </div>
                )}
                <div className="details-container">
                  <h1 className="dish-name">{dish.name}</h1>
                  <span className="dish-price">
                    {dish.currency} {dish.price}
                  </span>
                  <span className="dish-description">{dish.description}</span>
                  {dish.dishAvailability ? (
                    <div className="add-container">
                      <button
                        className="pieces"
                        type="button"
                        onClick={() => handleDecrement(dish.dishId)}
                      >
                        -
                      </button>
                      <p>{cart[dish.dishId] || 0}</p>
                      <button
                        className="pieces"
                        type="button"
                        onClick={() => handleIncrement(dish.dishId)}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <p>Not Available</p>
                  )}
                  {dish.addOnCat.length > 0 && (
                    <p className="custom">Customizations available</p>
                  )}
                </div>
              </div>
              <div className="second-container">
                <div className="calories-container">
                  <p className="calories">{dish.calories} Calories</p>
                </div>
                <div className="image-container">
                  <img
                    className="dish-image"
                    src={dish.image}
                    alt={dish.name}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default MainContainer
