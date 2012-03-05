window.App.authentication = {
	
	/**
	 * Validate
	 * 
	 * @param pass Callback to be executed if validation is successful, sent user parameter.
	 * @param fail Callback to be executed if validation fails.
	 */
	validate: function(pass, fail) {
		if(OAuth2.getToken() == null) {
			fail();
		}
		else {
			jQuery.getJSON(App.API + "/user", {access_token: OAuth2.getToken()})
				.success(function(json) {
					if(json.type == "User") {
						
						var user = {};
						user.logged = json;
						
						// Load user's organizations.
						jQuery.getJSON(App.API + "/user/orgs", {access_token: OAuth2.getToken()})
							.success(function(json) {
								
								// Don't have access to '/user/<org-name>' because token not for them, but
								// it would be useful in getting the number or repositories each user has.
								
								user.orgs = json;
								pass(user);
							});
					}
				})
				.error(function(json) {
					if(json.readyState == 0 && json.status == 0) {
						// There is no data connection.
					}
					else {
						fail();
					}
				});
		}
	},
	
	/**
	 * Prompt
	 */
	prompt: function() {
		jQuery('.github_header').delay(500).fadeOut(200, function() {
			jQuery('body').removeClass('loading').animate({width:"413px", height:"269px"}, function() {
				jQuery('#authorization').delay(750).fadeIn(225);
				jQuery('#authorization button').on('click', function() {
					OAuth2.begin();
				});
			});
		});
	}
};