/**
 * Created by cansik on 26/05/16.
 */

var apiBaseUrl = 'http://easyguet.ch/nodistract/public/api/';

var token = '';

var lastPostId = 0;

// ---- basic web methods ----
function post(url, body, callback)
{
    url = apiBaseUrl + url + '?token=' + token;

    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            callback(JSON.parse(http.responseText));
        }
    };
    http.send(body);
}

function get(url, callback)
{
    url = apiBaseUrl + url + '?token=' + token;

    var http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            callback(JSON.parse(http.responseText));
        }
    };
    http.send();
}

function del(url, callback)
{
    url = apiBaseUrl + url + '?token=' + token;

    var http = new XMLHttpRequest();
    http.open("DELETE", url, true);
    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            callback(JSON.parse(http.responseText));
        }
    };
    http.send();
}

// ----- api functions -----

function login(username, password)
{
    post('login',  JSON.stringify({username: username, password: SHA256(password)}), function(result) {
        token = result.token;
        alert('logged in! token: ' + token);
    });
}

function logout()
{
    get('logout', function(result) {
        token = '';
        alert('you are logged out!');
    });
}

function getPosts()
{
    get('post', function(result) {
        alert('All Posts:' + JSON.stringify(result));
    });
}

function addPost()
{
    var body = {
        "title":"Example Post",
        "path":"example-post",
        "content":"Example! *Example*, **example**, `test`",
        "published":1,
        "author_id":1
    };
    post('post',  JSON.stringify(body), function(result) {
        lastPostId = result.id;
        alert('post added: ' + lastPostId);
    });
}

function deletePost()
{
    del('post/' + lastPostId, function(result) {
        alert('post deleted: ' + result.id);
    });
}