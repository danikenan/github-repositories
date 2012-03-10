window.App = {

	/**
	 * Initialize
	 */
	init: function(){
		App.authentication.validate(function(user) {
			jQuery.extend(App.user, user);
			App.user.init();
	
			App.content.init();
			App.navigation.init();
			App.settings.init();
			App.switcher.init();
	
			App.bind();	

			// Show application.
			jQuery('body').removeClass('loading').find('#application').show();
	
		}, function() {
			App.authentication.prompt();
		});
	},
	
	/**
	 * Bind
	 */
	bind: function() {
	
		// Create user link tooltips.
		jQuery('.user_links [tooltip]').each(function() {
			var element = jQuery(this);
			var html = "<span class='trigger'></span>"
					 + "<span class='tooltip'>"
			         + "<span class='arrow'></span>"
					 + "<span class='bubble'>" + element.attr('tooltip') + "</span>"
					 + "</span>";
	
			jQuery(this).append(html);

			element.find('.trigger').on('hover', function() {
				element.find('.tooltip').toggle();
				var bubble = element.find('.bubble');
				bubble.css('margin-left', -bubble.width() / 2 + "px");
			});
		});
	
		// Set log out click events.
		jQuery('.user_links li[rel="log_out"]').on('click', function() {
			Storage.clear();
			App.close();
		});
	
		// Set refresh button mouse and click events.
		var refresh = jQuery('.refresh');
		refresh.on('click', function() {
			window[App.navigation.selected].load.refresh(App.user.context, App.navigation.selected);
		});
		refresh.on('mousedown', function() {
			refresh.addClass('down');
		});
		refresh.on('mouseup', function() {
			refresh.removeClass('down');
		});
		refresh.on('mouseleave', function() {
			refresh.removeClass('down');
		});
	},
	
	/**
	 * Close
	 */
	close: function(){
		window.close();
		chrome.tabs.getCurrent(function(tab) {
			chrome.tabs.remove(tab.id, function(){});
		});
	}
};

// Prevent any future conflicts.
$.noConflict();

// Initialize application after page has loaded.
jQuery(window).bind("load", function() {
	if(!Storage.isSupported()) {
		App.close();
	}
	else {
		App.init();
	}
});