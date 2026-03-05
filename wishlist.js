// ============================
// Wishlist Helper — localStorage
// ============================
const WISHLIST_KEY = 'nutrishake_wishlist';

function getWishlist() {
    try {
        return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch {
        return [];
    }
}

function saveWishlist(list) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
}

function isWishlisted(name) {
    return getWishlist().some(item => item.name === name);
}

function addToWishlist(item) {
    const list = getWishlist();
    if (!list.some(i => i.name === item.name)) {
        list.push(item);
        saveWishlist(list);
    }
}

function removeFromWishlist(name) {
    const list = getWishlist().filter(i => i.name !== name);
    saveWishlist(list);
}

function toggleWishlist(item, btn) {
    if (isWishlisted(item.name)) {
        removeFromWishlist(item.name);
        setHeartState(btn, false);
    } else {
        addToWishlist(item);
        setHeartState(btn, true);
        // Tiny heart pop animation
        btn.classList.add('heart-pop');
        setTimeout(() => btn.classList.remove('heart-pop'), 350);
    }
}

function setHeartState(btn, wishlisted) {
    const icon = btn.querySelector('.material-symbols-outlined') || btn;
    if (wishlisted) {
        btn.classList.add('wishlisted');
        icon.style.fontVariationSettings = "'FILL' 1";
        icon.style.color = '#FF4F81';
    } else {
        btn.classList.remove('wishlisted');
        icon.style.fontVariationSettings = "'FILL' 0";
        icon.style.color = '';
    }
}

// Sync all heart buttons on the current page
function syncWishlistHearts() {
    document.querySelectorAll('[data-wishlist-btn]').forEach(btn => {
        const name = btn.dataset.wishlistBtn;
        if (name) setHeartState(btn, isWishlisted(name));
    });
}

// Wishlist badge count (for future use)
function getWishlistCount() {
    return getWishlist().length;
}
