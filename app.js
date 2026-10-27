'use strict';

// Sample catalogue: update these records when real product data is available.
const products = [
  {id:'hoops',name:'The Twist Hoops',category:'Earrings',finish:'gold',finishLabel:'Gold tone',price:1250,comparePrice:1500,image:'hero-hoops.jpg',tag:'The everyday edit',note:'A little golden hour.',description:'Sculptural twists, a warm golden finish, and just the right amount of presence. Meet the hoops that make an ordinary day feel a little more considered.',sizes:['One size'],details:'Twisted hoop silhouette with a gold-tone finish. Decorative fashion jewellery. Product materials and dimensions should be confirmed with the store before a real purchase.'},
  {id:'pendant',name:'Emerald Muse Pendant',category:'Necklaces',finish:'gold',finishLabel:'Gold tone · Green stone',price:1850,comparePrice:0,image:'pendant.jpg',tag:'A touch of colour',note:'Your own little statement.',description:'A deep green geometric stone, framed in warm golden tones. A little colour to keep close, beautiful on its own or layered with your favourite fine chains.',sizes:['One size'],details:'Geometric pendant with a green decorative stone and gold-tone chain. The sample photograph illustrates the design; it does not certify gemstone type or metal purity.'},
  {id:'ring',name:'The Halo Ring',category:'Rings',finish:'silver',finishLabel:'Silver tone · Clear stone',price:1450,comparePrice:1750,image:'ring.jpg',tag:'A little occasion',note:'A light-catching little detail.',description:'A bright centre stone, a delicate halo, and a band with just a little extra sparkle. For the days you want your smallest details to shine.',sizes:['US 6','US 7','US 8'],details:'Clear decorative centre stone with a halo setting and split shoulders. Silver-tone fashion jewellery. US sizes are sample options for the checkout preview.'},
  {id:'layered',name:'Golden Link Bracelet',category:'Bracelets',finish:'gold',finishLabel:'Gold tone',price:1150,comparePrice:0,image:'layered.jpg',tag:'Keep it golden',note:'A link to your everyday.',description:'Open oval links and a warm golden finish. An uncomplicated favourite that adds a little character to a crisp shirt, soft knit or your everyday stack.',sizes:['One size'],details:'Oval-link chain bracelet with a gold-tone finish. The design is shown in a lifestyle photograph. Confirm actual length, fastening and materials before purchasing.'},
  {id:'pearl',name:'Midnight Drop Earrings',category:'Earrings',finish:'silver',finishLabel:'Silver tone · Blue stone',price:1650,comparePrice:1950,image:'pearl.jpg',tag:'The evening edit',note:'For after-dark moments.',description:'Deep blue centres framed with light-catching details. An expressive pair for an evening to remember, or simply a day that deserves a little drama.',sizes:['One size'],details:'Blue decorative stones in a silver-tone drop design, surrounded by clear stone details. The sample catalogue does not represent certified precious gemstones.'},
  {id:'bracelet',name:'Rosé Link Bracelet',category:'Bracelets',finish:'rose',finishLabel:'Rose-gold tone',price:1350,comparePrice:0,image:'bracelet.jpg',tag:'Softly, beautifully',note:'A softer kind of sparkle.',description:'Soft rose tones and delicate, light-catching links. A graceful little finishing touch, whether you wear it solo or beside a favourite watch.',sizes:['One size'],details:'Curved linked motifs with small decorative stones and a rose-gold-tone finish. Materials and fit are illustrative until confirmed by the store.'},
  {id:'keepsake',name:'Pearl Keepsake Necklace',category:'Necklaces',finish:'silver',finishLabel:'Pearl style · Silver-tone detail',price:2450,comparePrice:2850,image:'pearl-necklace.jpg',tag:'The keepsake edit',note:'A little timeless wonder.',description:'A pearl-style strand with an intricate silver-tone detail. An occasion piece with a quiet kind of beauty, for a gift or a little moment of your own.',sizes:['One size'],details:'White pearl-style beads and a decorative clasp, pictured in a jewellery box. The photograph does not establish pearl origin. Confirm length, materials and included packaging with the store.'},
  {id:'rose-ring',name:'Rosé Halo Ring',category:'Rings',finish:'gold',finishLabel:'Gold tone · Pink-purple stone',price:1750,comparePrice:2100,image:'additional-ring.jpg',tag:'A little colour story',note:'For a moment all your own.',description:'A rosy, rectangular centre framed by a delicate halo. Warm golden tones meet a little colour, in a ring that feels quietly special.',sizes:['US 6','US 7','US 8'],details:'Rectangular pink-purple decorative stone with a clear halo and gold-tone band. All listed sizes are sample selections, and do not indicate live inventory.'}
];
const categories = ['All','Earrings','Necklaces','Rings','Bracelets'];
const IMAGE_BASE = 'assets/images/';
const BAG_KEY = 'ibadah-jewellers-bag-v2';
const WISHLIST_KEY = 'ibadah-jewellers-wishlist-v1';
const FREE_DELIVERY = 2500;
const WRAP_FEE = 100;
const $ = id => document.getElementById(id);
const productById = id => products.find(p=>p.id===id);
const imageFor = product => IMAGE_BASE+product.image;
const money = amount => '৳'+new Intl.NumberFormat('en-BD').format(amount);
const escapeHTML = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon = (name,classes='') => `<svg class="icon ${classes}" aria-hidden="true"><use href="#icon-${name}"/></svg>`;
const storageRead = key => {try{return JSON.parse(localStorage.getItem(key));}catch{return null;}};
const storageWrite = (key,value) => {try{localStorage.setItem(key,JSON.stringify(value));}catch{/* Browsing and the shopping bag still work without storage. */}};
const defaultSize = p => p.sizes.includes('US 7') ? 'US 7' : p.sizes[0];
const itemKey = (id,size) => `${id}::${size}`;
let filters={category:'All',query:'',finishes:[],maxPrice:3000,savedOnly:false};
let wishlist=readWishlist();
let bag=readBag();
let deliveryZone='dhaka';
let fulfillment='delivery';
let selectedProduct=null;
let selectedSize='';
let detailQuantity=1;
let resumeProductAfterSize=false;
let heroSlide=0;

