import Vue from 'vue'
import App from './App.vue'
import Keycloak from 'keycloak-js'

Vue.config.productionTip = false

var kc = Keycloak({
  url: 'http://localhost:8080/auth/', 
  realm: 'keycloak-demo', 
  clientId: 'vue-test-app', 
  onLoad:'login-required'
});

	var loadData = function() {
		console.log(kc);
		var data = new Date()
		data.setTime(data.getTime() + 600000);
		
		var realm = kc.tokenParsed.preferred_username;
		for(var i = 0; i < kc.realmAccess.roles.length; i++){
		realm +="-"+kc.realmAccess.roles[i];
		}
		console.log(realm);
		document.cookie = "keycloak=" + realm + "; expires=" + data.toUTCString()+ "; path=/";
  };
  
	var reloadData = function() {
    new Vue({
      render: h => h(App),
    }).$mount('#app')
		kc.updateToken(10).success(loadData).error(function() {
			console.log('Failed to load data.  User is logged out.');
		});
  }
  
	kc.init({
		onLoad : 'login-required'
	}).success(reloadData).error(
			function(errorData) {
				console.log("Failed to load data. Error: "
						+ JSON.stringify(errorData));
	});