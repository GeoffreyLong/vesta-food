angular
  .module('cartService', [])
  .service('cartService', function($http, $q) {
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
    this.addToCart = function(eventId, hostId, hostName, eventName, food) {
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
        subCart.hostName = hostName;
        subCart.eventName = eventName;
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
      var deferred = $q.defer();
      this.rakeCart().then(function(cart) {
        deferred.resolve(cart);
      });

      return deferred.promise;
    }

    // Check to see if food items are still available to order
    // If they aren't, then remove them 
    // TODO perhaps add a client side alert saying we are removing 
    //      a cart cause it is no longer available when we do so
    // TODO see if this slows things down too much
    this.rakeCart = function() {
      var deferred = $q.defer();
      var cart = [];
      if (sessionStorage && sessionStorage.cart) 
        cart = JSON.parse(sessionStorage.cart || []);

      if (cart.length > 0) {
        cart.forEach(function(subCart, index){
          $http.get('/api/event/' + subCart.eventId).then(function(data) {
            var ev = data.data;

            if (!ev.isOpen) {
              cart.splice(index, 1);
            }
          });
        });
        
        // TODO Not sure if this is correctly updating the cart
        sessionStorage.cart = JSON.stringify(cart);
        deferred.resolve(cart);
      }
      else {
        deferred.resolve(cart);
      }

      return deferred.promise;
    }

    this.updateCart = function(cart) {
      sessionStorage.cart = JSON.stringify(cart);
    }
  });