function readWishlist(){
  const saved=storageRead(WISHLIST_KEY);
  return Array.isArray(saved) ? [...new Set(saved.filter(id=>productById(id)))] : [];
}
function readBag(){
  const saved=storageRead(BAG_KEY);
  if(saved && typeof saved==='object' && Array.isArray(saved.items)){
    const unique=new Map();
    for(const item of saved.items){
      if(!item || typeof item!=='object')continue;
      const p=productById(item.productId);
      if(!p || !p.sizes.includes(item.size) || !Number.isInteger(item.quantity) || item.quantity<1 || item.quantity>99)continue;
      const key=itemKey(p.id,item.size);
      if(!unique.has(key))unique.set(key,{key,productId:p.id,size:item.size,quantity:item.quantity});
    }
    const items=[...unique.values()];
    return {items,giftWrap:items.length>0 && saved.giftWrap===true,coupon:items.length>0 && saved.coupon==='IBADAH10' ? 'IBADAH10' : ''};
  }
  const legacy=storageRead('nira-shopping-bag-v1');
  const items=[];
  if(legacy && typeof legacy==='object' && !Array.isArray(legacy)){
    for(const p of products){const quantity=legacy[p.id];if(Number.isInteger(quantity)&&quantity>0&&quantity<=99){const size=defaultSize(p);items.push({key:itemKey(p.id,size),productId:p.id,size,quantity});}}
  }
  return {items,giftWrap:false,coupon:''};
}
function saveBag(){
  if(!bag.items.length){bag.giftWrap=false;bag.coupon='';$('giftMessage').value='';}
  storageWrite(BAG_KEY,bag);
}
function totals(){
  const count=bag.items.reduce((sum,item)=>sum+item.quantity,0);
  const subtotal=bag.items.reduce((sum,item)=>sum+productById(item.productId).price*item.quantity,0);
  const discount=bag.coupon==='IBADAH10' ? Math.round(subtotal*.1) : 0;
  const merchandise=subtotal-discount;
  const wrapping=count&&bag.giftWrap ? WRAP_FEE : 0;
  const shipping=!count||fulfillment==='pickup'||merchandise>=FREE_DELIVERY ? 0 : deliveryZone==='outside'?120:80;
  return {count,subtotal,discount,merchandise,wrapping,shipping,total:merchandise+wrapping+shipping};
}
function notify(message){
  $('toastMessage').textContent=message;
  bootstrap.Toast.getOrCreateInstance($('shopToast'),{delay:3000}).show();
}
function showModal(id){
  const next=$(id);
  const current=document.querySelector('.modal.show,.offcanvas.show');
  if(current && current!==next){
    const type=current.classList.contains('modal')?'modal':'offcanvas';
    current.addEventListener(`hidden.bs.${type}`,()=>bootstrap.Modal.getOrCreateInstance(next).show(),{once:true});
    (type==='modal'?bootstrap.Modal:bootstrap.Offcanvas).getOrCreateInstance(current).hide();
  }else bootstrap.Modal.getOrCreateInstance(next).show();
}
function hideDrawer(id){bootstrap.Offcanvas.getOrCreateInstance($(id)).hide();}
function goToSection(id,updateHash=true){
  const target=id ? $(id) : document.body;
  if(!target)return;
  const scroll=()=>{
    const top=id ? target.getBoundingClientRect().top+window.scrollY-$('siteHeader').offsetHeight-20 : 0;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top:Math.max(0,top),behavior:reduced?'auto':'smooth'});
    if(updateHash)history.replaceState(null,'',id?'#'+id:'#');
    if(id==='main')target.focus({preventScroll:true});
  };
  const drawer=document.querySelector('.offcanvas.show');
  if(drawer){drawer.addEventListener('hidden.bs.offcanvas',scroll,{once:true});bootstrap.Offcanvas.getOrCreateInstance(drawer).hide();}else scroll();
}

