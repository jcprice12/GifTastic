/***********************************************************************************************************************************************************
	Load Animation Prototype
**********************************************************************************************************************************************************/
function MyLoadAnimation1(myParentContainer, mySize, myCircleSize, myNumberOfCircles, myColors){
	this.counter = 0;
	this.elementsToAnimate = [];
	this.size = mySize;
	this.radius = (mySize/2);
	this.circleSize = myCircleSize;
	this.canPlay = true;
	this.myTimer = null;
	this.colors = myColors;
	this.numberOfCircles = myNumberOfCircles;
	this.parentContainer = myParentContainer;
	this.loadContainer = null;
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


//remove the loadAnimation from the parent container
MyLoadAnimation1.prototype.removeAnimation = function(){
	$(this.loadContainer).remove();
}


//build the html and css for a circle in the load animation
MyLoadAnimation1.prototype.buildCircle = function(color){
	var circle = document.createElement("div");
	$(circle).addClass("loadCircle");
	$(circle).css("position","absolute");
	$(circle).css("width", (this.circleSize + "px"));
	$(circle).css("height", (this.circleSize + "px"));
	$(circle).css("border-radius","50%");
	$(circle).css("background-color", color +"");
	$(circle).css("display", "none");
	return circle;
}


//build the html and css for the load animation to take place in
MyLoadAnimation1.prototype.buildHTML = function(){
	myLoadContainer = document.createElement("div");
	$(myLoadContainer).addClass("loadContainer");
	$(myLoadContainer).css("position", "absolute");
	$(myLoadContainer).css("margin", "auto");
	$(myLoadContainer).css("left", "0");
	$(myLoadContainer).css("right", "0");
	$(myLoadContainer).css("top", "0");
	$(myLoadContainer).css("bottom", "0");
	$(myLoadContainer).css("height", (this.size + "px"));
	$(myLoadContainer).css("width", (this.size + "px"));
	$(myLoadContainer).css("-webkit-transform", "rotate(270deg)");
	$(myLoadContainer).css("-moz-transform", "rotate(270deg)");
	$(myLoadContainer).css("-o-transform", "rotate(270deg)");
	$(myLoadContainer).css("-ms-transform", "rotate(270deg)");
	$(myLoadContainer).css("transform", "rotate(270deg)");
	var colorCounter = 0;
	for(i = 0; i < this.numberOfCircles; i++){
		if(colorCounter >= this.colors.length){
			colorCounter = 0;
		}
		var circle = this.buildCircle(this.colors[colorCounter]);
		colorCounter++;
		this.elementsToAnimate.push(circle);
		$(myLoadContainer).append($(circle));
	}
	this.loadContainer = myLoadContainer;
	return this.loadContainer;
}

//stop the animation
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

//should be called when initially starting the animation
MyLoadAnimation1.prototype.startAll = function(){
	//console.log("hey");
	this.canPlay = true;
	$(this.parentContainer).append(this.buildHTML());
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

//initial array of categories to search gifs for
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

//build category button
function buildButton(button){
	var myButton = $("<div>");
	myButton.addClass("myButton");
	myButton.attr("data-button-id",button);
	myButton.html(button);
	return myButton;
}

//build all category buttons for given array
function buildButtons(buttons){
	var buttonsContainer = $("#buttonsContainer");
	buttonsContainer.html("");
	for(i = 0; i < buttons.length; i++){
		buttonsContainer.append(buildButton(buttons[i]));
	}
}

//build the gif image as well as its style containers
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
	//add load animation to the image
	var loadAnimation = new MyLoadAnimation1(myCard,75,12,3,["#ffd700"]);
	loadAnimation.startAll();
	//on load, remove the load animation and event listener
	//I'm concerned about a memory leak here or something. If the load animation objects aren't properly deleted
	//by the garbage collector, this application could end up using a lot of memory without letting it go.
	gif.addEventListener("load", function (){
		gif.removeEventListener("load", function(){
			//nothing
		});
		loadAnimation.stopAnimation();
		loadAnimation.removeAnimation();
	});
	myCardWrapper.html(myCard);
	return myCardWrapper;
}

//listeners mostly placed here
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

	//get the gif data when a category button is clicked
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

	//switch playing/not-playing adds load animation and removes it when loaded
	$(document).on('click', ('.myCard'), function() {
		var gif = $(this).find("img")[0];
		var loadAnimation = new MyLoadAnimation1($(this),75,12,3,["#ffd700"]);
		loadAnimation.startAll();
		gif.addEventListener("load", function (){
			gif.removeEventListener("load", function(){
				//nothing
			});
			loadAnimation.stopAnimation();
			loadAnimation.removeAnimation();
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