/**
 * Function to login user. Makes a ajax-POST call with a json-Object on a REST-API on the server.
 * @param username
 * @param password
 * @returns error if exists
 */
function login(e){
    e.preventDefault();

	var username = $("#username").val();
	var pwd = $("#password").val();

    // Post with ajax to login user
    $.ajax({
        type: 'POST',
        url: apiBaseUrl + "login",
        data: JSON.stringify({'username':username,'password':SHA256(pwd)}),
        success: loginSuccess,
		error: loginError,
        dataType: 'json',
        async: false
    });    		
}

function loginError(data) {	          	
	// show the login-form
	$("#loginWrapper").show();
	// display the errormessage of the invalid login
	$("#alertError").show();
}

function loginSuccess(data) {	 
	if(data.error !== undefined){
		loginError(data);
		return; 
	}	
	
	localStorage.token = data.token;	
			
	// save userid into localStorage	
	localStorage.userId = data.id;
	
	$("#alertError").hide();
	// Remove login form
	$('#loginWrapper').hide();            
	// Display dashboard
	$("#wrapper").show();
	// Load Posts and images
	getPosts();
	getImages();
}

/**
 * Function to logout a user of the system. Removes the token from the localstorage
 */
function logout(){
    $.get( apiBaseUrl + "logout?token="+ localStorage.token, function(){
        localStorage.removeItem("token");
    });

    window.location.href = redirectUrl;
}

/**
 * Function to clear all fields of the form
 */
function clearForm(){
    $("#title").val("");
    $("#content").val("");
    $("#entryId").val("");
    $("#publishEntry").attr("checked", false);
}

/**
 * Executed when the window has been loaded
 */
$(document).ready(function () {

    // Hide the form first
    $("#wrapper").hide();
	$("#loginWrapper").hide();
	$("#alertError").hide();

    // Check if a token exists so if the user is logged in
    if (localStorage.token) {
        // Display the form
        $("#wrapper").show();

        // Load Posts and images
        getPosts();
        getImages();
    } else {
        // show the login-form        		
        $("#loginWrapper").show();		
    }

    // Register a clicklistener on the element with the ID loginBTN
    $('#loginForm').on('submit', login);

    // Register a clicklistener on elements with the class blogImage to add Images as Markupcode into the textarea of the form
    $('.blogImage').on('click', function () {

        // Get the value of the attr id of the registred element
        var id = $(this).attr("id");

        // Generate Markup with URL and title of the IMage
        var imageUrl = "!["+ $(this).attr("title")+"]("+apiBaseUrl+"image/"+id+")";

        // Add the generated Markup into the textarea of the form
        $("#content").val( $("#content").val() + imageUrl);
    });

    // Register a Clickevent on the elment with the id btnClear to clear the form
    $("#btnClear").click(function () {
        clearForm();
    });

    // Register a Clickevent on the elment with the id btnSave to save a post and clear the form
    $("#addPostForm").submit(function (e) {
		e.preventDefault();
        savePost();
        clearForm();
    });

    // Register a Clickevent on elements with the class close to display a cross on the images to remove the images form the system
    $('body').on('click','.close', function() {

        // Find the first img-Tag from the parent of the affected element
        var img = $(this).parent().find("img")[0];

        // Remove the image form the system by call deleteImage with passing the image-Id as parameter
        deleteImage($(img).attr("id"));

        // Remove the image from the DOM with all associated elements
        $(this).closest("li").remove();
    });
});
