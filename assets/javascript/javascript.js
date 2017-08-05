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
	var gif = $("<img>");
	gif.attr("src", gifData.images.fixed_height_still.url);
	gif.attr("alt", "star wars gif");
	gif.attr("data-gif-playing", "false");
	gif.attr("data-still", gifData.images.fixed_height_still.url);
	gif.attr("data-animated",gifData.images.fixed_height.url);
	gif.addClass("cardImage");
	imageWrapper.html(gif);
	myCard.html(imageWrapper);
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
		var queryUrl = "https://api.giphy.com/v1/gifs/search?api_key=9fcf1ba630614fef984f58f53399edfe&limit=10&q=" + encodeURI(catName);
		$.ajax({
			url:queryUrl,
			method:"GET",
		}).done(function(data){
			console.log(data);
			var myData = data.data;
			var giphsCont = $("#giphsContainer");
			giphsCont.html("");
			for(i = 0; i < myData.length; i++){
				giphsCont.append(buildGif(myData[i]));
			}
		});
	});

	$(document).on('click', ('.myCard'), function() {
		var gif = $(this).find("img")[0];
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