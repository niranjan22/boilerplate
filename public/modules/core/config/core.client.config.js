'use strict';
// Configuring the Core module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
    
      Menus.addMenuItem('topbar', 'Main Menu', 'mainmenu', 'dropdown');
      Menus.addSubMenuItem('topbar', 'mainmenu', 'Invoices', 'invoices');
      Menus.addSubMenuItem('topbar', 'mainmenu', 'Clients', 'clients');
      Menus.addSubMenuItem('topbar', 'mainmenu', 'Users', 'users');
      
	}
]);