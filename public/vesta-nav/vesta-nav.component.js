angular.module('vestaNav').component('vestaNav', {
  templateUrl: 'vesta-nav/vesta-nav.template.html',
  controller: function VestaNavController() {
    this.user = {
      displayName: 'UserName'
    }
  }
});
