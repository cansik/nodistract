// Constant for API
var apiBaseUrl = 'http://easyguet.ch/nodistract/public/api/';

// Constant for Redirecturl after logout
var redirectUrl = 'https://easyguet.ch/nodistract/public/';

// Constant for Spell-API
var spellChecker = 'https://bingapis.azure-api.net/api/v5/spellcheck?Spell';


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
            // Check if error is returned or not
            if(data.error === undefined){

                // If no error is return, save the returned token into localstorage to identify the loggedin user
                localStorage.token = data.token;
            } else {
                error = data.eror;
            }
        },
        dataType: 'json',
        async:false
    });

    return error;
}

function test(){
    localStorage.removeItem("token");
}

/**
 * Function to logout a user of the system. Removes the token from the localstorage
 */
function logout(){
    $.get( apiBaseUrl + "logout?token="+ localStorage.token, test());

    window.location.href = redirectUrl;
}

/**
 * Function to load all Posts of a certain user identified by the token in the localstorage
 */
function getPosts(){

    // Clear Container for the posts before loading posts into it
    $("#posts").html("");

    $.get( apiBaseUrl + "post?token="+ localStorage.token, function( data ) {
        jQuery.each(data.posts, function() {

            // Generate a Container for each post and append it into the main-Post-Container
            $("#posts").append(generatePost(this));
            $("#posts").append("<br />");
        });
    });
}

/**
 * Function to load all Images of a certain user identified by the token in the localstorage
 */
function getImages(){

    // Clear Container of images to load all images into it
    $("#images").html("");
    $("#images").append("<ul>");
    $.get( apiBaseUrl + "image?token="+ localStorage.token, function( data ) {
        jQuery.each(data.images, function() {

            // Generate a Container for each image and append it into the main-Image-Container
            $("#images").append(generateImage(this));
        });
    });
    $("#images").append("</ul>");
}


/**
 * Function to add a new post. Makes a ajax-POST call with a json-Object on a REST-API
 */
function addPost() {

    // Object which contains the content of a post
    var body = {
        "title": $("#title").val(),
        "path": $("#title").val().split(' ').join('-').toLowerCase(),
        "content": $("#content").val(),
        "published": ($("#publishEntry").is(":checked") ? 1 : 0),
        "author_id": 1
    };

    // Generate and execute Ajaxcall with the postinformations
    $.ajax({
        type: 'POST',
        url: apiBaseUrl + "post?token=" + localStorage.token,
        data: JSON.stringify(body),
        dataType: 'json',
        success: function (data) {
            console.log("Add completed");
        },
        async: false
    });
}

/**
 * Function to delete a post with a certain id
 * @param id Id of the Post
 */
function deletePost(id) {
    $.ajax({
        type: 'DELETE',
        url: apiBaseUrl + 'post/' + id + '?token=' + localStorage.token,
        success: function () {
            console.log("Delete completed");
        },
        async: false
    });

}

/**
 * Function to upload a image into the system.
 * @param obj
 */
function postImage(obj) {
    $.ajax({
        type: 'POST',
        url: apiBaseUrl + "image?token=" + localStorage.token,
        data: JSON.stringify(obj),
        dataType: 'json',
        success: function (data) {
            console.log("Imageupload completed");
        },
        async: false
    });
}

/**
 * Function to delete a post with a certain id
 * @param id Id of the Image
 */
function deleteImage(id) {
    $.ajax({
        type: 'DELETE',
        url: apiBaseUrl + 'image/' + id + '?token=' + localStorage.token,
        success: function () {
            console.log("Delete completed");
        },
        async: false
    });
}

/**
 * Function to generate Tags for displaying the passed Image-Object.
 * @param image Image-Object
 * @returns {string} HTML which displays the image
 */