function renderCategoryTabs(){
  $('shopCategories').innerHTML=categories.map(category=>`<button class="shop-tab ${filters.category===category?'is-active':''}" data-category="${category}" aria-pressed="${filters.category===category}">${category==='All'?'All pieces':category}</button>`).join('');
}
function filteredProducts(){
  const query=filters.query.trim().toLowerCase();
  const result=products.filter(p=>(filters.category==='All'||p.category===filters.category)&&(!query||`${p.name} ${p.category} ${p.finishLabel}`.toLowerCase().includes(query))&&(!filters.finishes.length||filters.finishes.includes(p.finish))&&p.price<=filters.maxPrice&&(!filters.savedOnly||wishlist.includes(p.id)));
  const sort=$('productSort').value;
  if(sort==='price-asc')result.sort((a,b)=>a.price-b.price);
  if(sort==='price-desc')result.sort((a,b)=>b.price-a.price);
  if(sort==='name')result.sort((a,b)=>a.name.localeCompare(b.name));
  return result;
}
function renderProducts(){
  const visible=filteredProducts();
  $('productGrid').innerHTML=visible.map(p=>`<article class="product-card"><div class="product-photo"><button class="product-image-button" data-view="${p.id}" aria-label="View ${escapeHTML(p.name)}"><img src="${imageFor(p)}" alt="${escapeHTML(p.name)}" width="640" height="800" loading="lazy"></button><span class="product-tag">${escapeHTML(p.tag)}</span><button class="save-product ${wishlist.includes(p.id)?'is-saved':''}" data-save="${p.id}" aria-label="${wishlist.includes(p.id)?'Remove':'Save'} ${escapeHTML(p.name)} ${wishlist.includes(p.id)?'from':'to'} wishlist" aria-pressed="${wishlist.includes(p.id)}">${icon('heart')}</button><button class="quick-add" data-quick-add="${p.id}" aria-label="${p.sizes.length>1?'Choose size for':'Add'} ${escapeHTML(p.name)}${p.sizes.length>1?'':' to bag'}"><span>${p.sizes.length>1?'Choose your size':'Add a little to your bag'}</span>${icon('plus')}</button></div><div class="product-information"><div class="product-meta"><span>${p.category}</span><span class="finish-dot finish-${p.finish}" title="${escapeHTML(p.finishLabel)}"></span></div><h3><button class="product-name" data-view="${p.id}">${escapeHTML(p.name)}</button></h3><div class="product-price"><span>${money(p.price)}</span>${p.comparePrice?`<del>${money(p.comparePrice)}</del>`:''}</div><div class="product-description-line">${escapeHTML(p.note)}</div></div></article>`).join('');
  $('resultCount').textContent=`${visible.length} ${visible.length===1?'piece':'pieces'}`;
  $('emptyProducts').hidden=visible.length>0;
  renderFilterChips();
}
function renderFilterChips(){
  const chips=[];
  const names={gold:'Gold tone',silver:'Silver tone',rose:'Rose-gold tone'};
  for(const finish of filters.finishes)chips.push(`<button class="filter-chip" data-clear-finish="${finish}">${names[finish]} ${icon('close')}</button>`);
  if(filters.maxPrice<3000)chips.push(`<button class="filter-chip" data-clear-budget>Under ${money(filters.maxPrice)} ${icon('close')}</button>`);
  if(filters.savedOnly)chips.push(`<button class="filter-chip" data-clear-saved>Saved pieces ${icon('close')}</button>`);
  if(filters.query)chips.push(`<button class="filter-chip" data-clear-query>“${escapeHTML(filters.query)}” ${icon('close')}</button>`);
  $('activeFilters').innerHTML=chips.join('');
  const count=filters.finishes.length+(filters.maxPrice<3000?1:0)+(filters.savedOnly?1:0);
  $('filterCount').textContent=count;$('filterCount').hidden=count===0;
}
function syncFilterForm(){
  document.querySelectorAll('#filterForm input[name=finish]').forEach(input=>input.checked=filters.finishes.includes(input.value));
  $('priceRange').value=filters.maxPrice;$('budgetOutput').textContent=money(filters.maxPrice);$('savedOnly').checked=filters.savedOnly;
}
function selectCategory(category,resetExtra=false){
  if(!categories.includes(category))return;
  filters.category=category;filters.query='';$('shopSearch').value='';
  if(resetExtra){filters.finishes=[];filters.maxPrice=3000;filters.savedOnly=false;syncFilterForm();}
  renderCategoryTabs();renderProducts();
}
function resetFilters(){
  filters={category:'All',query:'',finishes:[],maxPrice:3000,savedOnly:false};
  $('shopSearch').value='';$('productSort').value='featured';syncFilterForm();renderCategoryTabs();renderProducts();
}

