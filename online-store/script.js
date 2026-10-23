const API_URL = 'http://localhost:3000/api';
let dotaPlayers = []; 
let cart = [];

const catalogContainer = document.getElementById('catalog');
const searchInput = document.getElementById('search-input');
const breedFilter = document.getElementById('breed-filter');
const priceFilter = document.getElementById('price-filter');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const clearCartBtn = document.getElementById('clear-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');

const authModal = document.getElementById('auth-modal');
const authTriggerBtn = document.getElementById('auth-trigger-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const headerWelcome = document.getElementById('header-welcome');

const authUsernameInput = document.getElementById('auth-username');
const authPasswordInput = document.getElementById('auth-password');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const authFormDiv = document.getElementById('auth-form');
const userProfileDiv = document.getElementById('user-profile');
const welcomeText = document.getElementById('welcome-text');
const authTitle = document.getElementById('auth-title');

authTriggerBtn.addEventListener('click', () => {
    authModal.style.display = 'flex';
});
closeModalBtn.addEventListener('click', () => {
    authModal.style.display = 'none';
});
window.addEventListener('click', (e) => {
    if (e.target === authModal) authModal.style.display = 'none';
});

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        
        if (!response.ok) {
            catalogContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: red; font-size: 1.2em;">Ошибка сервера бэкенда: ${data.error || 'Неизвестная ошибка'}</p>`;
            return;
        }

        dotaPlayers = data;
        
        if (!Array.isArray(dotaPlayers)) {
            catalogContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: red; font-size: 1.2em;">Ошибка: Сервер вернул не список товаров.</p>`;
            return;
        }

        renderCatalog(dotaPlayers);
        checkImmediatePurchase(); 
    } catch (error) {
        console.error("Детали ошибки fetch:", error);
        catalogContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red; font-size: 1.2em;">Ошибка сети: Проверьте работу Node.js и подключение к БД.</p>';
    }
}

function renderCatalog(data) {
    catalogContainer.innerHTML = '';
    if (data.length === 0) {
        catalogContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; font-size: 1.2em;">Таких дотеров в наличии нет </p>';
        return;
    }
    data.forEach(player => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('buy-btn')) {
                return; 
            }
            window.location.href = `product.html?id=${player.id}`;
        });

        card.innerHTML = `
            <img src="${player.img}" alt="${player.name}" class="card-img">
            <div class="card-content">
                <h3 class="card-title">${player.name}</h3>
                <div class="card-breed">${player.breed}</div>
                <div class="card-price">${player.price.toLocaleString()} ₽</div>
                <button class="buy-btn" onclick="addToCart(${player.id})">Купить мамку!!!!!!!!!!!</button>
            </div>
        `;
        catalogContainer.appendChild(card);
    });
}

function filterData() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedBreed = breedFilter.value;
    const selectedPriceRange = priceFilter.value;

    const filtered = dotaPlayers.filter(player => {
        const matchesSearch = player.name.toLowerCase().includes(searchText);
        const matchesBreed = selectedBreed === "" || player.breed === selectedBreed;
        
        let matchesPrice = true;
        if (selectedPriceRange === "low") matchesPrice = player.price < 25000;
        else if (selectedPriceRange === "high") matchesPrice = player.price >= 25000;

        return matchesSearch && matchesBreed && matchesPrice;
    });

    renderCatalog(filtered);
}

window.addToCart = function(id) {
    const isAuthorized = localStorage.getItem('user');
    
    if (!isAuthorized) {
        alert('Чтобы покупать мамок дотеров, необходимо войти в аккаунт!');
        authModal.style.display = 'flex';
        return;
    }

    const player = dotaPlayers.find(p => p.id === id);
    if (!player) return;

    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        cartItem.count += 1;
    } else {
        cart.push({ ...player, count: 1 });
    }
    renderCart();
};

function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color: #888; font-size: 0.9em;">Корзина пуста</p>';
        cartTotalElement.textContent = '0 ₽';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.count;
        total += itemTotal;

        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <div class="cart-item-info">
                <span>${item.name}</span>
                <span style="font-size: 0.8em; color: #888;">${item.price.toLocaleString()} ₽ x ${item.count}</span>
            </div>
            <span class="cart-item-count">${itemTotal.toLocaleString()} ₽</span>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
    });

    cartTotalElement.textContent = `${total.toLocaleString()} ₽`;
}

registerBtn.addEventListener('click', async () => {
    const username = authUsernameInput.value.trim();
    const password = authPasswordInput.value.trim();
    if(!username || !password) return alert('Заполните поля!');

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        alert(data.message || data.error);
    } catch(e) { alert('Ошибка отправки запроса'); }
});

loginBtn.addEventListener('click', async () => {
    const username = authUsernameInput.value.trim();
    const password = authPasswordInput.value.trim();
    if(!username || !password) return alert('Заполните поля!');

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('user', data.username);
            showLoggedInUser(data.username);
            authModal.style.display = 'none';
        } else {
            alert(data.error);
        }
    } catch(e) { alert('Ошибка сервера при авторизации'); }
});

function showLoggedInUser(username) {
    authFormDiv.style.display = 'none';
    userProfileDiv.style.display = 'flex';
    welcomeText.textContent = `Вы вошли как: ${username}`;
    authTitle.textContent = 'Ваш Профиль';
    
    headerWelcome.style.display = 'inline';
    headerWelcome.textContent = `Привет, ${username}!`;
    authTriggerBtn.textContent = 'Личный кабинет';
}

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    authFormDiv.style.display = 'block';
    userProfileDiv.style.display = 'none';
    authTitle.textContent = 'Вход / Регистрация';
    
    headerWelcome.style.display = 'none';
    authTriggerBtn.textContent = 'Войти';
    authModal.style.display = 'none';
    authUsernameInput.value = '';
    authPasswordInput.value = '';
    
    cart = [];
    renderCart();
});

function checkImmediatePurchase() {
    const immediateCartId = sessionStorage.getItem('addToCartImmediate');
    if (immediateCartId) {
        sessionStorage.removeItem('addToCartImmediate');
        addToCart(parseInt(immediateCartId));
    }
}

const savedUser = localStorage.getItem('user');
if (savedUser) showLoggedInUser(savedUser);

searchInput.addEventListener('input', filterData);
breedFilter.addEventListener('change', filterData);
priceFilter.addEventListener('change', filterData);

clearCartBtn.addEventListener('click', () => { cart = []; renderCart(); });
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return alert('Ваша корзина пуста!');
    alert('Поздравляем с покупкой!');
    cart = []; renderCart();
});

loadProducts();
renderCart();
