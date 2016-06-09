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
    var label = "<li><article><label for='cb_"+imageId+"'><img class='blogImage' src='" + image.data + "' title='" + image.title + "' id='"+imageId+"'/><span class='close'></span></label></article></li>";
    return label;
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