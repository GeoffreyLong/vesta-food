angular
  .module('dataService', [])
  .service('dataService', function() {
    // TODO could use this to manage the client side session storage
    // Take hints from cache algorithms like "least recently used" to push out stores
    // Should probably always keep the person's store cached

    this.store = null;
    this.clonedStore = null
    this.editPhoto = null;
    this.storeCart = null;


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