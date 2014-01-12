'use strict';
console.log('shortcuts');
angular.module('splendid.shortcuts', ['splendid.config']).
	factory('Shortcuts', function( ){
		function loadShortcuts ( $rootScope ) {
			var ui = $rootScope.ui,
				file = $rootScope.file;

			/*
			Things that need to be done to get
			this file working.

			1. file.open needs to be able to take a string
				to open rather then prompting

			2. need to build a function that can take a shortcuts
				and run a command on either file, ui and more...

			3. loop trough entries in file and load them using 
				ui.registerShortcut
			*/

			debugger;		
		}
		return {
			init : loadShortcuts
		};
	})