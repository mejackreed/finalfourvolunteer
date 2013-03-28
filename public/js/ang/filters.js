'use strict';

/* Filters */

angular.module('myApp.filters', []).filter('interpolate', ['version',
function(version) {
	return function(text) {
		return String(text).replace(/\%VERSION\%/mg, version);
	}
}]).filter('fromNow', function() {
	return function(dateString) {
		return moment(new Date(dateString)).fromNow()
	};
}).filter('checkLoc', function() {
	return function(text) {
	//	return text;
		if (text == "GWCC") {
			return "<a href='https://maps.google.com/maps?q=Georgia+World+Congress+Center,+Atlanta,+GA&hl=en' target=_blank>GWCC</a>"
		} else {
			if (text == "Civic Center") {
				return "<a href='https://maps.google.com/maps?q=Boisfeuillet+Jones+Atlanta+Civic+Center&hl=en' target=_blank>Civic Center</a>"
			}
		}
	};
});
