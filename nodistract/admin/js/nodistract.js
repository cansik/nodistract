var apiBaseUrl = 'http://easyguet.ch/nodistract/public/api/';

var redirectUrl = 'https://easyguet.ch/nodistract/public/';


var token = "";


function login(username,password){

    var error="";

    $.ajax({
        type: 'POST',
        url: apiBaseUrl + "login",
        data: JSON.stringify({'username':username,'password':SHA256(password)}),
        success: function(data){
            if(data['error'] == undefined){
                $.cookie('token',data["token"]);
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
    $.get( apiBaseUrl + "logout?token="+ $.cookie('token'), function() {
        $.removeCookie('token');
    });

    window.location.href = redirectUrl;
}

function getPosts(){
    $("#posts").html("");
    $.get( apiBaseUrl + "post?token="+ $.cookie('token'), function( data ) {
        jQuery.each(data["posts"], function() {
            console.log(this);
            $("#posts").append(generatePost(this));
        });
    });
}

function addPost(){
    var body = {
        "title":$("#title").val(),
        "path": $("#title").val().split(' ').join('-').toLowerCase(),
        "content":$("#content").val(),
        "published":($("#publishEntry").is(":checked") ? 1 : 0),
        "author_id":1
    };

    $.ajax({
        type: 'POST',
        url: apiBaseUrl + "post?token="+ $.cookie('token'),
        data:JSON.stringify(body),
        dataType:'json',
        success: function(data) { console.log("ADd completed");},
        async:false
    });
}

function deletePost(id){
    $.ajax({
        type: 'DELETE',
        url: apiBaseUrl + 'post/'+id+'?token='+$.cookie('token'),
        success: function() { console.log("Delete completed");},
        async:false
    });
}

function generatePost(post) {
    var title = post["title"];
    var id = post["id"];
    var content = post["content"];
    var published = post["published"];
    var row = "<div class='row' id='entry_"+id+"'>" +
        "<span class='icon icon-pencil' onclick='loadPostToEdit("+id+")'></span>" +
        "<span class='icon icon-remove' onclick='deletePost("+id+");getPosts();'></span> " +
        (published ? "<span class='icon icon-share'></span> " : "<span class='icon icon-lock' '></span> ") +
        "<div class='col-md-3 col-md-offset-3'><span class='title'>"+title+"</span></div>" +
        "<div class='col-md-3 col-md-offset-3'><span class='content'>"+content+"</span></div>" +
        "<input type='hidden' value='"+published+"' name='published' />"+
        "</div>" +
        "<hr />";
    
    return row;
}

function generateLoginForm(){
    var loginBox = "<div class='modal-dialog'>" +
        "<div class='modal-content'>" +
        "<div class='modal-header'> " +
        "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
        " <h4 class='modal-title'>Login</h4> " +
        "<span id='errorMessage'></span>"    +
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

function loadPostToEdit(id){

    var title = $("#entry_"+id +" span.title").html();
    console.log(title);
    var content = $("#entry_"+id +" span.content").html();

    var pub = $("#entry_"+id +" input")[0];
    $("#publishEntry").prop('checked', false);

    if($(pub).val() == "true"){
      $("#publishEntry").prop('checked', true);
    }

    $("#title").val(title);
    $("#content").val(content);
    $("#entryId").val(id);
}

function savePost(){
    if($("#entryId").val() != ""){
        deletePost($("#entryId").val());
    }
    addPost();
    getPosts();
}



$(window).load(function() {

    $("#form").hide();

    if ($.cookie('token') == undefined) {
        $("#loginDialog").html(generateLoginForm());
        $("#loginDialog").modal("show");
    }  else {
        $("#form").show();
        getPosts();
    }

    $('body').on('click', '#loginBtn', function () {
        var res = login($("#username").val(),$("#password").val());
        if ($.cookie('token') == undefined) {
            $("#loginDialog").modal("show");
            $("#errorMessage").html(res);
        } else {
            $('#loginDialog').modal('hide');
            $("#loginDialog").html("");
            $("#form").show();
            getPosts();
        }
    });

    $("#btnClear").click(function(){
        $("#title").val("");
        $("#content").val("");
        $("#entryId").val("");
        $("#publishEntry").attr("checked", false);
    });

    $("#btnSave").click(function(){
        savePost();
    })
});