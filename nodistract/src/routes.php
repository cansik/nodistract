<?php

$app->get('/', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("main route");

    $postMapper = spot()->mapper('Entity\Post');
    $result = $postMapper->all()->select()->execute();
    $posts = $result->toArray();

    $params = array(
        "posts" => $posts
    );

    // Render index view
    return $this->renderer->render($response, 'index.phtml', $params);
});


function spot() {
    static $spot;
    if($spot === null) {
        // database config
        $cfg = new \Spot\Config();

        $cfg->addConnection('pgsql', [
            'dbname' => 'nodistract',
            'user' => 'postgres',
            'password' => '',
            'host' => 'localhost',
            'driver' => 'pdo_pgsql',
        ]);

        $spot = new \Spot\Locator($cfg);
    }
    return $spot;
}