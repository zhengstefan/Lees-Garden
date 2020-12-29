/* Navbar */

$(document).ready(function () {
  $('li.active').removeClass('active');
  $('a[href="' + location.pathname + '"]').closest('li').addClass('active');
});


/* Chevron-circle-down */
function hover(element) {
  element.setAttribute('src', 'images/chevron-circle-down-hovered.png');
}



function unhover(element) {
  element.setAttribute('src', 'images/chevron-circle-down.png');
}


/*Google Places */

(function ($) {

  $.googlePlaces = function (element, options) {

    var defaults = {
      placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4' // placeId provided by google api documentation
      , render: ['reviews']
      , min_rating: 0
      , max_rows: 0
      , rotateTime: false
      , shorten_names: true
    };

    var plugin = this;

    plugin.settings = {}

    var $element = $(element),
      element = element;

    plugin.init = function () {
      plugin.settings = $.extend({}, defaults, options);
      $element.html("<div id='map-plug'></div>"); // create a plug for google to load data into
      initialize_place(function (place) {
        plugin.place_data = place;
        // render specified sections
        if (plugin.settings.render.indexOf('reviews') > -1) {
          renderReviews(plugin.place_data.reviews);
          if (!!plugin.settings.rotateTime) {
            initRotation();
          }
        }
      });
    }

    var initialize_place = function (c) {
      var map = new google.maps.Map(document.getElementById('map-plug'));

      var request = {
        placeId: plugin.settings.placeId
      };

      var service = new google.maps.places.PlacesService(map);

      service.getDetails(request, function (place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          c(place);
        }
      });
    }

    var sort_by_date = function (ray) {
      ray.sort(function (a, b) {
        var keyA = new Date(a.time),
          keyB = new Date(b.time);
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      return ray;
    }

    var filter_minimum_rating = function (reviews) {
      for (var i = reviews.length - 1; i >= 0; i--) {
        if (reviews[i].rating < plugin.settings.min_rating) {
          reviews.splice(i, 1);
        }
      }
      return reviews;
    }

    var shorten_name = function (name) {
      if (name.split(" ").length > 1) {
        var xname = "";
        xname = name.split(" ");
        return xname[0] + " " + xname[1][0] + ".";
      }
    }


    var renderReviews = function (reviews) {
      reviews = sort_by_date(reviews);
      reviews = filter_minimum_rating(reviews);
      var html = "";
      var row_count = (plugin.settings.max_rows > 0) ? plugin.settings.max_rows - 1 : reviews.length - 1;
      // make sure the row_count is not greater than available records
      row_count = (row_count > reviews.length - 1) ? reviews.length - 1 : row_count;
      for (var i = row_count; i >= 0; i--) {
        var stars = renderStars(reviews[i].rating);
        var date = convertTime(reviews[i].time);
        if (plugin.settings.shorten_names == true) {
          var name = shorten_name(reviews[i].author_name);
        } else {
          var name = reviews[i].author_name + "</span>";
        };
        html = html + "<div class='review-item'><div class='review-meta'><span class='google-logo'></span><span class='review-author'>" + name + "</span><span class='review-date'>" + date + "</span></div>" + stars + "<p class='review-text'>" + reviews[i].text + "</p></div>"
      };
      $element.append(html);
    }

    var initRotation = function () {
      var $reviewEls = $element.children('.review-item');
      var currentIdx = $reviewEls.length > 0 ? 0 : false;
      $reviewEls.hide();
      if (currentIdx !== false) {
        $($reviewEls[currentIdx]).show();
        setInterval(function () {
          if (++currentIdx >= $reviewEls.length) {
            currentIdx = 0;
          }
          $reviewEls.hide();
          $($reviewEls[currentIdx]).fadeIn('slow');
        }, plugin.settings.rotateTime);
      }
    }

    var renderStars = function (rating) {
      var stars = "<div class='review-stars'><ul>";

      // fill in gold stars
      for (var i = 0; i < rating; i++) {
        stars = stars + "<li><i class='star'></i></li>";
      };

      // fill in empty stars
      if (rating < 5) {
        for (var i = 0; i < (5 - rating); i++) {
          stars = stars + "<li><i class='star inactive'></i></li>";
        };
      }
      stars = stars + "</ul></div>";
      return stars;
    }

    var convertTime = function (UNIX_timestamp) {
      var a = new Date(UNIX_timestamp * 1000);
      var months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
      var time = a.getDate() + '. ' + months[a.getMonth()] + ' ' + a.getFullYear();
      return time;
    }

    plugin.init();

  }

  $.fn.googlePlaces = function (options) {

    return this.each(function () {
      if (undefined == $(this).data('googlePlaces')) {
        var plugin = new $.googlePlaces(this, options);
        $(this).data('googlePlaces', plugin);
      }
    });

  }

})(jQuery);


/* Speisekarte horizontal navbar */

// duration of scroll animation
var scrollDuration = 300;
// paddles
var leftPaddle = document.getElementsByClassName('left-paddle');
var rightPaddle = document.getElementsByClassName('right-paddle');
// get items dimensions
var itemsLength = $('.item').length;
var itemSize = $('.item').outerWidth(true);
// get some relevant size for the paddle triggering point
var paddleMargin = 20;

// get wrapper width
var getMenuWrapperSize = function() {
	return $('.menu-wrapper').outerWidth();
}
var menuWrapperSize = getMenuWrapperSize();
// the wrapper is responsive
$(window).on('resize', function() {
	menuWrapperSize = getMenuWrapperSize();
});
// size of the visible part of the menu is equal as the wrapper size 
var menuVisibleSize = menuWrapperSize;

// get total width of all menu items
var getMenuSize = function() {
	return itemsLength * itemSize;
};
var menuSize = getMenuSize();
// get how much of menu is invisible
var menuInvisibleSize = menuSize - menuWrapperSize;

// get how much have we scrolled to the left
var getMenuPosition = function() {
	return $('.menu').scrollLeft();
};

// finally, what happens when we are actually scrolling the menu
$('.menu').on('scroll', function() {

	// get how much of menu is invisible
	menuInvisibleSize = menuSize - menuWrapperSize;
	// get how much have we scrolled so far
	var menuPosition = getMenuPosition();

	var menuEndOffset = menuInvisibleSize - paddleMargin;

	// show & hide the paddles 
	// depending on scroll position
	if (menuPosition <= paddleMargin) {
		$(leftPaddle).addClass('hidden');
		$(rightPaddle).removeClass('hidden');
	} else if (menuPosition < menuEndOffset) {
		// show both paddles in the middle
		$(leftPaddle).removeClass('hidden');
		$(rightPaddle).removeClass('hidden');
	} else if (menuPosition >= menuEndOffset) {
		$(leftPaddle).removeClass('hidden');
		$(rightPaddle).addClass('hidden');
}

	// print important values
	$('#print-wrapper-size span').text(menuWrapperSize);
	$('#print-menu-size span').text(menuSize);
	$('#print-menu-invisible-size span').text(menuInvisibleSize);
	$('#print-menu-position span').text(menuPosition);

});

var scrollAmount = 0;

// scroll to left
$(rightPaddle).on('click', function() {
    $('.menu').animate( { scrollLeft: scrollAmount += 200 }, scrollDuration);
});

// scroll to right
$(leftPaddle).on('click', function() {
    $('.menu').animate( { scrollLeft: scrollAmount -= 200 }, scrollDuration);
});