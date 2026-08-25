import { COMMON_VEGETABLES, MENU_CATEGORIES, getAllSoups, getCategory } from './menu-data.js';

const app = document.querySelector('#app');
const modalRoot = document.querySelector('#modal-root');
const toast = document.querySelector('#toast');
const cartBadge = document.querySelector('#cart-badge');

const state = {
  route: 'home',
  categoryId: null,
  menuCategoryId: MENU_CATEGORIES[0].id,
  selection: null,
  cart: [],
};

const ICONS = {
  sparkles: '<path d="m12 3 1.25 3.75L17 8l-3.75 1.25L12 13l-1.25-3.75L7 8l3.75-1.25L12 3Z"/><path d="m19 13 .8 2.2L22 16l-2.2.8L19 19l-.8-2.2L16 16l2.2-.8L19 13Z"/><path d="m5 14 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z"/>',
  leaf: '<path d="M20.8 3.2C13.5 3.6 7.3 5.5 5 10.2c-1.5 3.1-.4 6.1 2.2 7.6 2.5 1.4 5.6.8 7.4-1.7 2.7-3.7 3.5-8.1 6.2-12.9Z"/><path d="M4 21c2.8-6.2 7-9.8 12.7-12.2"/>',
  energy: '<path d="M13 2 4.8 13H11l-1 9 8.2-11H12l1-9Z"/>',
  activity: '<path d="M3 12h4l2.5-6 4.5 12 2.4-6H21"/>',
  shield: '<path d="M12 22s8-3.6 8-10V5l-8-3-8 3v7c0 6.4 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/>',
  person: '<circle cx="12" cy="7" r="4"/><path d="M5.5 22v-2a6.5 6.5 0 0 1 13 0v2"/>',
  carrot: '<path d="M14.5 8.5 6 21l-3-3 8.5-12.5"/><path d="M14 6c.2-2 1.5-3.5 3.5-4M15.5 7.5c2-.2 3.5-1.5 4-3.5M14.5 6.5l3 3"/>',
  brain: '<path d="M9.5 4.5A3.5 3.5 0 0 0 6 8v.3A3.5 3.5 0 0 0 4 14a3.5 3.5 0 0 0 3.5 5H10V5.2a3 3 0 0 0-.5-.7Z"/><path d="M14.5 4.5A3.5 3.5 0 0 1 18 8v.3a3.5 3.5 0 0 1 2 5.7 3.5 3.5 0 0 1-3.5 5H14V5.2c.1-.3.3-.5.5-.7Z"/><path d="M7 9.5c1.7.2 3 1.7 3 3.5M17 9.5c-1.7.2-3 1.7-3 3.5"/>',
  menu: '<path d="M6 3h12v18H6z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
  bowl: '<path d="M3 11h18c0 5-4 9-9 9s-9-4-9-9Z"/><path d="M7 7c0-1 1-1 1-2s-1-1-1-2M12 7c0-1 1-1 1-2s-1-1-1-2M17 7c0-1 1-1 1-2s-1-1-1-2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
};

function icon(name, className = '') {
  return `<span class="${className}" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.sparkles}</svg></span>`;
}

function formatMoney(value) {
  return value === null ? '價格待確認' : `$${value}`;
}

function formatExtra(value) {
  return `+$${value}`;
}

function categoryIcon(category) {
  return icon(category.icon, `category-icon ${category.color}`);
}

function getSelected(category) {
  const protein = category.proteins.find((item) => item.id === state.selection?.proteinId) || null;
  const soup = getAllSoups(category).find((item) => item.id === state.selection?.soupId) || null;
  const staple = category.staples.find((item) => item.id === state.selection?.stapleId) || null;
  return { protein, soup, staple };
}

function startCategory(categoryId) {
  const category = getCategory(categoryId);
  if (!category) return;
  state.categoryId = categoryId;
  state.selection = { ...category.recommendation, categoryId };
  navigate('recommendation', { categoryId });
}

function calculateTotal(category, selection = getSelected(category)) {
  if (category.price === null) return null;
  const basePrice = selection.protein?.price ?? category.price;
  if (basePrice === null || basePrice === undefined) return null;
  return basePrice + (selection.soup?.extraPrice || 0) + (selection.staple?.extraPrice || 0);
}