function generateImage(image) {
    var imageId = image.id;
    //var label = "<li><input type='checkbox' id='cb_"+image["id"]+"' /><label for='cb_"+image["id"]+"'><img class='blogImage' src='" + image["data"] + "' title='" + image["title"] + "' id='"+image["id"]+"'/><span class='close'></span></label></li>";
    var label = "<li><input type='checkbox' id='cb_"+imageId+"' /><img class='blogImage' src='" + image.data + "' title='" + image.title + "' id='"+imageId+"'/><span class='close'></span></li>";
    var label = "<li><article><label for='cb_"+imageId+"'><img class='blogImage' src='" + image.data + "' title='" + image.title + "' id='"+imageId+"'/><span class='close'></span></label></article></li>";
    return label;
}

/**
 * Function the generate HTML to display a post on the page
 * @param post Post-entry
 * @returns {string} HTML which displays a post
 */
function generatePost(post) {
    var published_date = post.publish_date.date;
    var title = post.title;
    var id = post.id;
    var content = post.content;
    var published = post.published;
    var header = "<header><span class='icon icon-pencil' onclick='loadPostToEdit(" + id + ")'></span><span class='icon icon-remove' onclick='deletePost(" + id + ");getPosts();'></span>"+(published ? "<span class='icon icon-share'></span> " : "<span class='icon icon-lock' '></span> ")+"</header>";
    var contentPart = "<p><time>"+ published_date +"</time>|<span class='title'>" +title + "</span></p><details><summary>Extend Content</summary><p><span class='content'>" + content + "</span><input type='hidden' value='" + published + "' name='published' /></p></details>";
    var article = "<article id='entry_"+id+"'>" + header + contentPart + "</article>";
    /*
    var row = "<div class='row' id='entry_" + id + "'>" +
        "<span class='icon icon-pencil' onclick='loadPostToEdit(" + id + ")'></span>" +
        "<span class='icon icon-remove' onclick='deletePost(" + id + ");getPosts();'></span> " +
        (published ? "<span class='icon icon-share'></span> " : "<span class='icon icon-lock' '></span> ") +
        "<div class='col-md-3 col-md-offset-3'><span class='title'>" + title + "</span></div>" +
        "<div class='col-md-3 col-md-offset-3'><span class='content'>" + content + "</span></div>" +
        "<input type='hidden' value='" + published + "' name='published' />" +
        "</div>" +
        "<hr />";
    */

    return article;
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
 * Function to load a certain post into the form for editing the post
 * @param id Postid
 */
function loadPostToEdit(id) {

    // get title of Post
    var title = $("#entry_" + id + " span.title").html();

    // get Content of Post
    var content = $("#entry_" + id + " span.content").html();

    // get Publification of Post
    var pub = $("#entry_" + id + " input")[0];
    $("#publishEntry").prop('checked', false);

    if ($(pub).val() == "true") {
        // Enable Checkbox if Post is published
        $("#publishEntry").prop('checked', true);
    }

    // Set values from post into the form
    $("#title").val(title);
    $("#content").val(content);
    $("#entryId").val(id);
}

/**
 * Function to save a Post
 */
function savePost() {

    // Check if hiddenId-Field is not empty.
    if ($("#entryId").val() !== "") {

        // An existing post was edited. Now remove the post first from the database.
        deletePost($("#entryId").val());
    }

    // Save the post into the databse with all the informations
    addPost();

    // Load all Posts from the database
    getPosts();
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
 * Function to choose Images and upload them into the database
 */
function previewFiles() {

    // Get all files from the Uploadfield
    var files = document.querySelector('input[type=file]').files;

    // Inside-Function to read a choosen file
    function readAndPreview(file) {

        // Make sure `file.name` matches our extensions criteria
        if (/\.(jpe?g|png|gif)$/i.test(file.name)) {

            // Create a FileReader to read a single file
            var reader = new FileReader();
            reader.onload = function (event) {

                // read attributes from file and store them into an object
                var object = {"title": file.name, "data": event.target.result};

                // pass Object to save the image
                postImage(object);
            };

            // read the file
            reader.readAsDataURL(file);
        }

    }

    if (files) {
        // Call our inside-Function for every choosen file
        [].forEach.call(files, readAndPreview);
    }
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
