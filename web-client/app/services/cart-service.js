angular
  .module('cartService', [])
  .service('cartService', function() {
    // TODO TODO TODO
    //      Using sessionStorage for testing, switch to localstorage for prod
    //      This will solve any persistency issues


    /**
     * Will add the food item to the cart and return the quantity of the specific item.
     * If the store's subcart is not already in the cart, it is created. 
     * If the food item already exists in the cart, it's quantity is incremented.
     * <p>
     * This function does this by finding the specific store id in the cart. 
     * If the store id does not exist, a subcart is created. 
     * This subcart contains the store id, the name of the store, and an array of foods. 
     * Once the store has been found / added, the function finds the food in the subcart.
     * If the specific food exists, then the quantity is incremented, 
     * else the food is added into the foods array with a quantity of one.
     * The quantity of the given food is then returned; a zero being returned on error.
     *
     * @param   storeId     The id of the store
     * @param   storeTitle  The name of the store, saved here for easy retreival
     * @param   food        The food object to be added to the cart
     * @return              The number of the specific food item in the cart. 
     *                      Returns 0 on error.
     */
    this.addToCart = function(eventId, hostId, food) {
      // NOTE I think we want to do this if they don't have storage
      if (!sessionStorage) return 0;

      // This will protect us from the sessionStorage being empty
      // And from sessionStorage.cart being empty
      var cart = [];
      if (sessionStorage.cart) cart = JSON.parse(sessionStorage.cart || []);

      // NOTE instead of dealing with these booleans, could simply return when found
      // NOTE It would be cool if I could dynamically name the keys
      var foundEvent = false;
      var returnQuantity = 0;


      // Iterate through the individual stores in the cart
      cart.forEach(function(subCart){
        if (subCart.eventId == eventId) {
          foundEvent = true;
          var foundFood = false;

          // Iterate through foods in the matching store cart to see if the food is there
          subCart.foods.forEach(function(cartFood){
            if (cartFood._id == food._id){
              foundFood = true;
              cartFood.quantity ++;
              returnQuantity = cartFood.quantity;
            }
          });

          if (!foundFood) {
            returnQuantity = 1;
            food.quantity = 1;
            subCart.foods.push(food);
          }
        }
      })

      // If no store was found, add that store and the food to the cart
      if (!foundEvent) {
        var subCart = {};
        subCart.eventId = eventId;
        subCart.hostId = hostId;
        subCart.foods = [];

        returnQuantity = 1;
        food.quantity = 1;
        subCart.foods.push(food);
        cart.push(subCart);
      }

      console.log(cart);
      this.updateCart(cart);
      return returnQuantity;
    }

    this.getCart = function() {
      // This will protect us from the sessionStorage being empty
      // And from sessionStorage.cart being empty
      var cart = [];
      if (sessionStorage && sessionStorage.cart) 
        cart = JSON.parse(sessionStorage.cart || []);

      return cart;
    }

    this.updateCart = function(cart) {
      sessionStorage.cart = JSON.stringify(cart);
    }
  });
