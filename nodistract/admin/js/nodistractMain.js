/**
 * Function to login user. Makes a ajax-POST call with a json-Object on a REST-API on the server.
 * @param username
 * @param password
 * @returns error if exists
 */
function login(username,password){

    var error="";

    // Post with ajax to login user
    $.ajax({
        type: 'POST',
        url: apiBaseUrl + "login",
        data: JSON.stringify({'username':username,'password':SHA256(password)}),
        success: function(data){
            if(data.error === undefined){

                // If no error is return, save the returned token into localstorage to identify the loggedin user
                localStorage.token = data.token;

                // save userid into localStorage
                localStorage.userId = data.id;
            } else {
                error = data.eror;
            }
        },
        dataType: 'json',
        async:false
    });

    return error;
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
 * Function to generate the Loginform. The loginform is only displayed when the user is not logged in. Thats why the loginform gets created at runtime.
 * @returns {string} HTML with Loginform
 */
function generateLoginForm() {
    var loginBox = "<div class='modal-dialog'>" +
        "<div class='modal-content'>" +
        "<div class='modal-header'> " +
        "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
        " <h4 class='modal-title'>Login</h4> " +
        "<span id='errorMessage'></span>" +
        "</div> " +
        "<div class='modal-body'> " +
        " <input type=text' id='username' placeholder='username' />" +
        " <input type='password' id='password' placeholder='password'/> " +
        "</div> " +
        "<div class='modal-footer'> " +
        "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button> " +
        "<button type='button' class='btn btn-primary' id='loginBtn'>Login</button> " +
        "</div>" +
        "</div>" +
        "</div>";

    return loginBox;
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
$(window).load(function () {

    // Hide the form first
    $("#form").hide();

    // Check if a token exists so if the user is logged in
    if (localStorage.token) {

        // Display the form
        $("#form").show();

        // Load Posts and images
        getPosts();
        getImages();
    } else {

        // generate and show the login-form
        $("#loginDialog").html(generateLoginForm());
        $("#loginDialog").modal("show");
    }

    // Register a clicklistener on the element with the ID loginBTN
    $('body').on('click', '#loginBtn', function () {

        // try login with the credentials of the login-form
        var res = login($("#username").val(), $("#password").val());

        // check if token has been set
        if (localStorage.token) {

            // remove login-form
            $('#loginDialog').modal('hide');
            $("#loginDialog").html("");

            // Display the form
            $("#form").show();

            // Load Posts and images
            getPosts();
            getImages();
        } else {

            // show the login-form
            $("#loginDialog").modal("show");

            // display the errormessage of the invalid login
            $("#errorMessage").html(res);
        }
    });

    // Register a clicklistener on elements with the class blogImage to add Images as Markupcode into the textarea of the form
    $('body').on('click', '.blogImage', function () {

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
    $("#btnSave").click(function () {
        savePost();
        clearForm();
    });

    // Register a Clickevent on elements with the class close to display a cross on the images to remove the images form the system
    $('body').on('click','.close', function() {

        // Find the first img-Tag from the parent of the affected element
        var img = $(this).parent().find("img")[0];

        // Remove the image form the system by call deleteImage with passing the image-Id as parameter
        deleteImage($(img).attr("id"));

        // Reload all existing images
        getImages();
    });
});
