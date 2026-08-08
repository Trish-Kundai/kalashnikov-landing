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

function updateSearchStatus(form, message) {
    let status = form.querySelector('.search-status');
    if (!status) {
        status = document.createElement('div');
        status.className = 'search-status';
        form.appendChild(status);
    }
    status.textContent = message;
}

function handleSearchSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.querySelector('input[type="search"]');
    const query = input.value.trim().toLowerCase();
    const productCards = Array.from(document.querySelectorAll('.product-card'));

    if (productCards.length > 0) {
        if (!query) {
            productCards.forEach(card => {
                card.style.display = 'flex';
            });
            updateSearchStatus(form, 'Showing all products.');
            return;
        }

        const matches = productCards.filter(card => {
            const detailText = card.querySelector('.product-detail')?.textContent.toLowerCase() || '';
            const altText = card.querySelector('img')?.alt.toLowerCase() || '';
            return detailText.includes(query) || altText.includes(query);
        });

        productCards.forEach(card => {
            card.style.display = matches.includes(card) ? 'flex' : 'none';
        });

        if (matches.length === 0) {
            updateSearchStatus(form, `No products found for "${input.value.trim()}".`);
        } else {
            updateSearchStatus(form, `${matches.length} product(s) found for "${input.value.trim()}".`);
        }
        return;
    }

    if (!query) {
        updateSearchStatus(form, 'Enter a keyword like mens, womens, or accessories.');
        return;
    }

    if (/\b(men|mens|male|man|shirt|jacket|denim|tee|t-shirt)\b/.test(query)) {
        window.location.href = 'mens.html';
        return;
    }

    if (/\b(women|womens|female|woman|dress|coat|pants|knit|skirt)\b/.test(query)) {
        window.location.href = 'womens.html';
        return;
    }

    if (/\b(accessories|accessory|belt|bag|chain|jewel|ring|earring|necklace)\b/.test(query)) {
        window.location.href = 'accessories.html';
        return;
    }

    if (/\b(about|contact|info)\b/.test(query)) {
        window.location.href = 'about.html';
        return;
    }

    updateSearchStatus(form, 'Try searching for mens, womens, or accessories.');
}

function setupSearchPanels() {
    const forms = document.querySelectorAll('.search-panel');
    forms.forEach(form => {
        form.addEventListener('submit', handleSearchSubmit);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupCartButtons();
    setupSearchPanels();
    updateCartUI();
});
