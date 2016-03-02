<?php
namespace Entity;
use Spot\Entity;

class Post extends Entity
{
    protected static $table = 'post';
    public static function fields()
    {
        return [
            'id'           => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'title'        => ['type' => 'string', 'required' => true],
            'path'         => ['type' => 'string', 'required' => true],
            'content'      => ['type' => 'text', 'required' => true],
            'published'    => ['type' => 'boolean', 'default' => false, 'index' => true],
            'author_id'    => ['type' => 'integer', 'required' => true],
            'publish_date' => ['type' => 'datetime', 'value' => new \DateTime()]
        ];
    }
}