function toggleWishlist(id){
  const p=productById(id);if(!p)return;
  const adding=!wishlist.includes(id);
  wishlist=adding?[...wishlist,id]:wishlist.filter(value=>value!==id);
  storageWrite(WISHLIST_KEY,wishlist);
  renderProducts();renderWishlist();
  if(selectedProduct===id)updateDetailSave();
  notify(adding?`${p.name}, saved for a little later.`:`${p.name} removed from your wishlist.`);
}
function renderWishlist(){
  $('wishlistCount').textContent=wishlist.length;$('wishlistCount').hidden=wishlist.length===0;
  if(!wishlist.length){$('wishlistItems').innerHTML=`<div class="empty-state">${icon('heart')}<h3>A little room for favourites.</h3><p>Tap the heart on a piece you love. We'll keep it here for a little later.</p><button class="button button-dark" data-explore-from="wishlistPanel">Find your favourite ${icon('arrow')}</button></div>`;return;}
  $('wishlistItems').innerHTML=wishlist.map(id=>{const p=productById(id);return `<article class="wishlist-item"><img src="${imageFor(p)}" alt="${escapeHTML(p.name)}" width="100" height="125"><div><h3><button class="product-name" data-view="${p.id}">${escapeHTML(p.name)}</button></h3><p>${money(p.price)} · ${escapeHTML(p.finishLabel)}</p><button class="button button-dark" data-quick-add="${p.id}">${p.sizes.length>1?'Choose a size':'Add to bag'} ${icon('plus')}</button><br><button class="editorial-link" data-save="${p.id}">Remove from wishlist</button></div></article>`;}).join('');
}

function addToBag(id,size,quantity=1){
  const p=productById(id);
  if(!p||!p.sizes.includes(size)||!Number.isInteger(quantity)||quantity<1)return;
  const key=itemKey(id,size);const existing=bag.items.find(item=>item.key===key);
  if((existing?.quantity||0)+quantity>99){notify('A maximum of 99 pieces per size can be added.');return;}
  if(existing)existing.quantity+=quantity;else bag.items.push({key,productId:id,size,quantity});
  saveBag();renderCart();notify(`${p.name} added to your little treasures.`);
}
function quickAdd(id){const p=productById(id);if(!p)return;if(p.sizes.length>1)openProduct(id);else addToBag(id,p.sizes[0]);}
function changeQuantity(key,delta){
  const item=bag.items.find(item=>item.key===key);if(!item||![-1,1].includes(delta))return;
  item.quantity=Math.min(99,item.quantity+delta);
  if(item.quantity<=0)bag.items=bag.items.filter(item=>item.key!==key);
  saveBag();renderCart();
}
function removeItem(key){bag.items=bag.items.filter(item=>item.key!==key);saveBag();renderCart();}
function summaryHTML(t,{removableCoupon=false}={}){
  return `<div class="summary-row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>${t.discount?`<div class="summary-row discount"><span>IBADAH10 · 10% off ${removableCoupon?'<button class="remove-coupon" data-remove-coupon>Remove</button>':''}</span><span>−${money(t.discount)}</span></div>`:''}${t.wrapping?`<div class="summary-row"><span>A little gift wrap</span><span>${money(t.wrapping)}</span></div>`:''}<div class="summary-row"><span>${fulfillment==='pickup'?'Collection at Mirpur 1':'Delivery'}</span><span>${t.shipping?money(t.shipping):'Complimentary'}</span></div><div class="summary-row total"><span>Total</span><span>${money(t.total)}</span></div>`;
}
function renderCart(){
  const t=totals();
  $('cartCount').textContent=t.count;$('cartTitleCount').textContent=`(${t.count})`;
  for(const id of ['deliveryProgress','cartExtras','cartSummary','cartFooter'])$(id).hidden=!t.count;
  $('giftWrap').checked=bag.giftWrap;$('giftMessageField').hidden=!bag.giftWrap;
  if(!t.count){$('cartItems').innerHTML=`<div class="empty-state">${icon('bag')}<h3>Your bag is waiting<br>for a little sparkle.</h3><p>Find something that feels like you. We'll keep your favourites right here.</p><button class="button button-dark" data-explore-from="cartPanel">Discover the collection ${icon('arrow')}</button></div>`;$('couponMessage').textContent='';$('couponInput').value='';}
  else{
    $('deliveryMessage').textContent=fulfillment==='pickup'?'A little collection moment — Mirpur 1.':t.merchandise>=FREE_DELIVERY?'A little extra joy. Your delivery is complimentary.':`You're ${money(FREE_DELIVERY-t.merchandise)} away from complimentary delivery.`;
    $('deliveryMeter').style.width=Math.min(100,t.merchandise/FREE_DELIVERY*100)+'%';
    $('cartItems').innerHTML=bag.items.map(item=>{const p=productById(item.productId);return `<article class="bag-item"><img src="${imageFor(p)}" alt="${escapeHTML(p.name)}" width="91" height="116"><div><div class="bag-item-top"><h3>${escapeHTML(p.name)}</h3><button class="icon-button" data-remove-item="${escapeHTML(item.key)}" aria-label="Remove ${escapeHTML(p.name)}${p.sizes.length>1?' '+escapeHTML(item.size):''}">${icon('close')}</button></div><p>${escapeHTML(p.finishLabel)}</p>${p.sizes.length>1?`<p>Size: ${escapeHTML(item.size)}</p>`:''}<div class="bag-item-bottom"><div class="quantity-control" role="group" aria-label="Quantity for ${escapeHTML(p.name)} ${escapeHTML(item.size)}"><button data-quantity="${escapeHTML(item.key)}" data-delta="-1" aria-label="Decrease quantity of ${escapeHTML(p.name)} ${escapeHTML(item.size)}">${icon('minus')}</button><span>${item.quantity}</span><button data-quantity="${escapeHTML(item.key)}" data-delta="1" ${item.quantity>=99?'disabled':''} aria-label="Increase quantity of ${escapeHTML(p.name)} ${escapeHTML(item.size)}">${icon('plus')}</button></div><span class="bag-item-price">${money(p.price*item.quantity)}</span></div></div></article>`;}).join('');
    $('cartSummary').innerHTML=summaryHTML(t,{removableCoupon:true});
    if(bag.coupon){$('couponMessage').textContent='A little treat applied: 10% off your pieces.';$('couponMessage').classList.remove('error');}
  }
  renderCheckout();
}
function applyCoupon(code){
  if(!bag.items.length){notify('Add a little something to your bag first.');return;}
  if(code.trim().toUpperCase()!=='IBADAH10'){$('couponMessage').textContent="That code isn't available. Try IBADAH10 in this preview.";$('couponMessage').classList.add('error');return;}
  bag.coupon='IBADAH10';$('couponInput').value='';saveBag();renderCart();notify('A little treat — 10% off your pieces.');
}

