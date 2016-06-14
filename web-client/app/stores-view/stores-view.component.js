angular.module('storesView').component('storesView', {
  templateUrl: 'stores-view/stores-view.template.html',
  controller: function StoresViewController() {
    function chunk(arr, size) {
      var newArr = [];
      for (var i = 0; i < size; i ++) {
        var tempArr = [];
        for (var j = i; j < arr.length; j += size) {
          tempArr.push(arr[j]);
        }
        newArr.push(tempArr);
      }
      return newArr;
    }


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
          photo: "/images/chef_1-1.png",
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
          photo: "/images/chef_2-1.jpg",
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
          photo: "/images/chef_3-1.jpg",
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
          photo: "/images/chef_4-1.jpg",
          price: 10,
          shelfLife: 3,
          prepTime: 2,
          overallRating: 3
        }]
      }
    ];

    // This gives the number of rows
    // Three looks good on my screen
    // Might want to make it dynamic based on screen size
    this.chunkedData = chunk(this.stores, 3);

  }
});