function renderHome() {
  app.innerHTML = `
    <section class="page home-page" aria-labelledby="home-title">
      <div class="home-intro">
        <div class="welcome-label">歡迎光臨</div>
        <h1 id="home-title">請選擇您的點餐方式</h1>
      </div>
      <div class="home-choices">
        <button class="home-card primary" type="button" data-route="needs">
          ${icon('brain', 'home-icon')}
          <h2>AI 智能推薦</h2>
          <p>告訴我們您的需求，AI 為您推薦適合的餐點。<span class="example-copy">例如：養顏美容、控制體脂、養氣補氣…</span></p>
        </button>
        <button class="home-card" type="button" data-route="menu">
          ${icon('menu', 'home-icon')}
          <h2>瀏覽完整菜單</h2>
          <p>我想自己選，瀏覽全部餐點。</p>
        </button>
      </div>
    </section>`;
}

function renderNeeds() {
  app.innerHTML = `
    <section class="page" aria-labelledby="needs-title">
      <button class="back-button" type="button" data-route="home">← 返回首頁</button>
      <div class="center-heading">
        <p class="eyebrow">AI 智能推薦</p>
        <h1 class="page-heading" id="needs-title">請選擇您的需求</h1>
        <p class="page-subtitle">AI 會依照正式菜單縮小選擇範圍，最後由您決定想吃的搭配。</p>
      </div>
      <div class="category-grid">
        ${MENU_CATEGORIES.map((category) => `
          <button class="category-card" type="button" data-start-category="${category.id}">
            ${categoryIcon(category)}
            <span>
              <h2>${category.name}</h2>
              <p>${category.shortDescription}</p>
            </span>
            <span class="card-arrow" aria-hidden="true">›</span>
          </button>`).join('')}
      </div>
    </section>`;
}

function renderOptionCard(item, type, category, selectedId) {
  const isRecommended = category.recommendation[`${type}Id`] === item.id;
  const price = type === 'protein' ? formatMoney(item.price) : formatExtra(item.extraPrice);
  return `
    <button class="option-card${selectedId === item.id ? ' selected' : ''}" type="button" data-select-type="${type}" data-select-id="${item.id}" aria-pressed="${selectedId === item.id}">
      ${isRecommended ? '<span class="ai-badge">AI 推薦</span>' : ''}
      <span class="option-name">${item.name}</span>
      <span class="option-price">${price}</span>
      ${item.note ? `<span class="option-note">${item.note}</span>` : ''}
      ${item.seasonal && item.note !== '冬季限定' ? '<span class="season-badge">冬季限定</span>' : ''}
    </button>`;
}

function recommendationReason(category, selected) {
  const names = [selected.protein?.name, selected.soup?.name, selected.staple?.name].filter(Boolean);
  const combination = names.join('、');
  if (category.id === 'vegetarian') {
    return `這組搭配包含${combination}與多樣蔬菜，是「${category.name}」正式菜單中的植感選擇。`;
  }
  return `這組搭配包含${combination}與多樣蔬菜，是「${category.name}」分類中的均衡選擇。`;
}