function openProduct(id){
  const p=productById(id);if(!p)return;
  selectedProduct=id;selectedSize=defaultSize(p);detailQuantity=1;
  $('productDetails').innerHTML=`<div class="product-detail-grid"><div class="detail-gallery"><div class="detail-main" id="detailMain"><img src="${imageFor(p)}" alt="${escapeHTML(p.name)}" width="640" height="800"></div><div class="detail-thumbnails"><button class="detail-thumbnail is-active" data-detail-zoom="false" aria-label="Show full product photograph" aria-pressed="true"><img src="${imageFor(p)}" alt=""></button><button class="detail-thumbnail" data-detail-zoom="true" aria-label="Show closer product detail" aria-pressed="false"><img src="${imageFor(p)}" alt=""></button></div><p class="detail-image-hint">A closer look at your next favourite.</p></div><div class="detail-information"><span class="eyebrow">THE IBADAH EDIT / ${p.category.toUpperCase()}</span><h2 id="productTitle">${escapeHTML(p.name)}</h2><div class="detail-price"><span>${money(p.price)}</span>${p.comparePrice?`<del>${money(p.comparePrice)}</del>`:''}</div><p class="detail-description">${escapeHTML(p.description)}</p><div class="detail-field-heading"><span>THE FINISH</span></div><div class="detail-finish"><span class="finish-dot finish-${p.finish}"></span>${escapeHTML(p.finishLabel)}</div>${p.sizes.length>1?`<div class="detail-field-heading"><span>YOUR SIZE</span><button class="inline-button" data-size-guide>Size guide</button></div><div class="size-options" role="group" aria-label="Choose ring size">${p.sizes.map(size=>`<button class="size-option ${size===selectedSize?'is-active':''}" data-size="${size}" aria-pressed="${size===selectedSize}">${size.replace('US ','')}</button>`).join('')}</div>`:''}<div class="detail-purchase"><div class="quantity-control" role="group" aria-label="Product quantity"><button data-detail-quantity="-1" aria-label="Decrease product quantity">${icon('minus')}</button><span id="detailQuantity">1</span><button data-detail-quantity="1" aria-label="Increase product quantity">${icon('plus')}</button></div><button class="button button-dark" id="detailAdd">Add to your bag ${icon('plus')}</button></div><button class="detail-save" id="detailSave" data-save="${p.id}"></button><div class="accordion accordion-flush" id="detailAccordion"><div class="accordion-item"><h3 class="accordion-header"><button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#detailDescription" aria-expanded="false" aria-controls="detailDescription">The little details</button></h3><div id="detailDescription" class="accordion-collapse collapse" data-bs-parent="#detailAccordion"><div class="accordion-body">${escapeHTML(p.details)}</div></div></div><div class="accordion-item"><h3 class="accordion-header"><button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#detailDelivery" aria-expanded="false" aria-controls="detailDelivery">Delivery & a little care</button></h3><div id="detailDelivery" class="accordion-collapse collapse" data-bs-parent="#detailAccordion"><div class="accordion-body">Preview delivery: ৳80 within Dhaka, ৳120 outside Dhaka; complimentary at ৳2,500 after discounts. Keep your piece dry, away from perfume, and gently wipe with a soft cloth.</div></div></div></div><p class="detail-demo-note">Sample catalogue. Prices, finishes and sizes are illustrative; confirm real availability with the store.</p></div></div>`;
  updateDetailSave();showModal('productModal');
}
function updateDetailSave(){
  const el=$('detailSave');if(!el||!selectedProduct)return;
  const saved=wishlist.includes(selectedProduct);el.classList.toggle('is-saved',saved);el.setAttribute('aria-pressed',saved);el.innerHTML=icon('heart')+(saved?'Saved to your little favourites':'Save for a little later');
}
function renderSearch(){
  const query=$('globalSearch').value.trim().toLowerCase();
  const found=products.filter(p=>!query||`${p.name} ${p.category} ${p.finishLabel}`.toLowerCase().includes(query));
  $('searchResults').innerHTML=found.length?found.map(p=>`<button class="search-result" data-view="${p.id}"><img src="${imageFor(p)}" alt="" width="52" height="62"><span><strong>${escapeHTML(p.name)}</strong><small>${p.category} · ${escapeHTML(p.finishLabel)}</small></span><span>${money(p.price)}</span></button>`).join(''):'<p class="search-empty">No little treasures found. Try a category or a different word.</p>';
}

