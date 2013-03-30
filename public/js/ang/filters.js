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
}).filter('tel', function() {
	return function(tel) {
		if (!tel) {
			return '';
		}

		var value = tel.toString().trim().replace(/^\+/, '');

		if (value.match(/[^0-9]/)) {
			return tel;
		}

		var country, city, number;

		switch (value.length) {
			case 10:
				// +1PPP####### -> C (PPP) ###-####
				country = 1;
				city = value.slice(0, 3);
				number = value.slice(3);
				break;

			case 11:
				// +CPPP####### -> CCC (PP) ###-####
				country = value[0];
				city = value.slice(1, 4);
				number = value.slice(4);
				break;

			case 12:
				// +CCCPP####### -> CCC (PP) ###-####
				country = value.slice(0, 3);
				city = value.slice(3, 5);
				number = value.slice(5);
				break;

			default:
				return tel;
		}

		if (country == 1) {
			country = "";
		}

		number = number.slice(0, 3) + '-' + number.slice(3);

		return (country + " (" + city + ") " + number).trim();
	};
}).filter('startFrom', function() {
	return function(input, start) {
		start = +start;
		//parse to int
		if (input != undefined) {
			return input.slice(start);
		}
	}
});

