angular
  .module('dataService', [])
  .service('dataService', function() {
    // TODO could use this to manage the client side session storage
    // Take hints from cache algorithms like "least recently used" to push out stores
    // Should probably always keep the person's store cached

    this.store = null;
    this.clonedStore = null

    this.user = null;
    this.clonedUser = null;
    
    this.event = null;
    this.clonedEvent = null;

    this.editPhoto = null;
    this.storeCart = null;


    // Getters and Setters for Store
    this.setStore = function(store) {
      this.store = store;
      this.clonedStore = jQuery.extend(true, {}, store);
    }
    this.getStore = function() {
      return this.store;
    }
    this.getClonedStore = function() {
      return jQuery.extend(true, {}, this.clonedStore);
    }

    // Getters and Setters for Event
    this.setEvent = function(event) {
      this.event = event;
      this.clonedEvent = jQuery.extend(true, {}, event);
    }
    this.getEvent = function() {
      return this.event;
    }
    this.getClonedEvent = function() {
      return jQuery.extend(true, {}, this.clonedEvent);
    }


    // Getters and Setters for User
    this.setUser = function(user) {
      this.user = user;
      this.clonedUser = jQuery.extend(true, {}, user);
    }
    this.getUser = function() {
      return this.user;
    }
    this.getClonedUser = function() {
      return jQuery.extend(true, {}, this.clonedUser);
    }

    // To set and retreive photos for editing
    this.setEditPhoto = function(photo){
      this.editPhoto = photo;
    }
    this.getEditPhoto = function(){
      return this.editPhoto;
    }

    // For the purchases
    this.setPurchaseOrder = function(storeCart) {
      this.storeCart = storeCart;
    }
    // Destructive get method?
    // NOTE I don't know if this is actually necessary
    this.getPurchaseOrder = function() {
      var tempStoreCart = jQuery.extend(true, {}, this.storeCart);
      this.storeCart = null;
      return tempStoreCart;
    }
  });
