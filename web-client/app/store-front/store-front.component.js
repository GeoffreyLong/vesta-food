angular.module('storeFront').component('storeFront', {
  templateUrl: 'store-front/store-front.template.html',
  controller: function StoreFrontController(dataService){
    // TODO If for any reason we cannot get the store,
    //    like if this returns null, then we will use the :storeID on the url
    //    to get query the database for the store
    this.store = dataService.getStore();
    if (!this.store){
      // Temporary store population if could not get it
      // TODO have a DB query instead later
      this.store = {
        userID: "123456789",
        storeID: "123456789",
        storeTitle: "Geoff's Store 1",
        personalPhoto: "TODO",
        pickupAddress: "3515 Rue Durocher",
        neighborhood: "TODO",
        stripeAuth: "TODO",
        description: "This is the best store you'll ever go to. I make lots of things.",
        availability: "TODO",
        overallRating: 4,
        foods: [{
          name: "Hamburger Pastry thingies",
          photo: "/images/chef_1-1.png",
          price: 10,
          shelfLife: 3,
          prepTime: 2,
          overallRating: 5
        }, {
          name: "Schwarma Guy Wraps",
          photo: "/images/chef_1-2.jpg",
          price: 8,
          shelfLife: 2,
          prepTime: 4,
          overallRating: 3
        }, {
          name: "Salmon Delight",
          photo: "/images/chef_1-3.jpeg",
          price: 8,
          shelfLife: 1,
          prepTime: 1,
          overallRating: 2
        }]
      };
    }
  }
});
