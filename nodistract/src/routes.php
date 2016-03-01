<?php
// Routes
require "../models/post.php";
require "../models/user.php";

$app->get('/[{name}]', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("Slim-Skeleton '/' route");


    // database config
    $cfg = new \Spot\Config();

    $cfg->addConnection('pgsql', [
        'dbname' => 'nodistract',
        'user' => 'postgres',
        'password' => '',
        'host' => 'localhost',
        'driver' => 'pdo_pgsql',
    ]);



    $post = new \Entity\Post();
    $spot = new \Spot\Locator($cfg);

    $postMapper = $spot->mapper('Entity\Post');
    $result = $postMapper->all();

    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});