function renderRecommendation() {
  const category = getCategory(state.categoryId);
  if (!category) {
    navigate('needs', {}, true);
    return;
  }
  const selected = getSelected(category);
  const total = calculateTotal(category, selected);
  const summaryNames = [selected.protein?.name, selected.soup?.name, selected.staple?.name].filter(Boolean);
  const isComplete = (category.proteins.length === 0 || selected.protein) && selected.soup && selected.staple;
  const canConfirm = isComplete && total !== null;

  app.innerHTML = `
    <section class="page recommendation-page" aria-labelledby="recommendation-title">
      <button class="back-button" type="button" data-route="needs">← 返回健康需求</button>
      <header class="recommendation-header">
        <p class="eyebrow">AI 智能推薦</p>
        <h1 id="recommendation-title">AI 智慧配餐－${category.name}</h1>
        <p>為您從${category.name}正式菜單中挑選適合的搭配，所有選項都可自行更換。</p>
      </header>

      ${category.proteins.length ? `
        <section class="selection-section" aria-labelledby="protein-title">
          <div class="section-heading"><span class="step-number">1</span><h2 id="protein-title">選擇主餐</h2></div>
          <div class="option-grid">
            ${category.proteins.map((item) => renderOptionCard(item, 'protein', category, state.selection.proteinId)).join('')}
          </div>
        </section>` : `
        <div class="vegetarian-notice">
          ${icon('leaf', 'inline-icon')}
          <div><strong>純植物飲食</strong><br>此分類沒有肉類主餐，套餐包含常備菜品與植感專屬菜品。正式基礎價格尚待提供。</div>
        </div>`}

      <section class="selection-section" aria-labelledby="soup-title">
        <div class="section-heading"><span class="step-number">2</span><h2 id="soup-title">選擇湯底</h2></div>
        <div class="option-group-label">基礎湯底</div>
        <div class="option-grid">
          ${category.baseSoups.map((item) => renderOptionCard(item, 'soup', category, state.selection.soupId)).join('')}
        </div>
        ${category.upgradeSoups.length ? `
          <div class="option-group-label">${category.upgradeLabel}</div>
          <div class="option-grid">
            ${category.upgradeSoups.map((item) => renderOptionCard(item, 'soup', category, state.selection.soupId)).join('')}
          </div>` : ''}
      </section>

      <section class="selection-section" aria-labelledby="staple-title">
        <div class="section-heading"><span class="step-number">3</span><h2 id="staple-title">選擇主食</h2></div>
        <div class="option-grid">
          ${category.staples.map((item) => renderOptionCard(item, 'staple', category, state.selection.stapleId)).join('')}
        </div>
      </section>

      <details class="included-vegetables">
        <summary>
          ${icon('bowl', 'inline-icon')}
          <span><strong>本套餐菜盤</strong>已搭配${category.name}專屬菜盤</span>
          <span class="details-arrow">查看內容 ›</span>
        </summary>
        <div class="vegetable-details">
          <div><h3>常備菜品</h3><p>${COMMON_VEGETABLES.join('・')}</p></div>
          <div><h3>${category.specialVegetableLabel}</h3><p>${category.specialVegetables.join('・')}</p></div>
        </div>
      </details>

      <aside class="reason-box" aria-labelledby="reason-title">
        ${icon('sparkles', 'inline-icon')}
        <div><h2 id="reason-title">AI 推薦理由</h2><p>${recommendationReason(category, selected)}</p></div>
      </aside>

      ${total === null ? `<div class="price-notice" style="margin-top:16px">${icon('info', 'inline-icon')}<div><strong>價格資料待補</strong><br>素食套餐缺少正式基礎價格，目前無法計算總額或加入購物車。</div></div>` : ''}
    </section>
    <div class="meal-summary" aria-label="目前套餐摘要">
      <div>
        <div class="summary-label">目前套餐</div>
        <div class="summary-selection">${summaryNames.join(' ＋ ')}</div>
      </div>
      <div class="summary-price">${formatMoney(total)}</div>
      <button class="primary-button" type="button" data-action="add-to-cart" ${canConfirm ? '' : 'disabled'}>${total === null ? '價格待確認' : '確認餐點'}</button>
    </div>`;
}

function listItem(item, type = 'extra') {
  const price = type === 'protein' ? formatMoney(item.price) : formatExtra(item.extraPrice);
  return `<li><span>${item.name}${item.note ? `<small class="menu-list-note">${item.note}</small>` : ''}</span><span class="menu-list-price">${price}</span></li>`;
}

