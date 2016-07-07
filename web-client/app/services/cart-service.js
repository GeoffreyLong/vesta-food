angular
  .module('cartService', [])
  .service('cartService', function() {
    // TODO TODO TODO
    //      Using sessionStorage for testing, switch to localstorage for prod
    //      This will solve any persistency issues

    // Return foodQuantity in the cart as returnQuantity
    // Returns 0 if error
    this.addToCart = function(storeId, food) {
      // TODO I think we want to do this if they don't have storage
      if (!sessionStorage) return 0;

      var cart = [];
      if (sessionStorage.cart) cart = JSON.parse(sessionStorage.cart);

      // NOTE instead of dealing with these booleans, could simply return when found
      // NOTE It would be cool if I could dynamically name the keys
      var foundStore = false;
      var returnQuantity = 0;


      // Iterate through the individual stores in the cart
      cart.forEach(function(storeCart){
        if (storeCart.storeId == storeId) {
          foundStore = true;
          var foundFood = false;

          // Iterate through foods in the matching store cart to see if the food is there
          storeCart.foods.forEach(function(cartFood){
            if (cartFood._id == food._id){
              foundFood = true;
              cartFood.quantity ++;
              returnQuantity = cartFood.quantity;
            }
          });

          if (!foundFood) {
            returnQuantity = 1;
            food.quantity = 1;
            storeCart.foods.push(food);
          }
        }
      })

      // If no store was found, add that store and the food to the cart
      if (!foundStore) {
        var storeCart = {};
        storeCart.storeId = storeId;
        storeCart.foods = [];

        returnQuantity = 1;
        food.quantity = 1;
        storeCart.foods.push(food);
        cart.push(storeCart);
      }

      sessionStorage.cart = JSON.stringify(cart);
      return returnQuantity;
    }

    this.getCart = function() {
      return JSON.parse(sessionStorage.cart);
    }
  });