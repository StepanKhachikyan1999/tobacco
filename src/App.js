import React, { useState, useEffect } from 'react';
import { tobaccoData } from './data';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import './App.css';

function App() {
  const [cart, setCart] = useState({}); 
  const [expandedCats, setExpandedCats] = useState({});

  useEffect(() => {
    const savedCart = localStorage.getItem('tobaccoCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tobaccoCart', JSON.stringify(cart));
  }, [cart]);

  const handleQuantityChange = (id, value) => {
    const quantity = parseInt(value, 10);
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (isNaN(quantity) || quantity <= 0) {
        delete newCart[id];
      } else {
        newCart[id] = quantity;
      }
      return newCart;
    });
  };

  const toggleCategory = (id) => {
    setExpandedCats((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    tobaccoData.forEach((category) => {
      category.products.forEach((product) => {
        if (cart[product.id]) {
          total += product.price * cart[product.id];
        }
      });
    });
    return total;
  };

  const calculateTotalItems = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }

  const getCartItemsArray = () => {
    const items = [];
    tobaccoData.forEach((category) => {
      category.products.forEach((product) => {
        if (cart[product.id]) {
          items.push({
             ...product, 
             quantity: cart[product.id],
             subtotal: product.price * cart[product.id]
          });
        }
      });
    });
    return items;
  }

  return (
    <div className="app-container">
       <div className="glass-bg"></div>
       <header className="app-header">
           <div className="header-content">
             <h1>Premium Tobacco Inventory</h1>
             <p>Manage your store purchases efficiently</p>
           </div>
       </header>
       
       <main className="app-main">
          <section className="catalog-section">
              <div className="section-header">
                 <h2>Brands & Categories</h2>
              </div>
              <div className="accordion-list">
                 {tobaccoData.map((category) => (
                    <div key={category.id} className={`accordion-item ${expandedCats[category.id] ? 'expanded' : ''}`}>
                       <div className="accordion-header" onClick={() => toggleCategory(category.id)}>
                           <h3>{category.name} 
                              <span className="item-count">({category.products.length} items)</span>
                           </h3>
                           <span className="accordion-icon">{expandedCats[category.id] ? '−' : '+'}</span>
                       </div>
                       
                       {expandedCats[category.id] && (
                         <div className="accordion-content">
                            <div className="product-list">
                               <PhotoProvider>
                                 {category.products.map((product) => (
                                    <div key={product.id} className={`product-row ${cart[product.id] ? 'selected' : ''}`}>
                                       <div className="product-info">
                                          <PhotoView src={product.image}>
                                             <img 
                                               src={product.image} 
                                               alt={product.name} 
                                               className="product-image" 
                                               style={{ cursor: 'zoom-in' }} 
                                             />
                                          </PhotoView>
                                          <div className="product-details">
                                             <span className="product-name">
                                                {product.name} {product.mark && product.mark !== product.name ? ` (${product.mark})` : ''}
                                             </span>
                                             <span className="product-price">{product.price.toLocaleString()} ֏</span>
                                          </div>
                                       </div>
                                       <div className="quantity-control">
                                           <label htmlFor={`qty-${product.id}`}>Qty:</label>
                                           <input 
                                              id={`qty-${product.id}`}
                                              type="number" 
                                              min="0" 
                                              value={cart[product.id] || ''} 
                                              placeholder="0"
                                              onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                           />
                                       </div>
                                    </div>
                                 ))}
                               </PhotoProvider>
                            </div>
                         </div>
                       )}
                    </div>
                 ))}
              </div>
          </section>

          <aside className="cart-section">
              <div className="cart-sticky-container glass-panel">
                 <h2>To-Buy List <span className="cart-badge">{calculateTotalItems()}</span></h2>
                 
                 <div className="cart-items">
                    {getCartItemsArray().length === 0 ? (
                       <div className="empty-cart-message">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="empty-icon"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                          <p>Select quantities from the inventory to build your order.</p>
                       </div>
                    ) : (
                       getCartItemsArray().map(item => (
                          <div key={item.id} className="cart-item">
                             <div className="cart-item-header">
                                 <div className="cart-item-title">
                                    <img src={item.image} alt={item.mark || item.name} className="cart-item-image" />
                                    <span className="cart-item-name">
                                       {item.name} {item.mark && item.mark !== item.name ? ` (${item.mark})` : ''}
                                    </span>
                                 </div>
                                 <button className="cart-item-remove" onClick={() => handleQuantityChange(item.id, 0)} aria-label="Remove item">✕</button>
                             </div>
                             <div className="cart-item-details">
                                 <span className="cart-item-calc">
                                   <span className="qty-tag">{item.quantity}</span> x {item.price.toLocaleString()} ֏
                                 </span>
                                 <span className="cart-item-subtotal">{item.subtotal.toLocaleString()} ֏</span>
                             </div>
                          </div>
                       ))
                    )}
                 </div>
                 
                 <div className="cart-summary">
                    <div className="summary-row">
                       <span>Total Items</span>
                       <span>{calculateTotalItems()}</span>
                    </div>
                    <div className="summary-row total-row">
                       <span>Total Amount</span>
                       <span>{calculateTotal().toLocaleString()} ֏</span>
                    </div>
                    <button 
                       className="checkout-btn" 
                       onClick={() => alert(`Order Confirmed! Total Amount: ${calculateTotal().toLocaleString()} ֏`)}
                       disabled={getCartItemsArray().length === 0}
                    >
                       Place Order
                    </button>
                    <button 
                       className="clear-cart-btn" 
                       onClick={() => setCart({})}
                       disabled={getCartItemsArray().length === 0}
                    >
                       Clear List
                    </button>
                 </div>
              </div>
          </aside>
       </main>
    </div>
  );
}

export default App;
