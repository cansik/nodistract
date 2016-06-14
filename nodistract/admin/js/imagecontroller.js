/**
 * Function to load all Images of a certain user identified by the token in the localstorage
 */
function getImages(){

    // Clear Container of images to load all images into it
    $("#images>ul").html("");

    // Variable to build the html to display the images
    var htmlContent = "";

    $.ajax({
        type: 'GET',
        url: apiBaseUrl + "image?token=" + localStorage.token,
        success: function (data) {
            jQuery.each(data.images, function() {

                // Generate a Container for each image and append it to the htmlContent Variable
                htmlContent += generateImage(this);
            });
        },
        async: false
    });


    $("#images>ul").html(htmlContent);
}

/**
 * Function to upload a image into the system.
 * @param obj
 */
function postImage(imageObj) {
    var obj;
    $.ajax({
        type: 'POST',
        url: apiBaseUrl + "image?token=" + localStorage.token,
        data: JSON.stringify(imageObj),
        dataType: 'json',
        success: function (data) {
            obj = data;            
        },
        async: false
    });
    return obj;
}

/**
 * Function to delete a post with a certain id
 * @param id Id of the Image
 */
function deleteImage(imageId) {
    $.ajax({
        type: 'DELETE',
        url: apiBaseUrl + 'image/' + imageId + '?token=' + localStorage.token,        
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
function uploadFiles(){

    // Get all files from the Uploadfield
    var files = document.querySelector('input[type=file]').files;

    if (files) {
        // Call our inside-Function for every choosen file
        jQuery.each(files, function() {
            readAndPreview(this);
        });
    }
}

/**
 * Function to read a choosen file, upload it into the database and display it within a tag on the website
 * @param file image
 */
function readAndPreview(file) {

    // Make sure `file.name` matches our extensions criteria
    if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
        // Create a FileReader to read a single file
        var reader = new FileReader();
       // reader.onload = function (event) {
        reader.addEventListener("load", function () {
            // read attributes from file and store them into an object
            var object = {"title": file.name, "data": this.result};			
            // pass Object to save the image
            var imageProperties = postImage(object);

            // generate imageObj with all Parameters
            var imageObj = {"title":file.name,"id":imageProperties.id,"data":this.result};

            // add new generated Imagetag to the container to display the image in the selection
            $("#images>ul").append(generateImage(imageObj));

        },false);

        // read the file
        reader.readAsDataURL(file);
    }
}