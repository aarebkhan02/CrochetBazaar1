import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Product } from '@/data/products';

export type CartLine = { product: Product; quantity: number };

const CART_KEY = 'crochetbazar-cart';
const WISHLIST_KEY = 'crochetbazar-wishlist';

export function useShop() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_KEY);
      const savedWishlist = localStorage.getItem(WISHLIST_KEY);
      if (savedCart) setCart(JSON.parse(savedCart) as CartLine[]);
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist) as string[]);
    } catch {
      setCart([]);
      setWishlist([]);
    }
  }, []);

  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist)); }, [wishlist]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart((current) => {
      const found = current.find((line) => line.product.id === product.id);
      return found
        ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + quantity } : line)
        : [...current, { product, quantity }];
    });
  }, []);
  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCart((current) => quantity <= 0 ? current.filter((line) => line.product.id !== id) : current.map((line) => line.product.id === id ? { ...line, quantity } : line));
  }, []);
  const removeFromCart = useCallback((id: string) => setCart((current) => current.filter((line) => line.product.id !== id)), []);
  const toggleWishlist = useCallback((id: string) => setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]), []);
  const subtotal = useMemo(() => cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0), [cart]);
  const delivery = subtotal === 0 || subtotal >= 999 ? 0 : 60;
  const total = subtotal + delivery;
  const itemCount = useMemo(() => cart.reduce((sum, line) => sum + line.quantity, 0), [cart]);

  return { cart, wishlist, addToCart, updateQuantity, removeFromCart, toggleWishlist, subtotal, delivery, total, itemCount, clearCart: () => setCart([]) };
}