function renderCheckout(){
  const t=totals();
  $('checkoutItems').innerHTML=bag.items.map(item=>{const p=productById(item.productId);return `<div class="checkout-line-item"><img src="${imageFor(p)}" alt="${escapeHTML(p.name)}" width="52" height="65"><span>${escapeHTML(p.name)}<small>${p.sizes.length>1?escapeHTML(item.size)+' · ':''}Qty ${item.quantity}</small></span><span>${money(p.price*item.quantity)}</span></div>`;}).join('');
  $('checkoutSummary').innerHTML=`<div class="bag-summary">${summaryHTML(t)}</div>`;
  if(!t.count && $('checkoutModal').classList.contains('show')){
    bootstrap.Modal.getOrCreateInstance($('checkoutModal')).hide();notify('Your bag is empty. Find a little something first.');
  }
}
function syncFulfillment(){
  fulfillment=document.querySelector('input[name=fulfillment]:checked').value;
  const delivery=fulfillment==='delivery';
  $('deliveryFields').hidden=!delivery;
  $('customerAddress').required=delivery;$('customerCity').required=delivery;
  deliveryZone=$('deliveryZone').value;
  renderCart();
}
function previewOrder(event){
  event.preventDefault();if(!bag.items.length)return;
  const name=$('customerName').value.trim();
  if(!name){$('customerName').focus();return;}
  const note=bag.giftWrap?$('giftMessage').value.trim():'';
  const delivery=fulfillment==='pickup'?'Collection at Mirpur 1':`Delivery to ${$('customerCity').value.trim()}`;
  $('previewReceipt').innerHTML=`<p>A little edit for <strong>${escapeHTML(name)}</strong>.</p><p>${escapeHTML(delivery)}</p>${bag.items.map(item=>`<div class="summary-row"><span>${escapeHTML(productById(item.productId).name)}${item.size==='One size'?'':' / '+escapeHTML(item.size)} × ${item.quantity}</span><span>${money(productById(item.productId).price*item.quantity)}</span></div>`).join('')}${summaryHTML(totals())}${note?`<p class="checkout-message">Your little note: “${escapeHTML(note)}”</p>`:''}`;
  $('checkoutFormView').hidden=true;$('checkoutSuccess').hidden=false;
  $('checkoutModal').querySelector('.modal-body').scrollTop=0;
}

