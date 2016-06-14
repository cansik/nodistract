/**
 * Function to load all Posts of a certain user identified by the token in the localstorage
 */
function getPosts(){
    // Clear Container for the posts before loading posts into it
    $("#postWrapper").html("");

    $.get( apiBaseUrl + "post?token="+ localStorage.token, function( data ) {
        jQuery.each(data.posts, function() {
            // Generate a Container for each post and append it into the main-Post-Container
            $("#postWrapper").append(generatePost(this));            
        });
    });
}

/**
 * Function to add a new post. Makes a ajax-POST call with a json-Object on a REST-API
 */
function addPost() {

    // Check content of Post with Bing Check Spell API
    var content = checkSpell($("#content").val());

    // Object which contains the content of a post
    var postBody = {
        "title": $("#title").val(),
        "path": $("#title").val().split(' ').join('-').toLowerCase(),
        "content": content,
        "published": ($("#publishEntry").is(":checked") ? 1 : 0),
        "author_id": localStorage.userId + ""
    };

    // Generate and execute Ajaxcall with the postinformations
    $.ajax({
        type: 'POST',
        url: apiBaseUrl + "post?token=" + localStorage.token,
        data: JSON.stringify(postBody),
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
function deletePost(postId) {
    $.ajax({
        type: 'DELETE',
        url: apiBaseUrl + 'post/' + postId + '?token=' + localStorage.token,
        success: function () {
            // get title of Post
			$("#entry_" + postId).remove();
        },
        async: false
    });

}

/**
 * Function to convert a date into the format DD.MM.YYYY
 * @param date
 * @returns {string} formated date
 */
function returnFullDate(date){
    // Use momentJs to parse date and make easy access on datevalues
    var publishedDate = moment(date);
    // Return date as DD.MM.YYYY
    return publishedDate.day()+"."+publishedDate.month()+"."+publishedDate.year();
}

/**
 * Function the generate HTML to display a post on the page
 * @param post Post-entry
 * @returns {string} HTML which displays a post
 */
function generatePost(post) {    	    	    
	// Generate post element
	var node = '<a class="list-group-item"><h4 class="list-group-item-heading">' + post.title + '<span class="dateWrapper">' + returnFullDate(post.publish_date.date) + '</span><span class="glyphicon glyphicon-remove" onclick="deletePost('+ post.id+');" ></span><span class="glyphicon glyphicon-pencil" onclick="loadPostToEdit(' + post.id + ')"></span></h4><p class="list-group-item-text">' + post.content + '</p><input type="hidden" value="' + post.published + '" name="published"/></a>';	   	
	// Wrap element inside article element 
    var article = "<article id='entry_"+post.id+"'>" + node + "</article>";
	
	return article;
}

/**
 * Function to load a certain post into the form for editing the post
 * @param id Postid
 */
function loadPostToEdit(postId) {

    // get title of Post
    var title = $("#entry_" + postId + " h4.list-group-item-heading").clone()    //clone the element
																	 .children() //select all the children
																	 .remove()   //remove all the children
																	 .end()  //again go back to selected element
																	 .text();

    // get Content of Post
    var content = $("#entry_" + postId + " p.list-group-item-text").html();

    // get Publification of Post
    var pub = $("#entry_" + postId + " input")[0];
    $("#publishEntry").prop('checked', false);

    if ($(pub).val() == "true") {
        // Enable Checkbox if Post is published
        $("#publishEntry").prop('checked', true);
    }

    // Set values from post into the form
    $("#title").val(title);
    $("#content").val(content);
    $("#entryId").val(postId);
	$("html, body").animate({ scrollTop: 0 }, 600);
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