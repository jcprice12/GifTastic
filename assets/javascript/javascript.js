/***********************************************************************************************************************************************************
	Load Animation Prototype
**********************************************************************************************************************************************************/
function MyLoadAnimation1(myElementsToAnimate, mySize, myCircleSize){
	this.counter = 0;
	this.elementsToAnimate = myElementsToAnimate;
	this.radius = (mySize/2);
	this.circleSize = myCircleSize;
	this.canPlay = true;
	this.myTimer = null;
}

//convert degrees to radians
MyLoadAnimation1.prototype.getRadians = function(degree){
	var radian = degree *(Math.PI / 180);
	return radian;
}

//get the appropriate x coordinate based on value of cos(degree)
MyLoadAnimation1.prototype.getXCoord = function(radius, halfOfElementWidth, degree){
	var xCoord = (radius + ((radius - halfOfElementWidth) * Math.cos(this.getRadians(degree)))) - halfOfElementWidth;
	return xCoord;
}

//get the appropriate y coordinate based on value of sin(degree)
MyLoadAnimation1.prototype.getYCoord = function(radius, halfOfElementHeight, degree){
	var yCoord = (radius + ((radius - halfOfElementHeight) * Math.sin(this.getRadians(degree)))) - halfOfElementHeight;
	return yCoord;
}

MyLoadAnimation1.prototype.stopAnimation = function(){
	this.canPlay = false;
	clearTimeout(this.myTimer);
}

//main animate function
MyLoadAnimation1.prototype.animate = function(elementToAnimate, elementToAnimateWidth, elementToAnimateHeight, radiusOfContainer, degree, acceleration, moveSpeed){

	if(radiusOfContainer != 0){
		var mySelf = this;

		$(elementToAnimate).show();//just in case

		//redraw the element
		elementToAnimate.style.left = this.getXCoord(radiusOfContainer, (elementToAnimateWidth/2), degree) + "px";
		elementToAnimate.style.top = this.getYCoord(radiusOfContainer, (elementToAnimateHeight/2), degree) + "px";
		
		//update speed
		moveSpeed = moveSpeed + acceleration;
		degree = degree + moveSpeed;

		//decrease speed once halfway (sometimes won't be exact)
		if(degree >= 180){
			acceleration = acceleration * -1;
		}

		//stop if full revolution
		if(degree >= 360){
			this.counter++;
			if(this.counter == (this.elementsToAnimate.length)){
				this.counter = 0;
				setTimeout(function(){
					mySelf.startAnimation(0, mySelf.elementsToAnimate.length);
				},1000);
			}
			//prevent looping by returning
			return;
		}

		//loop to make "animation"
		if(this.canPlay){
			setTimeout(function(){
				mySelf.animate(elementToAnimate, elementToAnimateWidth, elementToAnimateHeight, radiusOfContainer, degree, acceleration, moveSpeed);
			}, 20);
		}
	}
}

MyLoadAnimation1.prototype.startAll = function(){
	this.canPlay = true;
	this.startAnimation(0,this.elementsToAnimate.length);
}

//cascade elements in array
MyLoadAnimation1.prototype.startAnimation = function(current, stop){
	var mySelf = this;
	if(current < stop && this.canPlay){
		this.animate(this.elementsToAnimate[current], this.circleSize, this.circleSize, this.radius, 0, 0.15, 3);
		this.myTimer = setTimeout(function(){
			mySelf.startAnimation((current + 1), stop);
		}, 100);
	}
}

/********************************************************************************************************************************************
 END Load Animation Prototype
********************************************************************************************************************************************/

var categories = [
	"Star Wars",
	"Chewbacca",
	"Darth Vader",
	"Obi-Wan Kenobi",
	"Lightsaber",
	"TIE Fighter",
	"X-Wing",
	"Han Solo",
	"Mark Hamill",
	"Harrison Ford",
	"Carrie Fisher",
	"R2-D2"
];

function removeLoadAnimation(gif,loadAnimationContainer){
	gif.removeEventListener("load", function(){
	    		
	});
	$(loadAnimationContainer).remove();
}

