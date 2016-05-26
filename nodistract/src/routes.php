<?php

function getStringBetween($str,$from,$to)
{
    $sub = substr($str, strpos($str,$from)+strlen($from),strlen($str));
    return substr($sub,0,strpos($sub,$to));
}


function asJSON($data, $response)
{
    $response->getBody()->write(json_encode($data));
    return $response->withHeader('Content-type', 'application/json');
}

function asImage($base64String, $response)
{
    $contentType = getStringBetween($base64String, ':', ';');
    $data = substr($base64String, strpos($base64String,',')+1,strlen($base64String));

    $response->getBody()->write(base64_decode($data));
    return $response->withHeader('Content-type', $contentType);
}

function getCurrentUser($request)
{
    $getParams = $request->getQueryParams();

    // check token key
    if(!array_key_exists('token',$getParams))
        return null;

    $token = $getParams['token'];

    $userMapper = spot()->mapper('Entity\User');
    $user = $userMapper->first(['token' => $token]);

    return $user ? $user : null;
}

function unauthorizedError($response)
{
    return asJSON(array('error' => 'You are not logged in!'), $response);
}

$app->get('/', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("main route");

    $postMapper = spot()->mapper('Entity\Post');
    $result = $postMapper->where(['published' => 1])->select()->execute();
    $posts = $result->toArray();

    $params = array(
        "posts" => $posts
    );

    // Render index view
    return $this->renderer->render($response, 'index.phtml', $params);
});

$app->get('/post/{slug}', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("get page with slug route");

    $postMapper = spot()->mapper('Entity\Post');
    $result = $postMapper->where(['path' => $args['slug']])->select()->execute();
    $posts = $result->toArray();

    $params = array(
        "posts" => $posts
    );

    // Render index view
    return $this->renderer->render($response, 'index.phtml', $params);
});

// -----  API -----

// ----- images ----
$app->get('/api/image', function ($request, $response, $args) use ($app) {
    // check if user is logged in
    if(getCurrentUser($request) === null)
        return unauthorizedError($response);

    $imageMapper = spot()->mapper('Entity\Image');
    $result = $imageMapper->all()->select()->execute();
    $images = $result->toArray();

    foreach($images as $img) {
        $img['data'] = null;
        $img['url'] = '/api/image/'.$img['id'];
    }

    $result = array(
        "images" => $images
    );

    return asJSON($result, $response);
});

$app->get('/api/image/{id}', function ($request, $response, $args) use ($app) {
    $imageMapper = spot()->mapper('Entity\Image');
    $image = $imageMapper->first(['id' => $args['id']]);

    // check raw
    $getParams = $request->getQueryParams();
    if(!array_key_exists('raw',$getParams))
        return asImage($image->data, $response);

    return $image->data;
});

$app->post('/api/image', function ($request, $response, $args) use($app) {
    // check if user is logged in
    if(getCurrentUser($request) === null)
        return unauthorizedError($response);

    $this->logger->info("insert new image");

    $json = $request->getBody();
    $data = json_decode($json, true);

    $imageMapper = spot()->mapper('Entity\Image');
    $entity = $imageMapper->create($data);

    $result = array(
        "id" => $entity->id,
        "url" => '/api/image/'.$entity->id
    );

    return asJSON($result, $response);
});

$app->delete('/api/image/{id}', function ($request, $response, $args) use($app) {
    // check if user is logged in
    if(getCurrentUser($request) === null)
        return unauthorizedError($response);

    $id = $args['id'];
    $this->logger->info("delete image " . $id);

    $imageMapper = spot()->mapper('Entity\Image');
    $entity = $imageMapper->first(['id' => $id]);

    if ($entity) {
        $imageMapper->delete($entity);
    }

    $result = array(
        "id" => $id
    );

    return asJSON($result, $response);
});


// ----- posts -----

$app->get('/api/post', function ($request, $response, $args) use ($app) {
    // check if user is logged in
    if(getCurrentUser($request) === null)
        return unauthorizedError($response);

    $this->logger->info("main route");

    $postMapper = spot()->mapper('Entity\Post');
    $result = $postMapper->all()->select()->execute();
    $posts = $result->toArray();

    $result = array(
        "posts" => $posts
    );

    return asJSON($result, $response);
});

$app->post('/api/post', function ($request, $response, $args) use($app) {
    // check if user is logged in
    if(getCurrentUser($request) === null)
        return unauthorizedError($response);

    $this->logger->info("insert new post");

    $json = $request->getBody();
    $data = json_decode($json, true);

    $postMapper = spot()->mapper('Entity\Post');
    $entity = $postMapper->create($data);

    $result = array(
        "id" => $entity->id
    );

    return asJSON($result, $response);
});

$app->delete('/api/post/{id}', function ($request, $response, $args) use($app) {
    // check if user is logged in
    if(getCurrentUser($request) === null)
        return unauthorizedError($response);


    $id = $args['id'];
    $this->logger->info("delete post " . $id);

    $postMapper = spot()->mapper('Entity\Post');
    $entity = $postMapper->first(['id' => $id]);

    if ($entity) {
        $postMapper->delete($entity);
    }

    $result = array(
        "id" => $entity->id
    );

    return asJSON($result, $response);
});

// ---- Authentication ----

$app->post('/api/login', function ($request, $response, $args) use ($app) {
    $this->logger->info("login");

    $json = $request->getBody();
    $loginData = json_decode($json, true);

    $username = $loginData['username'];
    $password = $loginData['password'];

    // generate pw hash
    $pw_hash = hash('sha256', $username . '' . $password);

    $userMapper = spot()->mapper('Entity\User');
    $user = $userMapper->first(['username' => $username]);

    $result = array();

    if ($user and $user->password === $pw_hash) {
        $token = hash('sha1', time() . '' . $password);
        $user->token = $token;
        $userMapper->save($user);

        // return all relevant informations
        $result['id'] = $user->id;
        $result['username'] = $user->username;
        $result['email'] = $user->email;
        $result['token'] = $user->token;
    }
    else
    {
        $result['error'] = 'Password or username wrong!';
    }

    return asJSON($result, $response);
});

$app->get('/api/logout', function ($request, $response, $args) use ($app) {
    $this->logger->info("logout");

    $user = getCurrentUser($request);

    if ($user !== null) {
        $user->token = null;

        $userMapper = spot()->mapper('Entity\User');
        $userMapper->save($user);
    }
    else
    {
        return unauthorizedError($response);
    }

    $result = array(
        "id" => $user->id
    );

    return asJSON($result, $response);
});


function spot() {
    static $spot;
    if($spot === null) {
        // database config
        $cfg = new \Spot\Config();

        /*
        $cfg->addConnection('pgsql', [
            'dbname' => 'nodistract',
            'user' => 'postgres',
            'password' => '',
            'host' => 'localhost',
            'driver' => 'pdo_pgsql',
        ]);
        */

        $cfg->addConnection('mysql', [
            'dbname' => '',
            'user' => '',
            'password' => '',
            'host' => '',
            'driver' => 'pdo_mysql',
        ]);

        $spot = new \Spot\Locator($cfg);
    }
    return $spot;
}