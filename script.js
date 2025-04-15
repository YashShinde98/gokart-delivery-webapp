// Sample product data
const products = [
    {
        id: 1,
        name: "Fresh Apples",
        price: 120,
        originalPrice: 150,
        image: "https://via.placeholder.com/250x180?text=Apples"
    },
    {
        id: 2,
        name: "Organic Bananas",
        price: 50,
        originalPrice: 60,
        image: "https://via.placeholder.com/250x180?text=Bananas"
    },
    {
        id: 3,
        name: "Almond Milk",
        price: 90,
        originalPrice: 100,
        image: "https://via.placeholder.com/250x180?text=Almond+Milk"
    },
    {
        id: 4,
        name: "Whole Wheat Bread",
        price: 45,
        originalPrice: 50,
        image: "https://via.placeholder.com/250x180?text=Bread"
    },
    {
        id: 5,
        name: "Free Range Eggs (12)",
        price: 80,
        originalPrice: 90,
        image: "https://via.placeholder.com/250x180?text=Eggs"
    },
    {
        id: 6,
        name: "Greek Yogurt",
        price: 65,
        originalPrice: 75,
        image: "https://via.placeholder.com/250x180?text=Yogurt"
    },
    {
        id: 7,
        name: "Basmati Rice (1kg)",
        price: 110,
        originalPrice: 120,
        image: "https://via.placeholder.com/250x180?text=Rice"
    },
    {
        id: 8,
        name: "Extra Virgin Olive Oil",
        price: 350,
        originalPrice: 400,
        image: "https://via.placeholder.com/250x180?text=Olive+Oil"
    }
];

// Cart items array
let cartItems = [];

// DOM Elements
const productsContainer = document.querySelector('.products');
const cartCount = document.querySelector('.cart-count');
const cartModal = document.getElementById('cartModal');
const cartItemsContainer = document.querySelector('.cart-items');
const totalAmount = document.getElementById('totalAmount');

// Display products
function displayProducts() {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-title">${product.name}</h3>
            <div>
                <span class="product-price">₹${product.price}</span>
                <span class="product-original-price">₹${product.originalPrice}</span>
                <span class="product-discount">${discount}% OFF</span>
            </div>
            <div class="product-actions">
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-id="${product.id}">-</button>
                    <span class="quantity" data-id="${product.id}">0</span>
                    <button class="quantity-btn plus" data-id="${product.id}">+</button>
                </div>
                <button class="add-to-cart" data-id="${product.id}">Add</button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners
    addEventListeners();
}

// Add event listeners
function addEventListeners() {
    // Plus buttons
    document.querySelectorAll('.plus').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const quantityElement = document.querySelector(`.quantity[data-id="${id}"]`);
            let quantity = parseInt(quantityElement.textContent);
            quantityElement.textContent = quantity + 1;
        });
    });
    
    // Minus buttons
    document.querySelectorAll('.minus').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const quantityElement = document.querySelector(`.quantity[data-id="${id}"]`);
            let quantity = parseInt(quantityElement.textContent);
            if (quantity > 0) {
                quantityElement.textContent = quantity - 1;
            }
        });
    });
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const quantityElement = document.querySelector(`.quantity[data-id="${id}"]`);
            const quantity = parseInt(quantityElement.textContent);
            
            if (quantity > 0) {
                addToCart(id, quantity);
                quantityElement.textContent = 0;
            }
        });
    });
    
    // Cart icon click
    document.querySelector('.nav-links a:nth-child(3)').addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.style.display = 'block';
        updateCartModal();
    });
    
    // Close modal button
    document.querySelector('.close-btn').addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
}

// Add item to cart
function addToCart(productId, quantity) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        const existingItem = cartItems.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cartItems.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        updateCartCount();
    }
}

// Update cart count
function updateCartCount() {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Update cart modal
function updateCartModal() {
    cartItemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        totalAmount.textContent = '0';
        return;
    }
    
    let total = 0;
    
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">₹${item.price}</p>
                <div class="cart-item-quantity">
                    <button class="decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase" data-id="${item.id}">+</button>
                </div>
                <p class="remove-item" data-id="${item.id}">Remove</p>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    totalAmount.textContent = total;
    
    // Add event listeners for cart items
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            updateCartItemQuantity(id, -1);
        });
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            updateCartItemQuantity(id, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            removeCartItem(id);
        });
    });
}

// Update cart item quantity
function updateCartItemQuantity(productId, change) {
    const itemIndex = cartItems.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cartItems[itemIndex].quantity += change;
        
        if (cartItems[itemIndex].quantity <= 0) {
            cartItems.splice(itemIndex, 1);
        }
        
        updateCartCount();
        updateCartModal();
    }
}

// Remove cart item
function removeCartItem(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    updateCartCount();
    updateCartModal();
}

// Initialize the app
displayProducts();