function buildCircle(){
	var circle = document.createElement("div");
	$(circle).addClass("circle");
	return circle;
}

function buildLoadAnimationContainer(){
	var loadContainer = document.createElement("div");
	$(loadContainer).addClass("loadContainer");
	var elementsToAnimate = [];
	for(i = 0; i < 3; i++){
		var circle = buildCircle();
		elementsToAnimate.push(circle);
		$(loadContainer).append($(circle));
	}
	var loadAnimation = new MyLoadAnimation1(elementsToAnimate, 75, 12);
	loadAnimation.startAll();
	return loadContainer;
}

function buildButton(button){
	var myButton = $("<div>");
	myButton.addClass("myButton");
	myButton.attr("data-button-id",button);
	myButton.html(button);
	return myButton;
}

function buildButtons(buttons){
	var buttonsContainer = $("#buttonsContainer");
	buttonsContainer.html("");
	for(i = 0; i < buttons.length; i++){
		buttonsContainer.append(buildButton(buttons[i]));
	}
}

function buildGif(gifData){
	var myCardWrapper = $("<div>");
	myCardWrapper.addClass("myCardWrapper");
	myCardWrapper.addClass("col-lg-3");
	myCardWrapper.addClass("col-md-4");
	myCardWrapper.addClass("col-sm-6");
	myCardWrapper.addClass("col-xs-12");
	var myCard = $("<div>");
	myCard.addClass("myCard");
	var imageWrapper = $("<div>");
	imageWrapper.addClass("imageWrapper");
	var gif = document.createElement("img");
	$(gif).attr("src", gifData.images.fixed_height_still.url);
	$(gif).attr("alt", "star wars gif");
	$(gif).attr("data-gif-playing", "false");
	$(gif).attr("data-still", gifData.images.fixed_height_still.url);
	$(gif).attr("data-animated",gifData.images.fixed_height.url);
	$(gif).addClass("cardImage");
	imageWrapper.html($(gif));
	myCard.append(imageWrapper);
	var loadAnimationContainer = buildLoadAnimationContainer()
	myCard.append($(loadAnimationContainer));
	gif.addEventListener("load", function (){
		removeLoadAnimation(gif,loadAnimationContainer);
	});
	myCardWrapper.html(myCard);
	return myCardWrapper;
}

$(document).ready(function(){
	buildButtons(categories);

	// This function handles events where the submit button is clicked
	$("#mySubmitButton").on("click", function(event) {
		event.preventDefault();
	    var category = $("#categoryInputId").val();
	    if(categories.indexOf(category) === -1){
	      categories.push(category);
	      $("#buttonsContainer").append(buildButton(category));
	    }
	});

	$(document).on('click', ('.myButton'), function() {
		var catName = $(this).data("button-id");
		var queryUrl = "https://api.giphy.com/v1/gifs/search?api_key=9fcf1ba630614fef984f58f53399edfe&limit=10&rating=PG-13&q=" + encodeURI(catName);
		$.ajax({
			url:queryUrl,
			method:"GET",
		}).done(function(data){
			console.log(data);
			var myData = data.data;
			var giphsCont = $("#giphsContainer");
			giphsCont.html("");
			for(var i = 0; i < myData.length; i++){
				giphsCont.append(buildGif(myData[i]));
			}
		});
	});

	$(document).on('click', ('.myCard'), function() {
		var gif = $(this).find("img")[0];
		var loadAnimationContainer = buildLoadAnimationContainer()
		$(this).append(loadAnimationContainer);
		gif.addEventListener("load",function(){
			removeLoadAnimation(gif,loadAnimationContainer);
		});
		var playing = $(gif).data("gif-playing");
		if(playing === false){
			$(gif).attr("src", $(gif).data("animated"));
			$(gif).data("gif-playing", true);
		} else {
			$(gif).attr("src", $(gif).data("still"));
			$(gif).data("gif-playing", false);
		}
	});

});