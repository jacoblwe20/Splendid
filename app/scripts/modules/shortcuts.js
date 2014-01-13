'use strict';

angular.module('splendid.shortcuts', []).
	factory('Shortcuts', function( ){
		var ui,
			file,
			self,
			$root;

		function parsePrefs(prefs){
			var keys,
				fns,
				patterns;

			function getPatterns ( key ) {
				var cmds = key.split(/\,/);
				return cmds.map( function( str ){
					return str.replace(/(^\s+|\s+$)/g,'');
				});
			}

			function getFunctions ( key ) {
				var chain = prefs[key],
					type,
					fn;

				if ( typeof chain !== 'string' ) return;
				chain = chain.split(/\./);
				type = chain[0];

				fn = $root[ type ];

				if ( fn ) {
					chain.shift();
					chain.forEach(function( method ){
						if ( typeof fn[ method ] === 'function' ){
							fn = fn[ method ];
						}
					})
					if ( typeof fn === 'function' ) {
						return fn;
					}
				}
			}

			try {
				prefs = JSON.parse(prefs);
			} catch (e) {
				console.warn('Could not load Keyboard Shortcuts');
				return;
			}

			keys = Object.keys( prefs );
			patterns = keys.map( getPatterns );
			fns = keys.map( getFunctions );
			return [patterns, fns, keys];
		}

		function loadPreferances ( pref ) {
			if ( !pref ) return;
			var patterns = pref[0],
				fns = pref[1],
				names = pref[2];
			patterns.forEach(function( pattern, index ){
				var fn = fns[ index ],
					name = names[ index ];
				if ( fn ) {
					ui.registerShortcut({
						name : name,
						keys : pattern
					}, fn );
				}
			})
		}

		function getPreferances ( callback ) {
			// this will be where custom preferances can be found
			var pref = null/*chrome.storage.local.getItem('shortcuts')*/;

			if ( !pref ){
				return file.readPackageFile('settings/shortcuts.json')
					.then(function( result ){
						if ( callback ) callback ( result.file, result );
					}, function ( err ) {
						console.warn( err );
					})
			}
			if ( callback ) callback ( pref );
		}

		function initialize ( $rootScope ) {
			ui = $rootScope.ui;
			file = $rootScope.file;
			$root = $rootScope;

			getPreferances( function ( _prefs ){
				var prefs = parsePrefs( _prefs );
				loadPreferances( prefs );
			});
			return self;
		}

		self = {
			init : initialize,
			open : function ( ) {
				getPreferances(function( prefs, _file ){
					file.setCurrentFile( _file );
				});
			}
		};
		return self;
	})