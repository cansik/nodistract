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
 * Function to add a new post. Makes a ajax-POST call with a json-Object on a REST-API
 */
function addPost() {

    // Object which contains the content of a post
    var body = {
        "title": $("#title").val(),
        "path": $("#title").val().split(' ').join('-').toLowerCase(),
        "content": $("#content").val(),
        "published": ($("#publishEntry").is(":checked") ? 1 : 0),
        "author_id": localStorage.userId + ""
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
    return article;
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