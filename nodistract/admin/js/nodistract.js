var apiBaseUrl = 'http://easyguet.ch/nodistract/public/api/';

var redirectUrl = 'https://easyguet.ch/nodistract/public/';

var spellChecker = 'https://bingapis.azure-api.net/api/v5/spellcheck?Spell';

var images = [];

var token = "";

function login(username,password){

    var error="";

    $.ajax({
        type: 'POST',
        url: apiBaseUrl + "login",
        data: JSON.stringify({'username':username,'password':SHA256(password)}),
        success: function(data){
            if(data['error'] == undefined){
                localStorage.token = data["token"];
            } else {
                error = data['error'];
            }
        },
        dataType: 'json',
        async:false
    });

    return error;
}

function logout(){
    $.get( apiBaseUrl + "logout?token="+ localStorage.token, function() {
        localStorage.removeItem("token");
    });

    window.location.href = redirectUrl;
}

function getPosts(){
    $("#posts").html("");
    $.get( apiBaseUrl + "post?token="+ localStorage.token, function( data ) {
        jQuery.each(data["posts"], function() {
            console.log(this);
            $("#posts").append(generatePost(this));
        });
    });
}

function getImages(){
    $("#images").html("");
    $("#images").append("<ul>");
    $.get( apiBaseUrl + "image?token="+ localStorage.token, function( data ) {
        jQuery.each(data["images"], function() {
            $("#images").append(generateImage(this));
        });
    });
    $("#images").append("</ul>");
}



function addPost() {

    var body = {
        "title": $("#title").val(),
        "path": $("#title").val().split(' ').join('-').toLowerCase(),
        "content": $("#content").val(),
        "published": ($("#publishEntry").is(":checked") ? 1 : 0),
        "author_id": 1
    };

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

function generateImage(image) {

    var label = "<li><input type='checkbox' id='cb_"+image["id"]+"' /><label for='cb_"+image["id"]+"'><img class='blogImage' src='" + image["data"] + "' title='" + image["title"] + "' id='"+image["id"]+"'/><span class='close'></span></label></li>";
    return label;
}

function generatePost(post) {
    var title = post["title"];
    var id = post["id"];
    var content = post["content"];
    var published = post["published"];
    var row = "<div class='row' id='entry_" + id + "'>" +
        "<span class='icon icon-pencil' onclick='loadPostToEdit(" + id + ")'></span>" +
        "<span class='icon icon-remove' onclick='deletePost(" + id + ");getPosts();'></span> " +
        (published ? "<span class='icon icon-share'></span> " : "<span class='icon icon-lock' '></span> ") +
        "<div class='col-md-3 col-md-offset-3'><span class='title'>" + title + "</span></div>" +
        "<div class='col-md-3 col-md-offset-3'><span class='content'>" + content + "</span></div>" +
        "<input type='hidden' value='" + published + "' name='published' />" +
        "</div>" +
        "<hr />";

    return row;
}

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

function loadPostToEdit(id) {

    var title = $("#entry_" + id + " span.title").html();
    var content = $("#entry_" + id + " span.content").html();

    var pub = $("#entry_" + id + " input")[0];
    $("#publishEntry").prop('checked', false);

    if ($(pub).val() == "true") {
        $("#publishEntry").prop('checked', true);
    }

    $("#title").val(title);
    $("#content").val(content);
    $("#entryId").val(id);
}

function savePost() {
    if ($("#entryId").val() != "") {
        deletePost($("#entryId").val());
    }
    addPost();
    getPosts()
}

function clearForm(){
    $("#title").val("");
    $("#content").val("");
    $("#entryId").val("");
    $("#publishEntry").attr("checked", false);
}

function previewFiles() {

    var files = document.querySelector('input[type=file]').files;

    function readAndPreview(file) {

        // Make sure `file.name` matches our extensions criteria
        if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
            var reader = new FileReader();

            var reader = new FileReader();
            reader.onload = function (event) {
                var object = {"title": file.name, "data": event.target.result};
                postImage(object);
            };
            reader.readAsDataURL(file);
        }

    }

    if (files) {
        [].forEach.call(files, readAndPreview);
    }
}

$(window).load(function () {

    $("#form").hide();

    if (localStorage.token) {
        $("#form").show();
        getPosts();
        getImages();
    } else {
        $("#loginDialog").html(generateLoginForm());
        $("#loginDialog").modal("show");
    }

    $('body').on('click', '#loginBtn', function () {
        var res = login($("#username").val(), $("#password").val());
        if (localStorage.token) {
            $('#loginDialog').modal('hide');
            $("#loginDialog").html("");
            $("#form").show();
            getPosts();
            getImages();
        } else {
            $("#loginDialog").modal("show");
            $("#errorMessage").html(res);
        }
    });

    $('body').on('click', '.blogImage', function () {
        var id = $(this).attr("id");
        var imageUrl = "!["+ $(this).attr("title")+"]("+apiBaseUrl+"image/"+id+")";
        $("#content").val( $("#content").val() + imageUrl);
    });

    $("#btnClear").click(function () {
        clearForm();
    });

    $("#btnSave").click(function () {
        savePost();
        clearForm();
    })

    $('body').on('click','.close', function() {
        var img = $(this).parent().find("img")[0];
        deleteImage($(img).attr("id"));
        getImages();
    });
});
