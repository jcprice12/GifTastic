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
	var gif = $("<img>");
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
		console.log($(this));
		console.log(catName);
		var queryUrl = "https://api.giphy.com/v1/gifs/search?api_key=9fcf1ba630614fef984f58f53399edfe&limit=10&q=" + encodeURI(catName);
		$.ajax({
			url:queryUrl,
			method:"GET",
		}).done(function(data){
			console.log(data);
			
		});
	});

});