const cart = {
    items: [],
    add(product) {
        const existing = this.items.find(item => item.name === product.name);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        updateCartUI();
    },
    clear() {
        this.items = [];
        updateCartUI();
    },
    totalQuantity() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }
};

cart.totalAmount = function() {
    return this.items.reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0);
};

function toggleMenu() {
    const menu = document.getElementById('dropdown-menu');
    menu.classList.toggle('show');
}

function toggleCart() {
    const overlay = document.getElementById('cart-overlay');
    overlay.classList.toggle('show');
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cartCount) {
        cartCount.textContent = cart.totalQuantity();
    }

    if (cartItems) {
        if (cart.items.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        } else {
            cartItems.innerHTML = cart.items
                .map(item => {
                    const unit = Number(item.price || 0);
                    const line = unit * item.quantity;
                    return `<div class="cart-item"><div class="cart-line-left"><strong>${item.name}</strong><div class="cart-meta">${item.quantity} × $${unit.toFixed(2)}</div></div><div class="cart-line-right">$${line.toFixed(2)}</div></div>`;
                })
                .join('');
        }
    }

    if (cartTotal) {
        const total = cart.totalAmount();
        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }
}

function checkoutCart() {
    if (cart.items.length === 0) {
        alert('Your cart is empty. Add an item first.');
        return;
    }
    const total = cart.totalAmount();
    alert(`Checkout complete. You ordered ${cart.totalQuantity()} item(s). Total: $${total.toFixed(2)}`);
    cart.clear();
    toggleCart();
}

function setupCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.product;
            const price = Number(button.dataset.price || 0);
            cart.add({ name, price });
            button.textContent = 'Added';
            setTimeout(() => {
                button.textContent = 'Add to cart';
            }, 1200);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupCartButtons();
    updateCartUI();
});
