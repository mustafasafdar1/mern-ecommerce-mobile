import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('mz_cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('mz_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty = 1) => {
        setCartItems(prev => {
            const existing = prev.find(i => i._id === product._id);
            if (existing) {
                toast.success('Quantity updated!');
                return prev.map(i =>
                    i._id === product._id ? { ...i, qty: Math.min(i.qty + qty, product.countInStock) } : i
                );
            }
            toast.success(`${product.name.split(' ').slice(0, 2).join(' ')} added to cart! 🛒`);
            return [...prev, { ...product, qty }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(i => i._id !== id));
        toast.success('Item removed');
    };

    const updateQty = (id, qty) => {
        if (qty < 1) return removeFromCart(id);
        setCartItems(prev => prev.map(i => i._id === id ? { ...i, qty } : i));
    };

    const clearCart = () => setCartItems([]);

    const cartTotal = cartItems.reduce((acc, i) => acc + i.price * i.qty, 0);
    const cartCount = cartItems.reduce((acc, i) => acc + i.qty, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount, isCartOpen, setIsCartOpen }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
