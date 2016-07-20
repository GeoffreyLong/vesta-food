angular.module('vestaApp').config(function(ezfbProvider) {
    // Set up FB
    ezfbProvider.setLocale('en_CA');
    ezfbProvider.setInitParams({
        appId      : '592850390877879',
        xfbml      : true,
        version    : 'v2.6'
    });
});
