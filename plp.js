(function () {
  if (window.__plpLoaded) return;
  window.__plpLoaded = true;

  var plp = {};

  plp.state = {
    products: [],
    cart: new Map(),
    isDrawerOpen: false,
    lastFocusedEl: null,
    mounted: false,
    collectionTitle: "",
    collectionSubtitle: ""
  };

  plp.selectors = {
    gridMount: "[data-grid-mount]",
    drawerMount: "[data-drawer-mount]",
    cartCount: "[data-cart-count]",
    toastMount: "[data-toast]",
    cartToggle: "[data-cart-toggle]",
    collectionTitle: "[data-collection-title]",
    collectionSubtitle: "[data-collection-subtitle]"
  };

  plp.constants = {
  	EVT_CART_UPDATED: "plp:cart-updated"
  };

  plp.domUtils = {
    emitCustomEvent: function (opts) {
    var event = new CustomEvent(opts.eventName, {
      detail: opts.detail || {},
      bubbles: opts.bubbles !== false,
      cancelable: opts.cancelable === true
    });

    document.dispatchEvent(event);
  }
};

  plp.bootstrap = function (config) {
    if (!config || !Array.isArray(config.products)) {
      console.warn("PLP bootstrap: no valid config found");
      plp.state.products = [];
      plp.state.mounted = false;
      return;
    }
    plp.state.products = config.products;
    plp.state.collectionTitle = config.collectionTitle || "";
    plp.state.collectionSubtitle = config.collectionSubtitle || "";
    plp.state.mounted = true;

    console.log("PLP bootstrap: ready to render", plp.state.products);
    console.log("PLP bootstrap: event binding pending");

    plp.render.heading();
    plp.render.grid();
    plp.render.drawer();
    plp.render.cartCount();
    plp.events.bind();
  };

  plp.render = {};

  plp.render.heading=function()
  {
	//Populate collection title/subtitle
    var titleEl = document.querySelector(plp.selectors.collectionTitle);
    var subEl = document.querySelector(plp.selectors.collectionSubtitle);
    if (titleEl) 
	titleEl.textContent = plp.state.collectionTitle || "";
    if (subEl) 
	subEl.textContent = plp.state.collectionSubtitle || "";
  };

  plp.render.grid = function () {
    var mount = document.querySelector(plp.selectors.gridMount);
    if (!mount) {
      console.warn("PLP render.grid: grid mount not found");
      return;
    }

    var products = plp.state.products;
    if (!Array.isArray(products) || products.length === 0) {
      mount.innerHTML = "<p>No products available.</p>";
      return;
    }

    var cards = products.map(function (product) {
      var id = product.id;
      var name = product.name;
      var category = product.category;
      var price = product.price;
      var compareAt = product.compareAt;
      var gradient = product.gradient;
      var variants = product.variants;

      var variantSelect = `
        <select data-product-id="${id}" class="plpVariantSelect">
          ${variants.map(function (variant) {
            return `
              <option value="${variant.id}">
                ${variant.name}
              </option>
            `;
          }).join("")}
        </select>
      `;

      return `
        <div class="plpCard" data-product-id="${id}">
          <div class="plpCardImage" style="background:${gradient};"></div>
          <h2 class="plpCardName">${name}</h2>
          <p class="plpCardPrice">₹${price}</p>
          ${compareAt ? `<p class="plpCardCompare">Was ₹${compareAt}</p>` : ""}
          <p class="plpCardCategory">${category}</p>
          <div class="plpCardControls">
  	   ${variantSelect}
 	  <button class="plpAddBtn" data-product-id="${id}">
           Add
          </button>
	</div>
        </div>
      `;
    });

    mount.innerHTML = cards.join("");
  };

  plp.render.drawer = function () {
  	var mount = document.querySelector(plp.selectors.drawerMount);

  	if (!mount) {
    		console.warn("PLP render.drawer: drawer mount not found");
    		return;
  	}

  	var cart = plp.state.cart;

  	if (cart.size === 0) {
    		mount.innerHTML = `
  <div class="plpDrawerScrim" data-cart-scrim></div>

  <div class="plpDrawerPanel">
    <div class="plpDrawerHeader">
      <h2>Your cart</h2>

      <button
        class="plpCartCloseBtn"
        data-cart-close
        aria-label="Close cart"
      >
        ×
      </button>
    </div>

    <div class="plpCartEmpty">
      Your cart is empty.
    </div>
  </div>
`;

    		return;
  	}

  	var items = Array.from(cart.entries());
	var subtotal = 0;

  	var cartItems = items.map(function (entry) {
    		var cartKey = entry[0];
    		var item = entry[1];

    		var product = plp.state.products.find(function (product) {
      			return product.id === item.productId;
    		});

    		if (!product) {
      			return "";
    		}

  		var lineTotal = product.price * item.quantity;
		subtotal += lineTotal;

    		var variant = product.variants.find(function (variant) {
      			return variant.id === item.variantId;
    		});

    		var variantName = variant ? variant.name : item.variantId;

    		return `
      			<div class="plpCartItem" data-cart-key="${cartKey}">
			<div class="plpCartItemImage" style="background:${product.gradient};"></div>
        		<div>
          		<strong>${product.name}</strong>
          		<div>${variantName}</div>
			<div>₹${lineTotal}</div>
        		</div>

        		<div class="plpCartItemActions">
          		<button class="plpCartQtyBtn" data-cart-action="decrease" data-cart-key="${cartKey}">
            		−
          		</button>

          		<span>${item.quantity}</span>

          		<button class="plpCartQtyBtn"
            			data-cart-action="increase"
            			data-cart-key="${cartKey}"
          		>
            		+
          	</button>

          	<button class="plpCartRemoveBtn" data-cart-action="remove" data-cart-key="${cartKey}">
            	Remove
          	</button>
        	</div>
      		</div>
    `;
  }).join("");

  mount.innerHTML = `
  <div class="plpDrawerScrim" data-cart-scrim></div>

  <div class="plpDrawerPanel">
    <div class="plpDrawerHeader">
      <h2>Your cart</h2>

      <button
        class="plpCartCloseBtn"
        data-cart-close
        aria-label="Close cart"
      >
        ×
      </button>
    </div>

    <div class="plpCartItems">
      ${cartItems}
    </div>
  
    <div class="plpCartSubtotal">
  <strong>Subtotal</strong>
  <strong>₹${subtotal}</strong>
</div>

<button class="plpCheckoutBtn" data-cart-action="checkout">
  Checkout
</button>
  </div>
`;
};

plp.render.cartCount = function () {
  var countEl = document.querySelector(plp.selectors.cartCount);

  if (!countEl) {
    return;
  }

  var count = 0;

  plp.state.cart.forEach(function (item) {
    count += item.quantity;
  });

  countEl.textContent = count;
  countEl.hidden = count === 0;
};

plp.render.toast = function (message) {
  var toast = document.querySelector(plp.selectors.toastMount);

  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("plpToastVisible");

  setTimeout(function () {
    toast.classList.remove("plpToastVisible");
  }, 1500);
};

plp.closeDrawer = function () {

  var drawer = document.querySelector(plp.selectors.drawerMount);

  if (!drawer) {
    return;
  }

  plp.state.isDrawerOpen = false;
  drawer.setAttribute("aria-hidden", "true");

  if (plp.state.lastFocusedEl) {
    plp.state.lastFocusedEl.focus();
  }
};

plp.openDrawer = function () {
  var drawer = document.querySelector(plp.selectors.drawerMount);

  if (!drawer) {
    return;
  }

  plp.state.lastFocusedEl = document.activeElement;
  plp.state.isDrawerOpen = true;

  plp.render.drawer();

  drawer.setAttribute("aria-hidden", "false");
};

  plp.events = {};

plp.events.bind = function () {

  var grid = document.querySelector(plp.selectors.gridMount);

  if (!grid) {
    console.warn("PLP events: grid mount not found");
    return;
  }

  grid.addEventListener("click", function (event) {

    var button = event.target.closest(".plpAddBtn");

    if (!button) {
      return;
    }

    var productId = button.dataset.productId;

    var select = button
      .closest(".plpCard")
      .querySelector(".plpVariantSelect");

    var variantId = select.value;

    var cartKey = productId + "::" + variantId;

    var existingItem = plp.state.cart.get(cartKey);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      plp.state.cart.set(cartKey, {
        productId: productId,
        variantId: variantId,
        quantity: 1
      });
    }

    plp.domUtils.emitCustomEvent({
  eventName: plp.constants.EVT_CART_UPDATED,
  detail: {
    cart: plp.state.cart,
    action: "add"
  }
});

    console.log("Cart:", plp.state.cart);
  });


  var cartToggle = document.querySelector(plp.selectors.cartToggle);

  if (cartToggle) {
  cartToggle.addEventListener("click", function () {
    plp.openDrawer();
  });
}


  var drawer = document.querySelector(plp.selectors.drawerMount);

  if (drawer) {

    drawer.addEventListener("click", function (event) {

      var scrim = event.target.closest("[data-cart-scrim]");

     if (scrim) {
      plp.closeDrawer();
  	return;
     }

    var closeButton = event.target.closest("[data-cart-close]");

    if (closeButton) {
      plp.closeDrawer();
      return;
    }


	var checkoutButton = event.target.closest("[data-cart-action='checkout']");

if (checkoutButton) {
  if (plp.state.cart.size === 0) {
    return;
  }

  plp.render.toast("Checkout started");
  console.log("Checkout:", plp.state.cart);

  return;
}
      var actionButton = event.target.closest("[data-cart-action]");

      if (!actionButton) {
        return;
      }

      var action = actionButton.dataset.cartAction;
      var cartKey = actionButton.dataset.cartKey;

      var item = plp.state.cart.get(cartKey);

      if (!item) {
        return;
      }

      if (action === "increase") {
        item.quantity += 1;
      }

      if (action === "decrease") {
        item.quantity -= 1;

        if (item.quantity <= 0) {
          plp.state.cart.delete(cartKey);
        }
      }

      if (action === "remove") {
        plp.state.cart.delete(cartKey);
      }

      plp.domUtils.emitCustomEvent({
  eventName: plp.constants.EVT_CART_UPDATED,
  detail: {
    cart: plp.state.cart,
    action: action
  }
});
    });

  
  }

document.addEventListener("keydown", function (event) {

  	if (event.key !== "Escape") {
    	return;
  	}

  	if (!plp.state.isDrawerOpen) {
    	return;
  	}

  	plp.closeDrawer();
});

document.addEventListener(
  plp.constants.EVT_CART_UPDATED,
  function (event) {
    plp.render.drawer();
    plp.render.cartCount();

    if (event.detail.action === "add") {
      plp.render.toast("Added to cart");
    } else {
      plp.render.toast("Cart updated");
    }
  }
);

};


  window.plp = plp;
  plp.bootstrap(window.shopifyLiquidValuesPLP);
})();