function renderMenu() {
  const category = getCategory(state.menuCategoryId) || MENU_CATEGORIES[0];
  app.innerHTML = `
    <section class="page" aria-labelledby="menu-title">
      <button class="back-button" type="button" data-route="home">← 返回首頁</button>
      <div class="center-heading">
        <p class="eyebrow">食癒所正式菜單</p>
        <h1 class="page-heading" id="menu-title">瀏覽完整菜單</h1>
        <p class="page-subtitle">依需求查看主餐、湯底、主食與自動搭配菜盤。</p>
      </div>
      <div class="menu-tabs" role="tablist" aria-label="菜單分類">
        ${MENU_CATEGORIES.map((item) => `<button class="menu-tab${item.id === category.id ? ' active' : ''}" type="button" role="tab" aria-selected="${item.id === category.id}" data-menu-category="${item.id}">${item.name}</button>`).join('')}
      </div>
      <article class="menu-overview">
        <header class="menu-overview-head">
          ${categoryIcon(category)}
          <div><h2>${category.name}</h2><p>${category.shortDescription}</p></div>
          <button class="primary-button" type="button" data-start-category="${category.id}">開始配餐</button>
        </header>
        ${category.price === null ? '<div class="price-notice" style="margin:18px 24px 0"><span>ⓘ</span><div><strong>素食套餐基礎價格待確認</strong><br>正式菜單未提供基礎價格，此處不顯示推測價格。</div></div>' : ''}
        <div class="menu-columns">
          <section class="menu-column">
            <h3>主餐</h3>
            ${category.proteins.length ? `<ul class="menu-list">${category.proteins.map((item) => listItem(item, 'protein')).join('')}</ul>` : '<p class="page-subtitle" style="margin:0;text-align:left;font-size:14px">純植物飲食，不含肉類主餐。</p>'}
          </section>
          <section class="menu-column">
            <h3>湯底</h3>
            <div class="option-group-label">基礎湯底</div>
            <ul class="menu-list">${category.baseSoups.map((item) => listItem(item)).join('')}</ul>
            ${category.upgradeSoups.length ? `<div class="option-group-label">${category.upgradeLabel}</div><ul class="menu-list">${category.upgradeSoups.map((item) => listItem(item)).join('')}</ul>` : ''}
          </section>
          <section class="menu-column">
            <h3>主食</h3>
            <ul class="menu-list">${category.staples.map((item) => listItem(item)).join('')}</ul>
          </section>
        </div>
        <section class="menu-vegetables">
          <h3>本套餐菜盤</h3>
          <p><strong>常備菜品：</strong>${COMMON_VEGETABLES.join('・')}<br><strong>${category.specialVegetableLabel}：</strong>${category.specialVegetables.join('・')}</p>
        </section>
      </article>
    </section>`;
}

function addToCart() {
  const category = getCategory(state.categoryId);
  if (!category) return;
  const selected = getSelected(category);
  const price = calculateTotal(category, selected);
  if (price === null || !selected.soup || !selected.staple || (category.proteins.length && !selected.protein)) return;
  state.cart.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    categoryId: category.id,
    categoryName: category.name,
    protein: selected.protein,
    soup: selected.soup,
    staple: selected.staple,
    price,
    quantity: 1,
  });
  updateCartBadge();
  navigate('cart');
}

function renderCart() {
  if (!state.cart.length) {
    app.innerHTML = `
      <section class="page empty-state">
        <div class="empty-state-card">
          ${icon('bowl', 'home-icon')}
          <h1>購物車還是空的</h1>
          <p>先選擇一份適合您的餐點吧。</p>
          <button class="primary-button" type="button" data-route="home">開始點餐</button>
        </div>
      </section>`;
    return;
  }

  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  app.innerHTML = `
    <section class="page cart-page" aria-labelledby="cart-title">
      <button class="back-button" type="button" data-route="home">← 繼續點餐</button>
      <h1 class="page-heading" id="cart-title">確認您的餐點</h1>
      <p class="page-subtitle">請確認品項、數量無誤後送出訂單</p>
      <div class="cart-list">
        ${state.cart.map((item) => `
          <article class="cart-item">
            <div>
              <h2>【${item.categoryName}套餐】${item.protein?.name || '植感菜盤'}</h2>
              <div class="cart-details">
                <div><span class="cart-detail-label">主餐</span><span class="cart-detail-value">${item.protein?.name || '純植物飲食'}</span></div>
                <div><span class="cart-detail-label">湯底</span><span class="cart-detail-value">${item.soup.name}${item.soup.extraPrice ? ` +$${item.soup.extraPrice}` : ''}</span></div>
                <div><span class="cart-detail-label">主食</span><span class="cart-detail-value">${item.staple.name}${item.staple.extraPrice ? ` +$${item.staple.extraPrice}` : ''}</span></div>
                <div><span class="cart-detail-label">菜盤</span><span class="cart-detail-value">${item.categoryName}專屬菜盤</span></div>
              </div>
            </div>
            <div class="cart-item-actions">
              <div class="cart-item-price">$${item.price * item.quantity}</div>
              <div class="quantity-control" aria-label="調整數量">
                <button type="button" data-cart-delta="-1" data-cart-id="${item.id}" aria-label="減少數量">−</button>
                <span class="quantity">${item.quantity}</span>
                <button type="button" data-cart-delta="1" data-cart-id="${item.id}" aria-label="增加數量">＋</button>
                <button class="remove-button" type="button" data-remove-cart="${item.id}">刪除</button>
              </div>
            </div>
          </article>`).join('')}
      </div>
    </section>
    <div class="cart-total-bar">
      <div><span class="order-total-label">訂單總金額</span><span class="order-total-value">$${total}</span></div>
      <button class="confirm-button" type="button" data-action="submit-order">✓ 確認送出訂單</button>
    </div>`;
}

