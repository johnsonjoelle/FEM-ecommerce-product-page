const prod1URL = './images/image-product-1.jpg';
const prod2URL = './images/image-product-2.jpg';
const prod3URL = './images/image-product-3.jpg';
const prod4URL = './images/image-product-4.jpg';
const productImgs = [prod1URL, prod2URL, prod3URL, prod4URL];

let cart = [];
cartCount = 0;

// Functions to change preview image
function clearActiveImg() {
  $('.thumbnail').removeClass('active');
}
function previewToThumb(imgId){
  for (let i = 0; i < productImgs.length; i++) {
    if (i==imgId) {
      $('#preview-img').attr('src', productImgs[i]);
      $('#preview-img').data('product', imgId);
      changeLightboxImg(imgId);
    }
  }
}
function changePreviewImg(direction){
  let imgId = $('#preview-img').data('product');
  if (direction=='back') {
    if (imgId>0) { imgId-- }
  } else {
    const limit = productImgs.length-1;
    if (imgId<limit) { imgId++ }
  }
  clearActiveImg();
  $('#preview-img').attr('src', productImgs[imgId]);
  $('#preview-img').data('product', imgId);
  $('.product-page .preview-nav').find(`[data-product='${imgId}']`).addClass('active');
  changeLightboxImg(imgId);
}
function changeLightboxImg(imgId) {
  const windowWidth = window.innerWidth;
  if (windowWidth>799) {
    $('#preview-img-lb').attr('src', productImgs[imgId]);
    $('#lightbox .preview-nav').find(`[data-product='${imgId}']`).addClass('active');
  }
}

// Cart Functions
function changeItemCount(operation) {
  let count = parseInt($('#item-count').text());
  if (operation=='minus') {
    if (count>0) {count--}
  } else {
    count++
  }
  $('#item-count').text(count);
}
function addToCart(itemName, count, price) {
  let total;
  cartCount += count;
  if(cart.length!=null && cart.length>0) {
    count += parseInt($('.cart-item-count').text());
    total = price * count;
    cart[0].count = count;
    $('.cart-item-count').text(count);
    $('.cart-item-total').text(`$${total.toFixed(2)}`);
  } else {
    cart.push({name: itemName, count: count, price: price});
    total = price * count;
    let content = `
      <div class="cart-item" data-item-id="0">
        <img class="cart-item-thumb" src="./images/image-product-1-thumbnail.jpg"/>
        <div>
          <p class="cart-item-name">${itemName}</p>
          <p class="cart-item-price">$<span class="single-price">${price.toFixed(2)}</span> x <span class="cart-item-count">${count}</span><span class="cart-item-total">$${total.toFixed(2)}</span></p>
        </div>
        <img class="delete-icon delete-item" src="./images/icon-delete.svg" data-item="0"/>
      </div>`;
    $('.empty-cart').hide();
    $('.cart-items').append(content);
    $('#checkout-btn').show();
  }
  changeCartCount();
}
function removeFromCart(id) {
  $('.cart-items').find(`[data-item-id="${id}"]`).remove();
  cartCount -= cart[id].count;
  cart.splice(id, 1);
  // .pop() method could have been used since this example site only has 1 product
  changeCartCount();
  if (cart.length==null || cart.length==0) {
    $('#checkout-btn').hide();
    $('.empty-cart').show();
  }
}
function changeCartCount(){
  $('#cart-count').text(cartCount);
  if (cartCount>0) {
    $('#cart-count').show();
  } else {
    $('#cart-count').hide();
  }
}

$(window).on("load", function(){
  // Event handling functions

  // SVG Effects and Styling
  const navCart = document.querySelector('.nav-cart .cart-icon').contentDocument;
  const navCartIcon = navCart.getElementById('cart-svg');
  $(navCart).hover(
    function() {
      $(navCartIcon).css('fill', 'hsl(220, 13%, 13%)');
      $(navCart).children().css('cursor', 'pointer');
    },
    function() {
      $(navCartIcon).css('fill', '#69707D');
    }
  );
  if (window.matchMedia("(max-width: 799px)").matches) {
    $(navCartIcon).css('fill', 'hsl(220, 13%, 13%)');
  }
  const btnCart = document.getElementById('btn-cart').contentDocument;
  const btnCartIcon = btnCart.getElementById('cart-svg');
  $(btnCartIcon).css('fill', '#fff');
  $(btnCart).children().css('cursor', 'pointer');
  const closeLB = document.getElementById('close-icon').contentDocument;
  const closeIcon = closeLB.getElementById('close');
  $(closeIcon).css('fill', '#fff');
  $(closeLB).hover(
    function() {
      $(closeIcon).css('fill', 'hsl(26, 100%, 55%)');
      $(closeLB).children().css('cursor', 'pointer');
    },
    function() {
      $(closeIcon).css('fill', '#fff');
    }
  );

  // Image changing
  $('.thumbnail').click(function(){
    let imgId = $(this).data("product");
    clearActiveImg();
    previewToThumb(imgId);
    $(this).addClass('active');
  });
  $('.back-btn').click(function(){
    changePreviewImg('back');
  });
  $('.next-btn').click(function(){
    changePreviewImg('next');
  });

  // Lightbox show and hide
  $('.product-page .preview-main').click(function(){
    const windowWidth = window.innerWidth;
    if (windowWidth>799) {
      document.getElementById('lightbox').showModal();
    }
  });
  $(closeLB).click(function(){
    document.getElementById('lightbox').close();
  });

  // Mobile nav show and hide
  $('#nav-icon').click(function(){
    document.getElementById('mobile-nav').showModal();
  });
  $('#close-mobile-nav').click(function(){
    document.getElementById('mobile-nav').close();
  });

  // Cart events
  $('.minus-btn').click(function(){
    changeItemCount('minus');
  });
  $('.add-btn').click(function(){
    changeItemCount('add');
  });
  $('#add-to-cart').click(function(){
    const count = parseInt($('#item-count').text());
    const itemName = $('#product-title').text();
    const price = parseFloat($('#final-price').text());
    if (count>0) {
      addToCart(itemName, count, price);
    }
  });
  $(btnCart).click(function(){
    const count = parseInt($('#item-count').text());
    const itemName = $('#product-title').text();
    const price = parseFloat($('#final-price').text());
    if (count>0) {
      addToCart(itemName, count, price);
    }
  });
  $(document).on('click', 'body .delete-item', function(){
    // .delete-item is not initially in the html file so it is targetted differently
    let id = $(this).data('item');
    removeFromCart(id);
  });
  $(navCart).click(function(){
    $('.cart').toggle('fast');
  })
});