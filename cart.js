
// ==========================================
// Persistent Cart Logic
// ==========================================

const CART_KEY = 'nutrishake_cart';

// Load cart from localStorage
function getCart() {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

// Add item to cart
function addItemToCart(item) {
    let cart = getCart();

    // Check if item already exists (same name and size)
    const existingIndex = cart.findIndex(i => i.name === item.name && i.size === item.size);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += (item.quantity || 1);
    } else {
        cart.push({
            id: Date.now(),
            name: item.name,
            price: item.price,
            size: item.size || 'Regular',
            quantity: item.quantity || 1,
            img: item.img,
            theme: item.theme || 'default'
        });
    }

    saveCart(cart);
    showMiniCart(item);
}

// Remove item from cart
function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    // If we're on the cart page, we'll need to re-render
    if (typeof renderCart === 'function') renderCart();
}

// Update quantity
function updateQuantity(id, change) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        saveCart(cart);
        if (typeof renderCart === 'function') renderCart();
    }
}

// Clear cart
function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartCount();
}

// Update cart count badge in navbar
function updateCartBadge() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Alias for backward compatibility
function updateCartCount() {
    updateCartBadge();
}

// Show mini cart preview popup
function showMiniCart(item) {
    // Create popup if it doesn't exist
    let popup = document.getElementById('miniCartPopup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'miniCartPopup';
        popup.className = 'fixed top-20 right-4 z-[100] w-72 bg-bg-card border border-white/10 rounded-2xl shadow-2xl p-4 transform translate-x-80 transition-transform duration-500 ease-out backdrop-blur-xl';
        document.body.appendChild(popup);
    }

    popup.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <img src="${item.img}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
                <h4 class="text-white font-bold text-sm truncate">${item.name}</h4>
                <p class="text-white/40 text-[10px]">${item.size} • ₹${item.price}</p>
                <div class="flex items-center gap-1 mt-1">
                   <span class="material-symbols-outlined text-green-400 text-xs">check_circle</span>
                   <span class="text-green-400 text-[10px] font-bold uppercase">Added to cart</span>
                </div>
            </div>
        </div>
        <div class="mt-4 flex gap-2">
            <a href="cart.html" class="flex-1 text-center py-2 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-lg transition-colors">View Cart</a>
            <a href="address.html" class="flex-1 text-center py-2 bg-primary text-bg-dark text-[11px] font-extrabold rounded-lg transition-colors">Checkout</a>
        </div>
    `;

    // Slide in
    popup.classList.remove('translate-x-80');

    // Slide out after 3 seconds
    setTimeout(() => {
        popup.classList.add('translate-x-80');
    }, 3000);
}

// Initialize count on load
document.addEventListener('DOMContentLoaded', updateCartBadge);

