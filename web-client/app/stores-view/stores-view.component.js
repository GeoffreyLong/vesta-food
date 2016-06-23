// TODO
//    
//    Might want to consider delaying the page render until the slick is slicked
//    Might want to consider lazy loading after a certain number

angular.module('storesView').component('storesView', {
  templateUrl: 'stores-view/stores-view.template.html',
  controller: function StoresViewController(dataService, $location) {
    // Could move to the dataService if used by another controller
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


    // TODO TODO 
    // For images in the stores we might want to consider
    // /images/chefs/:chefId for the personal photos
    // /images/foods/:foodId for the food photos
    // We will have to decide if we want to use something like GridFS with mongo
    //    or just use a file system to save these images
    //    I don't know the benefits of each... will have to weigh pros/cons
    this.stores = [
      {
        userID: "123456789",
        storeID: "123456789",
        storeTitle: "Geoff's Store 1",
        profilePhoto: "/images/chef_1_profile.jpg",
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
      }, {
        userID: "111111111",
        storeID: "111111111",
        storeTitle: "Store Des Ipsums",
        profilePhoto: "TODO",
        pickupAddress: "3515 Rue Durocher",
        neighborhood: "TODO",
        stripeAuth: "TODO",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." 
          + "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." 
          + "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        availability: "TODO",
        overallRating: 4,
        foods: [{
          name: "Ipsum Salad",
          photo: "/images/chef_2-1.jpg",
          price: 10,
          shelfLife: 3,
          prepTime: 2,
          overallRating: 3
        }]
      }, {
        userID: "123456789",
        storeID: "123456789",
        storeTitle: "Piecaken Nation",
        profilePhoto: "TODO",
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
        }, {
          name: "Brittle Peanuts",
          photo: "/images/chef_3-2.jpg",
          price: 10,
          shelfLife: 3,
          prepTime: 2,
          overallRating: 3
        }, {
          name: "Brittle Peanuts",
          photo: "/images/chef_3-3.jpg",
          price: 10,
          shelfLife: 3,
          prepTime: 2,
          overallRating: 3
        }, {
          name: "Brittle Peanuts",
          photo: "/images/chef_3-4.jpg",
          price: 10,
          shelfLife: 3,
          prepTime: 2,
          overallRating: 3
        }]
      }, {
        userID: "123456789",
        storeID: "123456789",
        storeTitle: "Geoff's Store 4",
        profilePhoto: "TODO",
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
      }, {
        userID: "8675309",
        storeID: "123454321",
        storeTitle: "Ronald's",
        profilePhoto: "/images/chef_5_profile.jpg",
        pickupAddress: "3515 Rue Durocher",
        neighborhood: "TODO",
        stripeAuth: "TODO",
        description: "I will make you fat, that is a guarantee.", 
        availability: "TODO",
        overallRating: 4,
        foods: [{
          name: "Ipsum Salad",
          photo: "/images/chef_2-1.jpg",
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

    this.getNumber = function(num) {
      return new Array(num);   
    }

    // Hopefully this solves the image loading bug on first visit
    // If not try wrapping this in an image loading event
    //    so it fires after the images have been sent
    this.refreshSlick = function() {
      setTimeout(function() {
        // TODO if desired
        if (!$('.slider').length > 0) {
          console.log('hello');
          refreshSlick();
        }
        else {
          console.log($('.slider').length);
          $('.slider').slick('setPosition');
        }
      }, 1000);
    }
    this.refreshSlick();


    // If itemIndex is set to one of the photos, then one of the foods was clicked
    // In this case go to the storefront with some sort of emphasis on the food item
    this.goToStore = function(store, itemIndex) {
      dataService.setStore(store);
      console.log(dataService.getStore());
      
      if (itemIndex >= 0) {
        $location.path('/store/' + store.storeID + '#' + itemIndex);
      }
      else {
        $location.path('/store/' + store.storeID);
      }
    }
  }
});
