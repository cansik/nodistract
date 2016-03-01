<?php
/**
 * Created by IntelliJ IDEA.
 * User: cansik
 * Date: 01/03/16
 * Time: 17:46
 */

require_once "vendor/autoload.php";
require "models/post.php";
require "models/user.php";

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
$result = $postMapper->all()->select()->execute();

echo "hello";