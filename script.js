const dotaPlayers = [
    { id: 1, name: "Пудж ", breed: "Керри", price: 15000, img: "lol.jpg" },
    { id: 2, name: "Инвокер", breed: "Мидер", price: 35000, img: "k2.jpg" },
    { id: 3, name: "Лина", breed: "Мидер", price: 28000, img: "opp.jpg" },
    { id: 4, name: "Свен", breed: "Саппорт", price: 12000, img: "p1.jpg" },
    { id: 5, name: "Мирана", breed: "Саппорт", price: 18000, img: "t5.jpg" },
    { id: 6, name: "Рики", breed: "Керри", price: 40000, img: "w2.jpg" }
];

let cart = [];

const catalogContainer = document.getElementById('catalog');
const searchInput = document.getElementById('search-input');
const breedFilter = document.getElementById('breed-filter');
const priceFilter = document.getElementById('price-filter');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const clearCartBtn = document.getElementById('clear-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');

function renderCatalog(data) {
    catalogContainer.innerHTML = '';
    if (data.length === 0) {
        catalogContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; font-size: 1.2em;">Таких дотеров в наличии нет </p>';
        return;
    }
    data.forEach(player => {
        const card = document.createElement('div');
        card.className = 'card';
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
    const searchText = searchInput.value.toLowerCase();
    const selectedBreed = breedFilter.value;
    const selectedPrice = priceFilter.value;

    const filtered = dotaPlayers.filter(player => {
        const matchesSearch = player.name.toLowerCase().includes(searchText);
        const matchesBreed = selectedBreed === "" || player.breed === selectedBreed;
        let matchesPrice = true;
        if (selectedPrice === "low") matchesPrice = player.price < 25000;
        if (selectedPrice === "high") matchesPrice = player.price >= 25000;
        return matchesSearch && matchesBreed && matchesPrice;
    });
    renderCatalog(filtered);
}

function addToCart(id) {
    const player = dotaPlayers.find(p => p.id === id);
    const cartItem = cart.find(item => item.id === id);

    if (cartItem) {
        cartItem.count += 1;
    } else {
        cart.push({ ...player, count: 1 });
    }
    updateCartUI();
}

function changeCount(id, delta) {
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        cartItem.count += delta;
        if (cartItem.count <= 0) {
            removeFromCart(id);
            return;
        }
    }
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color: #888; font-style: italic;">Корзина пуста</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.count;
            total += itemTotal;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.alignItems = 'center';
            div.style.marginBottom = '10px';
            div.style.paddingBottom = '10px';
            div.style.borderBottom = '1px dashed var(--main-pink)';
            
            div.innerHTML = `
                <div class="cart-item-info">
                    <span>${item.name}</span>
                    <span style="font-size: 0.85em; color: #888;">${itemTotal.toLocaleString()} ₽</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button onclick="changeCount(${item.id}, -1)" style="background: #ffccd5; border: 1px solid #ffb3c1; border-radius: 4px; cursor: pointer; padding: 2px 6px; font-weight: bold; color: #b33951;">-</button>
                    <span class="cart-item-count" style="color: var(--dark-pink); font-weight: bold; min-width: 20px; text-align: center;">${item.count}</span>
                    <button onclick="changeCount(${item.id}, 1)" style="background: #ffccd5; border: 1px solid #ffb3c1; border-radius: 4px; cursor: pointer; padding: 2px 6px; font-weight: bold; color: #b33951;">+</button>
                    <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: #ff69b4; cursor: pointer; font-size: 1.1em; margin-left: 5px;">❌</button>
                </div>
            `;
            cartItemsContainer.appendChild(div);
        });
    }

    cartTotalElement.textContent = `${total.toLocaleString()} ₽`;
}

function clearCart() {
    cart = [];
    updateCartUI();
}

function checkoutCart() {
    if (cart.length === 0) {
        alert("Ваша корзина пуста!");
        return;
    }
    let total = cart.reduce((sum, item) => sum + (item.price * item.count), 0);
    alert(`Заказ успешно оформлен! Итоговая сумма к оплате: ${total.toLocaleString()} ₽`);
    clearCart();
}

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart-bg';
    heart.innerHTML = '❤';
    heart.style.left = Math.random() * 100 + 'vw';
    const size = Math.random() * 20 + 10;
    heart.style.fontSize = size + 'px';
    const duration = Math.random() * 3 + 4;
    heart.style.animationDuration = duration + 's';
    document.body.appendChild(heart);
    setTimeout(() => { heart.remove(); }, duration * 1000);
}

searchInput.addEventListener('input', filterData);
breedFilter.addEventListener('change', filterData);
priceFilter.addEventListener('change', filterData);
clearCartBtn.addEventListener('click', clearCart);
checkoutBtn.addEventListener('click', checkoutCart);

setInterval(createHeart, 400);
renderCatalog(dotaPlayers);
updateCartUI();
