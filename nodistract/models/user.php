<?php
namespace Entity;
use Spot\Entity;

class User extends Entity
{
    protected static $table = 'user';
    public static function fields()
    {
        return [
            'id'           => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'username'     => ['type' => 'string', 'required' => true],
            'password'     => ['type' => 'string', 'required' => true],
            'email'        => ['type' => 'string', 'required' => true],
            'token'        => ['type' => 'string', 'required' => false]
        ];
    }
}