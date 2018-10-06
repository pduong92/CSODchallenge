(function($, window) {
	'strict mode'
	
	// Perform ajax search to fetch feed images
	function _fetchData () {
		var accessToken = "";

		 return $.ajax({
			url: "https://api.instagram.com/v1/users/self/media/recent/?access_token=" + accessToken,
			dataType: 'json',
			type: 'GET'
		});
	}
	
	function _initData (data) {
		if (typeof data == 'object' && data.meta.code == 200) {
			// Populate Feed when document is ready
			$(document).ready(function() {
				_populateFeed(data);
			});
		}
		else {
			_handleFail();
		}
	}
	
	function _handleFail () {
		console.log('Error: API call failed to retrieve data');
		$('#instafeed_empty').show();
	}
	
	// Populate Feed
	function _populateFeed (data) {
		let mydata_nodes = data.data,
			instaList = document.getElementsByClassName('insta-img-list')[0],
			instaContainer = document.getElementsByClassName('insta-img-list-container')[0],
			itemCount = mydata_nodes.length,
			itemMargin = 10,
			itemWidth,
			containerWidth;
		
		mydata_nodes.forEach(function(node) {
			
			let imgResources = node.images,
				thumbnailResrc = imgResources.thumbnail,
				thumbnailUrl = thumbnailResrc.url,
				linkUrl = node.link;
				
				itemWidth = thumbnailResrc.width;
				
				let	newImg = document.createElement('img'),
					newItem = document.createElement('li'),
					newLink = document.createElement('a');
					
				newImg.setAttribute('src', thumbnailUrl);
				// set fadeIn animation to run onload
				newImg.onload = _fadeIn;
				
				newLink.setAttribute('href', linkUrl);
				newLink.setAttribute('target', '_blank');
				newLink.setAttribute('rel', 'noopener noreferrer');
				newLink.appendChild(newImg);
				
				newItem.setAttribute('class', 'insta-img-item');
				newItem.appendChild(newLink);
				
				instaList.appendChild(newItem);
		});
		
		// Calcualte width and set container width for slide animation
		containerWidth = (itemWidth + itemMargin) * itemCount;
		instaContainer.style.width = containerWidth + 'px';

		// Start slide animation after appending all images
		_slideAnimation(instaContainer);
	}
	
	// Function to fade images in
	function _fadeIn (e) {
		var ele = e.target || e,
			item = $(ele),
			opacity = 0,
			intervalId;
		item.css('opacity', opacity);
		
		intervalId = setInterval(function() {
			if (opacity >= 1) {
				item.css('opacity', 1)
				clearInterval(intervalId);
			} else {
				opacity += 0.1;
				item.css('opacity', opacity);	
			}
		}, 100);
	}
	
	// Function to for slide animation for feed
	function _slideAnimation (e) {
		var ele = e.target || e,
			item = $(ele),
			eleWidth = $(ele).outerWidth(),
			left = $(ele).position().left,
			decrease = 1,
			intervalId;
			
		$(ele).on('mouseover', _pause);
		$(ele).on('mouseout', _resume);
		
		function _shiftLeft () {
			if (Math.abs(left) >= eleWidth) {
				clearInterval(intervalId);
				_reset();
			}
			else {
				left -= decrease;
				item.css('left', left + 'px');
			}
		}
		
		function _pause () {
			decrease = 0;
		}
		
		function _resume () {
			decrease = 1;
		}
		
		function _reset () {
			let parentWidth = $('#instafeed').outerWidth();
			
			item.css('left', parentWidth + 'px');
			_slideAnimation(e);
		}
		
		intervalId = setInterval(_shiftLeft, 50);
	}
	
	// Function for AutoComplete
	function _autoComplete (inEle, list) {
		var acList = [];
		
		$(inEle).on('input', _buildList);
		
		function _buildList (e) {
			let ele = e.target || e,
				val = ele.value;
			
			// Clear previous autocomplete list
			_resetList();
			
			let val_trimmed = val.trim();
			// Exit if less than 3 characters 
			if (val_trimmed.length < 3) {
				if (val_trimmed === '') {
					$(inEle).val(val_trimmed);
				}
				return;
			}

			for (let i = 0; i < list.length; i++) {
				if (list[i].substring(0, val.length).toUpperCase() == val.toUpperCase()) {
					acList.push(list[i]);
				}
			}
			
			let outputList = $.map(acList, function(item) {
				let outputItem = $('<div>')
						.addClass('ac-list-item')
						.text(item)
						.on('click', _insert);
				
				return outputItem;
			})
			$('.ac-list').append(outputList);
		}
		
		// Function to reset autocomplete list
		function _resetList () {
			acList = [];
			$('.ac-list').html('');
		}
		
		// Function to inset selected autocomplete option
		function _insert (e) {
			let ele = e.target,
				text = ele.innerText;
			
			$(inEle).val(text);
			_resetList();
		}
	}
	
	
	var Init = function () {
		// Request Ajax and intialize data
		_fetchData().then(_initData).fail(_handleFail);
		
		var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
		
		$(document).ready(function() {
			_autoComplete(document.getElementsByClassName('ac-input')[0], countries);
		});
	}();
			
	
})(jQuery, window);