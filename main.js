const productsGrid = document.querySelector('.products_grid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('totalPrice');

let cart = [];

fetch('https://fakestoreapi.com/products')
  .then(res => res.json())
  .then(products => renderProducts(products))
  .catch(err => {
    console.error(err);
    productsGrid.innerHTML = '<p>Failed to load products.</p>';
  });

function renderProducts(products) {
  productsGrid.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img
        class="product-card__image"
        src="${product.image}"
        alt="${product.title}"
      />

      <h3 class="product-card__title">
        ${product.title}
      </h3>

      <p class="product-card__money">
        $${product.price.toFixed(2)}
      </p>

      <button class="product-card__button">
        Add to Cart
      </button>
    `;

    const button = card.querySelector('.product-card__button');
    button.addEventListener('click', () => addToCart(product));

    productsGrid.appendChild(card);
  });
}

function addToCart(product) {
  console.log('Adding to cart:', product);
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      qty: 1
    });
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function calculateTotal() {
  return cart.reduce((sum, item) => {
    return sum + item.price * item.qty;
  }, 0);
}

function renderCart() {
  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <li class="card_empty">
        Your cart is empty
      </li>
    `;
    cartTotal.textContent = '$0.00';
    return;
  }

  cart.forEach(item => {
    const li = document.createElement('li');
    li.className = 'cart_item';

    li.innerHTML = `
      <span class="cart_item-title">
        ${item.title}
        <small>×${item.qty}</small>
      </span>

      <span class="cart_item-price">
        $${(item.price * item.qty).toFixed(2)}
      </span>

      <button class="cart_item-remove">
        Remove
      </button>
    `;

    li.querySelector('.cart_item-remove')
      .addEventListener('click', () => removeFromCart(item.id));

    cartItems.appendChild(li);
  });

  cartTotal.textContent = `$${calculateTotal().toFixed(2)}`;
}
