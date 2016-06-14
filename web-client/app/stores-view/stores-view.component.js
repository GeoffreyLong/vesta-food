angular.module('storesView').component('storesView', {
  templateUrl: 'stores-view/stores-view.template.html',
  controller: function StoresViewController() {
    this.stores = [
      {
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
          name: "Brittle Peanuts",
          photo: "TODO",
          price: 10,
          shelfLife: 3,
          prepTime: 2,
          overallRating: 3
        }]
      },{
        userID: "123456789",
        storeID: "123456789",
        storeTitle: "Geoff's Store 2",
        personalPhoto: "TODO",
        pickupAddress: "3515 Rue Durocher",
        neighborhood: "TODO",
        stripeAuth: "TODO",
        description: "This is the best store you'll ever go to. I make lots of things.",
        availability: "TODO",
        overallRating: 4,
        foods: [{
          name: "Brittle Peanuts",
          photo: "TODO",
          price: 10,
          shelfLife: 3,
          prepTime: 2,
          overallRating: 3
        }]
      }, {
        userID: "123456789",
        storeID: "123456789",
        storeTitle: "Geoff's Store 3",
        personalPhoto: "TODO",
        pickupAddress: "3515 Rue Durocher",
        neighborhood: "TODO",
        stripeAuth: "TODO",
        description: "This is the best store you'll ever go to. I make lots of things.",
        availability: "TODO",
        overallRating: 4,
        foods: [{
          name: "Brittle Peanuts",
          photo: "TODO",
          price: 10,
          shelfLife: 3,
          prepTime: 2,
          overallRating: 3
        }]
      }, {
        userID: "123456789",
        storeID: "123456789",
        storeTitle: "Geoff's Store 4",
        personalPhoto: "TODO",
        pickupAddress: "3515 Rue Durocher",
        neighborhood: "TODO",
        stripeAuth: "TODO",
        description: "This is the best store you'll ever go to. I make lots of things.",
        availability: "TODO",
        overallRating: 4,
        foods: [{
          name: "Brittle Peanuts",
          photo: "TODO",
          price: 10,
          shelfLife: 3,
          prepTime: 2,
          overallRating: 3
        }]
      }
    ];
  }
});
