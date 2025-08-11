/* ===== Shared Script for Filtering + Cart ===== */

/* Product dataset used by shop.html (same IDs used in markup) */
const PRODUCTS = [
  /* Footwear */
  {id:'f1', category:'Footwear', name:'Urban Runner Sneakers', price:2599, img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmEPu1AjBx4WIrUQqhASV5dU6Z2jHTb3lFEQ&s'},
  {id:'f2', category:'Footwear', name:'Heels Sandal', price:899, img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_NIkgH4pEWih3NKCn9K6dEfENwVrOgrod1A&s'},
  {id:'f3', category:'Footwear', name:'Leather Formal Shoes', price:3999, img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuFoecKLi9vIPdg0WI8z7UV8e-3PcMmSyBJw&s'},

  /* Accessories */
  {id:'a1', category:'Accessories', name:'Smart Watch', price:2199, img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH_LAKWe29DvMg2d_3LkTlllWQmWIbiZWokw&s'},
  {id:'a2', category:'Accessories', name:'Sling Bag', price:1499, img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbvwjXkZCgEwZWsKymMnVeBsYnoP5lploR5A&s'},
  {id:'a3', category:'Accessories', name:'Sunglasses', price:1099, img:'https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//v/i/grey-gradient-gunmetal-full-rim-rectangle--square-vincent-chase-livewire-vc-s14507-m-c2-sunglasses__dsc0249_30_04_2024.jpg'},

  /* Beauty */
  {id:'b1', category:'Beauty', name:'Matte Lipstick (Red)', price:799, img:'https://www.colorbarcosmetics.com/media/catalog/product/l/i/lips-lipsticks-velvet-matte-lipstick-hot-hot-hot-1.png'},
  {id:'b2', category:'Beauty', name:'Floral Perfume 50ml', price:1699, img:'https://fraganote.com/cdn/shop/files/WhiteFloral05.png?v=1742461316'},
  {id:'b3', category:'Beauty', name:'Moisturizer', price:499, img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY1hFkWOZbpojtZwhIvUl2rNZ2nbxSUfSF6g&s'},
];

/* ----- Filtering on shop page ----- */
function renderProducts(filter = 'All'){
  const container = document.getElementById('products-grid');
  if(!container) return;
  container.innerHTML = '';
  const list = PRODUCTS.filter(p => filter==='All' ? true : p.category === filter);
  list.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="small">${p.category}</div>
      <div class="price-row">
        <div class="price">₹${p.price.toLocaleString()}</div>
        <button class="btn btn-primary" onclick="addToCart('${p.id}')">Add</button>
      </div>
    `;
    container.appendChild(div);
  });
}

/* Toggle filter button active state */
function setupFilters(){
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      buttons.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      renderProducts(cat);
    });
  });
}

/* ----- Cart (localStorage) ----- */
function addToCart(productId){
  const product = PRODUCTS.find(p=>p.id === productId);
  if(!product) return alert('Product not found');
  let cart = JSON.parse(localStorage.getItem('shop_cart') || '[]');

  const existing = cart.find(i => i.id === productId);
  if(existing){
    existing.qty += 1;
  } else {
    cart.push({ id: productId, name: product.name, price: product.price, img: product.img, qty: 1 });
  }
  localStorage.setItem('shop_cart', JSON.stringify(cart));
  alert(`${product.name} added to cart`);
  updateCartCount();
}

/* Remove item (by id) */
function removeFromCart(id){
  let cart = JSON.parse(localStorage.getItem('shop_cart') || '[]');
  cart = cart.filter(i => i.id !== id);
  localStorage.setItem('shop_cart', JSON.stringify(cart));
  loadCartPage();
  updateCartCount();
}

/* Change quantity */
function changeQty(id, delta){
  let cart = JSON.parse(localStorage.getItem('shop_cart') || '[]');
  const it = cart.find(i => i.id === id);
  if(!it) return;
  it.qty = Math.max(1, it.qty + delta);
  localStorage.setItem('shop_cart', JSON.stringify(cart));
  loadCartPage();
  updateCartCount();
}

/* Load cart page items */
function loadCartPage(){
  const container = document.getElementById('cart-items');
  if(!container) return;
  let cart = JSON.parse(localStorage.getItem('shop_cart') || '[]');
  container.innerHTML = '';
  if(cart.length===0){
    container.innerHTML = `<p>Your cart is empty.</p>`;
    return;
  }
  let total = 0;
  cart.forEach(it=>{
    total += it.price * it.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${it.img}" alt="${it.name}">
      <div style="flex:1">
        <div style="font-weight:700">${it.name}</div>
        <div class="small">₹${it.price.toLocaleString()} x ${it.qty} = <strong>₹${(it.price*it.qty).toLocaleString()}</strong></div>
      </div>
      <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
        <div>
          <button class="filter-btn" onclick="changeQty('${it.id}', -1)">-</button>
          <button class="filter-btn" onclick="changeQty('${it.id}', 1)">+</button>
        </div>
        <button class="btn" style="background:#ff4b5c;color:white;" onclick="removeFromCart('${it.id}')">Remove</button>
      </div>
    `;
    container.appendChild(div);
  });

  const footer = document.getElementById('cart-total');
  footer.innerHTML = `<div style="margin-top:12px; text-align:right; font-weight:800">Total: ₹${total.toLocaleString()}</div>
  <div style="text-align:right; margin-top:10px;"><button class="btn btn-primary" onclick="checkout()">Checkout</button></div>`;
}

/* checkout (simple demo) */
function checkout(){
  let cart = JSON.parse(localStorage.getItem('shop_cart') || '[]');
  if(cart.length===0) return alert('Cart is empty');
  localStorage.removeItem('shop_cart');
  updateCartCount();
  loadCartPage();
  alert('Thank you! Your order has been placed (demo).');
}

/* update small cart count */
function updateCartCount(){
  const el = document.getElementById('cart-count');
  if(!el) return;
  const cart = JSON.parse(localStorage.getItem('shop_cart') || '[]');
  const count = cart.reduce((s,i)=> s + i.qty, 0);
  el.textContent = count;
}

/* Init on pages when ready */
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount();
  setupFilters();
  renderProducts('All'); // default show all if on shop page
});