const heroSlides=[
  {title:'The pieces<br>we keep <em>close.</em>',description:'For the ordinary days that turn into your favourite memories. Discover jewellery that feels a little more like you.',image:'model-necklace.jpg',alt:'Delicate layered necklaces styled with a soft white blouse',caption:'THE ART OF EVERYDAY ADORNMENT',position:'50% 37%'},
  {title:'A little gold.<br>A lot of <em>you.</em>',description:'An effortless hoop. A favourite golden link. A little warm light, to take with you wherever your day goes.',image:'hero-hoops.jpg',alt:'Sculptural twisted hoop earrings in warm sunlight on pale stones',caption:'SMALL DETAILS / EVERYDAY FAVOURITES',position:'50% 50%'},
  {title:'Your moment.<br>Your <em>colour.</em>',description:'Deep greens, soft pinks, a midnight blue. Discover the little details that tell a colour story all your own.',image:'pendant.jpg',alt:'A deep green geometric pendant with a gold-tone chain',caption:'A LITTLE COLOUR GOES A LONG WAY',position:'50% 50%'}
];
function changeHero(delta){
  heroSlide=(heroSlide+delta+heroSlides.length)%heroSlides.length;const slide=heroSlides[heroSlide];
  $('heroTitle').innerHTML=slide.title;$('heroDescription').textContent=slide.description;
  $('heroImage').src=IMAGE_BASE+slide.image;$('heroImage').alt=slide.alt;$('heroImage').style.objectPosition=slide.position;
  $('heroCaption').textContent=slide.caption;$('heroIndex').textContent=String(heroSlide+1).padStart(2,'0');$('heroImageIndex').textContent='IBADAH / '+String(heroSlide+1).padStart(2,'0');$('heroProgress').style.width=((heroSlide+1)/3*100)+'%';
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)$('heroImage').animate([{opacity:.4},{opacity:1}],{duration:450,easing:'ease-out'});
}
const articles={
  layering:{title:'The art of a little layering.',image:'model-necklace.jpg',body:`<p>There is something beautifully personal about a jewellery stack. No two have to be the same. A favourite chain, a piece you were given, a pendant you chose just because — together, they become a little story only you can tell.</p><h3>Start with a piece you love.</h3><p>Let one piece lead. It might be a pendant with a little colour or a simple chain you wear every day. Put that on first and build around it, instead of trying to make everything compete for attention.</p><h3>Leave a little breathing room.</h3><p>Different lengths help each necklace find its place. Pair a shorter chain with a longer pendant, and check how they sit against the neckline you are wearing. For bracelets, try balancing one open-link piece with a finer silhouette.</p><h3>Keep it feeling like you.</h3><p>Matching every finish is one option, not a rule. Warm and cool tones can work together when you repeat a small detail. The important part is comfort: a stack should move with you, without tangling or feeling heavy. Try two pieces before adding a third.</p><p>And if one piece feels just right on its own? That is a beautiful kind of layering too — the piece, the outfit, and you.</p>`},
  care:{title:'A little care. A lasting sparkle.',image:'layered.jpg',body:`<p>Favourite pieces tend to come along for everything. A few small habits can help them keep their finish and make getting dressed feel a little easier.</p><h3>The last thing on, the first thing off.</h3><p>Allow perfume, moisturiser and other products to dry before putting jewellery on. Remove pieces before showering, swimming, exercising or using cleaning products. Water, friction and chemicals can affect decorative finishes.</p><h3>A gentle little clean.</h3><p>After wearing, gently wipe with a clean, soft, dry cloth. Avoid abrasive polishes, toothpaste, harsh chemicals and ultrasonic cleaners unless the manufacturer specifically recommends them for that exact piece. Decorative stones, coatings and adhesives may need different care.</p><h3>Give each piece its own space.</h3><p>Keep necklaces fastened and separate to reduce tangling. A dry pouch or a lined jewellery box helps limit rubbing and dust. Keep pieces away from direct heat and store delicate stone settings where they will not be knocked by heavier jewellery.</p><p>For a specific material or finish, ask the store for its care instructions. A little attention, after all, is a lovely thing to give your everyday favourites.</p>`},
  gifting:{title:'A gift that feels like them.',image:'pearl-necklace.jpg',body:`<p>The most thoughtful gifts often begin with noticing. The earrings they always reach for. The colour they come back to. The small details that make their style feel unmistakably theirs.</p><h3>Notice their everyday favourites.</h3><p>If they love simple pieces, look for a familiar silhouette with one considered detail. If they enjoy colour, a pendant or a drop earring can feel personal without requiring a complete change of style. Necklaces and earrings can also be easier to choose when you are unsure of a ring size.</p><h3>Think about the moment.</h3><p>A gift does not have to announce itself loudly. A quiet little piece can mark a thank you, a beginning, a birthday or an ordinary day you wanted to make memorable. Picture how they might wear it, rather than choosing only for the occasion.</p><h3>Add a little note.</h3><p>Sometimes the words are what make the piece a keepsake. A short sentence about why you thought of them can mean more than a long message. Our bag includes a gift-wrap and message preview so you can see the finishing touch alongside your pieces.</p><p>For an actual purchase, check materials, sizing, packaging and availability with the store. The nicest little surprise starts with getting the details right.</p>`}
};
function openArticle(id){const article=articles[id];if(!article)return;$('editorialBody').innerHTML=`<img class="article-image" src="${IMAGE_BASE+article.image}" alt="Jewellery inspiration for ${escapeHTML(article.title)}"><h2 id="editorialTitle">${article.title}</h2>${article.body}<button class="editorial-link" data-article-shop>Find your everyday favourite ${icon('arrow')}</button>`;showModal('editorialModal');}

