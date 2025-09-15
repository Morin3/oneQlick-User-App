// Updated Cart Hook using Zustand
import { useCartStore } from '../store/cartStore';

export function useCart() {
  const {
    cart,
    isLoaded,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyOffer,
    removeOffer,
    calculateTotals,
    getCartItemCount,
    isCartEmpty,
    canCheckout,
    getRestaurantId,
  } = useCartStore();

  return {
    cart,
    isLoaded,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyOffer,
    removeOffer,
    calculateTotals,
    getCartItemCount,
    isCartEmpty,
    canCheckout,
    getRestaurantId,
  };
}