function showSuccess() {
  modalRoot.innerHTML = `
    <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="success-title">
      <div class="success-modal">
        <div class="success-check" aria-hidden="true">✓</div>
        <h2 id="success-title">訂單已成功送出！</h2>
        <p>廚房正在為您準備餐點。</p>
        <button class="primary-button" type="button" data-action="finish-order">確認</button>
      </div>
    </div>`;
  modalRoot.querySelector('button').focus();
}

function updateCart(id, delta) {
  const item = state.cart.find((entry) => entry.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) state.cart = state.cart.filter((entry) => entry.id !== id);
  updateCartBadge();
  renderCart();
}

function updateCartBadge() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = count;
  cartBadge.hidden = count === 0;
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function render() {
  document.querySelectorAll('.cart-total-bar, .meal-summary').forEach((element) => element.remove());
  switch (state.route) {
    case 'needs': renderNeeds(); break;
    case 'recommendation': renderRecommendation(); break;
    case 'menu': renderMenu(); break;
    case 'cart': renderCart(); break;
    default: renderHome();
  }
  updateCartBadge();
  window.scrollTo({ top: 0, behavior: 'instant' });
  app.focus({ preventScroll: true });
}

function navigate(route, params = {}, replace = false) {
  state.route = route;
  if (params.categoryId) state.categoryId = params.categoryId;
  if (params.menuCategoryId) state.menuCategoryId = params.menuCategoryId;
  const historyState = { route: state.route, categoryId: state.categoryId, menuCategoryId: state.menuCategoryId };
  if (replace) window.history.replaceState(historyState, '');
  else window.history.pushState(historyState, '');
  render();
}

document.addEventListener('click', (event) => {
  const routeTarget = event.target.closest('[data-route]');
  if (routeTarget) {
    navigate(routeTarget.dataset.route);
    return;
  }

  const categoryTarget = event.target.closest('[data-start-category]');
  if (categoryTarget) {
    startCategory(categoryTarget.dataset.startCategory);
    return;
  }

  const menuTarget = event.target.closest('[data-menu-category]');
  if (menuTarget) {
    state.menuCategoryId = menuTarget.dataset.menuCategory;
    window.history.replaceState({ route: 'menu', menuCategoryId: state.menuCategoryId }, '');
    renderMenu();
    return;
  }

  const selectionTarget = event.target.closest('[data-select-type]');
  if (selectionTarget) {
    state.selection[`${selectionTarget.dataset.selectType}Id`] = selectionTarget.dataset.selectId;
    renderRecommendation();
    return;
  }

  const actionTarget = event.target.closest('[data-action]');
  if (actionTarget) {
    switch (actionTarget.dataset.action) {
      case 'add-to-cart': addToCart(); break;
      case 'submit-order': showSuccess(); break;
      case 'finish-order':
        state.cart = [];
        modalRoot.innerHTML = '';
        updateCartBadge();
        navigate('home');
        break;
      case 'service-bell': showToast('服務人員已收到您的呼叫'); break;
      case 'toggle-font':
        document.body.classList.toggle('large-text');
        showToast(document.body.classList.contains('large-text') ? '已切換為較大字體' : '已恢復標準字體');
        break;
      default: break;
    }
    return;
  }

  const quantityTarget = event.target.closest('[data-cart-delta]');
  if (quantityTarget) {
    updateCart(quantityTarget.dataset.cartId, Number(quantityTarget.dataset.cartDelta));
    return;
  }

  const removeTarget = event.target.closest('[data-remove-cart]');
  if (removeTarget) {
    state.cart = state.cart.filter((item) => item.id !== removeTarget.dataset.removeCart);
    updateCartBadge();
    renderCart();
  }
});

window.addEventListener('popstate', (event) => {
  const next = event.state || { route: 'home' };
  state.route = next.route || 'home';
  state.categoryId = next.categoryId || state.categoryId;
  state.menuCategoryId = next.menuCategoryId || state.menuCategoryId;
  if (state.route === 'recommendation' && state.categoryId) {
    const category = getCategory(state.categoryId);
    if (!state.selection || state.selection.categoryId !== state.categoryId) {
      state.selection = { ...category.recommendation, categoryId: state.categoryId };
    }
  }
  render();
});

window.history.replaceState({ route: 'home', menuCategoryId: state.menuCategoryId }, '');
render();
