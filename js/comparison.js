$(document).ready(function() {
    // Remove no-js class if js is enabled
    document.body.className = document.body.className.replace("no-js", "js");
	
	// If the comparison slider is present on the page, initialise it. Include this in the main js to prevent the code from running when not needed
	if ($(".comparison-slider")[0]) {
		let compSlider = $(".comparison-slider");
	
		//let's loop through the sliders and initialise each of them
		compSlider.each(function() {
			let compSliderWidth = $(this).width() + "px";
			drags($(this).find(".divider"), $(this).find(".fact"), $(this));
		});

		// Upon page load, let's animate the slider to show users the light. Use callback function to put back into starting position.
		$(".divider").delay(1000).animate({
            left: "-=80%",
        }, 1500, function() {
            $(this).delay(500).animate({
                left: "+=80%"
            }, 1500 )
        } );

        $(".fact").delay(1000).animate({
            width: "10%",
        }, 1500, function() {
            $(this).delay(500).animate({
                width: "90%"
            }, 1500)
        } );
	}
});

function drags(dragElement, resizeElement, container) {
	
	// This creates a variable that detects if the user is using touch input insted of the mouse.
	let touched = false;
	window.addEventListener('touchstart', function() {
		touched = true;
	});

	window.addEventListener('touchend', function() {
		touched = false;
	});
	
	// clip the image and move the slider on interaction with the mouse or the touch input
	dragElement.on("mousedown touchstart", function(e) {
			
			// add classes to the elements - good for css animations if you need it to
			dragElement.addClass("draggable");
			resizeElement.addClass("resizable");

			// create vars
			let startX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;
			let dragWidth = dragElement.outerWidth();
			let posX = dragElement.offset().left + dragWidth - startX;
			let containerOffset = container.offset().left;
			let containerWidth = container.outerWidth();
			let minLeft = containerOffset + 10;
			let maxLeft = containerOffset + containerWidth - dragWidth - 10;
			
			// add event listener on the divider element
			dragElement.parents().on("mousemove touchmove", function(e) {
				
				// if the user is not using touch input, let preventDefault prevent the user from selecting other things as they move the slider around.
				if ( touched === false ) {
					e.preventDefault();
				}
				
				let moveX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;
				let leftValue = moveX + posX - dragWidth;

				// stop the divider from going over the limits of the container
				if (leftValue < minLeft) {
					leftValue = minLeft;
				} else if (leftValue > maxLeft) {
					leftValue = maxLeft;
				}

				let widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth + "%";

				$(".draggable").css("left", widthValue).on("mouseup touchend touchcancel", function() {
					$(this).removeClass("draggable");
					resizeElement.removeClass("resizable");
				});
				
				$(".resizable").css("width", widthValue);
				
			}).on("mouseup touchend touchcancel", function() {
				dragElement.removeClass("draggable");
				resizeElement.removeClass("resizable");
			});
		
		}).on("mouseup touchend touchcancel", function(e) {
			// stop clipping the image and move the slider
			dragElement.removeClass("draggable");
			resizeElement.removeClass("resizable");
		});
}