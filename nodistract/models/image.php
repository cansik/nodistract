<?php
namespace Entity;
use Spot\Entity;

class Image extends Entity
{
    protected static $table = 'image';
    public static function fields()
    {
        return [
            'id'           => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'title'        => ['type' => 'string', 'required' => true],
            'data'         => ['type' => 'string', 'required' => true]
        ];
    }
}