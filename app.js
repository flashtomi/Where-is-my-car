(function($) {
	
	var map = null;
	var currentPosition = null;
	var savedLocationMarker = null;
	var currentLocationMarker = null;
	var savedPosition = JSON.parse(localStorage.getItem("currentPosition"));
	
	function init() {
		var mapDiv = document.getElementById('map');
		map = new google.maps.Map(mapDiv, {
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
		});
		
		savedLocationMarker = new google.maps.Marker({
	        position: savedPosition,
	        map: map
        });
	}
	
	function locError(error) {
        alert("Error: The Geolocation service failed. Please allow browser to access your location data.");
    }
	
	//After the browser get the permission to access user location data the function marking the current position with a circle.
	function addCurrentLocationMarker(latLon) {
		currentLocationMarker = new google.maps.Marker({
			position: latLon,
			map: map,
			icon: { 
				path: google.maps.SymbolPath.CIRCLE, 
				scale: 5,
			},
        });
	}
	
	//Delete current location marker
	function clearCurrentLocationMarker() {
		if(currentLocationMarker != null) {
			currentLocationMarker.setMap(null);
		}
	}
	
	//Move current location marker when the position is changed
	function updateCurrentPosition(position) {
		currentPosition = {
			lat: position.coords.latitude, 
			lng: position.coords.longitude,
		};
		
		if(map) {
			map.setCenter(currentPosition);
			clearCurrentLocationMarker();
			addCurrentLocationMarker(currentPosition);
		}
	}
	
	//function to delete old marker and add the new one to the current position
	function saveCurrentPosition() {
		if(savedLocationMarker != null) {
			savedLocationMarker.setMap(null);
		}
		savedLocationMarker = new google.maps.Marker({
	        position: currentPosition,
	        map: map
        });
		//saving current position to local storage
		localStorage.setItem("currentPosition", JSON.stringify(currentPosition));
	}
	
	//Add marker event to button
	function addMarker(event) {
		saveCurrentPosition();
	}
	
	$(document).ready(function() {
		if(navigator.geolocation) {
			init();
			var watchID = navigator.geolocation.watchPosition(updateCurrentPosition, locError);
			$('#addButton').on('click', addMarker);
		} else {
			alert("Your browser does not support the Geolocation API");
		}
	});
})($);