// One delegated listener keeps generated catalogue, bag and wishlist controls consistent.
document.addEventListener('click',event=>{
  const target=event.target;
  let button;
  if((button=target.closest('[data-save]'))){toggleWishlist(button.dataset.save);return;}
  if((button=target.closest('[data-view]'))){openProduct(button.dataset.view);return;}
  if((button=target.closest('[data-quick-add]'))){quickAdd(button.dataset.quickAdd);return;}
  if((button=target.closest('[data-category]'))){selectCategory(button.dataset.category);return;}
  if((button=target.closest('[data-quantity]'))){changeQuantity(button.dataset.quantity,Number(button.dataset.delta));return;}
  if((button=target.closest('[data-remove-item]'))){removeItem(button.dataset.removeItem);return;}
  if((button=target.closest('[data-size]'))){selectedSize=button.dataset.size;document.querySelectorAll('[data-size]').forEach(el=>{const active=el.dataset.size===selectedSize;el.classList.toggle('is-active',active);el.setAttribute('aria-pressed',active);});return;}
  if((button=target.closest('[data-detail-quantity]'))){detailQuantity=Math.min(99,Math.max(1,detailQuantity+Number(button.dataset.detailQuantity)));$('detailQuantity').textContent=detailQuantity;return;}
  if(target.closest('#detailAdd')){addToBag(selectedProduct,selectedSize,detailQuantity);return;}
  if((button=target.closest('[data-detail-zoom]'))){const zoom=button.dataset.detailZoom==='true';$('detailMain').classList.toggle('is-zoomed',zoom);document.querySelectorAll('[data-detail-zoom]').forEach(el=>{const active=el===button;el.classList.toggle('is-active',active);el.setAttribute('aria-pressed',active);});return;}
  if((button=target.closest('[data-clear-finish]'))){filters.finishes=filters.finishes.filter(f=>f!==button.dataset.clearFinish);syncFilterForm();renderProducts();return;}
  if(target.closest('[data-clear-budget]')){filters.maxPrice=3000;syncFilterForm();renderProducts();return;}
  if(target.closest('[data-clear-saved]')){filters.savedOnly=false;syncFilterForm();renderProducts();return;}
  if(target.closest('[data-clear-query]')){filters.query='';$('shopSearch').value='';renderProducts();return;}
  if(target.closest('[data-remove-coupon]')){bag.coupon='';$('couponMessage').textContent='';saveBag();renderCart();return;}
  if((button=target.closest('[data-explore-from]'))){hideDrawer(button.dataset.exploreFrom);goToSection('shop');return;}
  if((button=target.closest('[data-article]'))){openArticle(button.dataset.article);return;}
  if(target.closest('[data-article-shop]')){const modal=$('editorialModal');modal.addEventListener('hidden.bs.modal',()=>goToSection('shop'),{once:true});bootstrap.Modal.getOrCreateInstance(modal).hide();return;}
  if(target.closest('[data-size-guide]')){resumeProductAfterSize=$('productModal').classList.contains('show');showModal('sizeModal');return;}
  const categoryLink=target.closest('[data-category-link]');if(categoryLink)selectCategory(categoryLink.dataset.categoryLink,true);
  const anchor=target.closest('a[href^="#"]');
  if(anchor&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey){const id=anchor.getAttribute('href').slice(1);if(!id||$(id)){event.preventDefault();goToSection(id);}}
});
$('shopSearch').addEventListener('input',event=>{filters.query=event.target.value.trim();renderProducts();});
$('productSort').addEventListener('change',renderProducts);
$('clearAllFilters').addEventListener('click',resetFilters);
$('priceRange').addEventListener('input',event=>$('budgetOutput').textContent=money(Number(event.target.value)));
$('filterPanel').addEventListener('show.bs.offcanvas',syncFilterForm);
$('filterForm').addEventListener('submit',event=>{event.preventDefault();filters.finishes=[...document.querySelectorAll('#filterForm input[name=finish]:checked')].map(input=>input.value);filters.maxPrice=Number($('priceRange').value);filters.savedOnly=$('savedOnly').checked;renderProducts();hideDrawer('filterPanel');});
$('resetDrawerFilters').addEventListener('click',()=>{filters.finishes=[];filters.maxPrice=3000;filters.savedOnly=false;syncFilterForm();renderProducts();});
$('giftWrap').addEventListener('change',event=>{bag.giftWrap=event.target.checked;saveBag();renderCart();});
$('couponForm').addEventListener('submit',event=>{event.preventDefault();applyCoupon($('couponInput').value);});
$('tryCoupon').addEventListener('click',()=>applyCoupon('IBADAH10'));
$('globalSearch').addEventListener('input',renderSearch);
$('searchModal').addEventListener('shown.bs.modal',()=>{$('globalSearch').focus();renderSearch();});
$('searchModal').addEventListener('hidden.bs.modal',()=>{$('globalSearch').value='';});
$('checkoutButton').addEventListener('click',()=>{if(!bag.items.length)return;$('checkoutFormView').hidden=false;$('checkoutSuccess').hidden=true;renderCheckout();showModal('checkoutModal');});
$('checkoutForm').addEventListener('submit',previewOrder);
document.querySelectorAll('input[name=fulfillment]').forEach(input=>input.addEventListener('change',syncFulfillment));
$('deliveryZone').addEventListener('change',syncFulfillment);
$('checkoutModal').addEventListener('hidden.bs.modal',()=>{$('checkoutForm').reset();$('checkoutFormView').hidden=false;$('checkoutSuccess').hidden=true;fulfillment='delivery';deliveryZone='dhaka';$('deliveryFields').hidden=false;$('customerAddress').required=true;$('customerCity').required=true;renderCart();});
$('sizeModal').addEventListener('hidden.bs.modal',()=>{if(resumeProductAfterSize){resumeProductAfterSize=false;bootstrap.Modal.getOrCreateInstance($('productModal')).show();}});
$('heroPrevious').addEventListener('click',()=>changeHero(-1));$('heroNext').addEventListener('click',()=>changeHero(1));
$('shopGifts').addEventListener('click',()=>{resetFilters();filters.maxPrice=1800;syncFilterForm();renderProducts();goToSection('shop');});
$('backToTop').addEventListener('click',()=>goToSection(''));
window.addEventListener('scroll',()=>$('backToTop').hidden=window.scrollY<700,{passive:true});
window.addEventListener('storage',event=>{if(event.key===BAG_KEY||event.key===null){bag=readBag();renderCart();}if(event.key===WISHLIST_KEY||event.key===null){wishlist=readWishlist();renderWishlist();renderProducts();updateDetailSave();}});
$('year').textContent=new Date().getFullYear();renderCategoryTabs();renderProducts();renderWishlist();renderCart();renderSearch();
