# Nodistract

Nodistract is a simple content management system for blogs which uses markdown for writing blog posts. It offers a single page app for administration.
To provide a great user experience it uses the bing spell checking api which helps you to write your blog posts without any mistakes.

## Requirements
* CRUD blog post
* Edit blog specific settings
	* Name
	* Slug
* Theme specific things
* REST API for post editing
* Spell Checking on writing
* Markdown renderer
* Image upload

## API Description
To use the api just call the `base_url` plus the identifier:

```
/api/{identifier}
```

All api routes which are starred (**\***) are secured by a token validation.

### Posts

#### List*

Description: *Returns all currently written posts.*

*Example*

```php
GET /api/post?token=1234
```
*Result*

```json
{
  "posts": [
    {
      "content": "Hello *World* **2**, this is our second post!.",
      "author_id": 1,
      "id": 7,
      "published": false,
      "title": "Hello World 2",
      "publish_date": {
        "date": "2016-05-25 13:37:12.000000",
        "timezone": "Europe/Zurich",
        "timezone_type": 3
      },
      "path": "hello-world-2"
    }
  ]
}
```

#### Add*

Add new posts to the blog.

**Example**

```php
POST /api/post?token=1234
```

*POST Parameter*

```json
{
    "title":"Hello World 2",
    "path":"hello-world-2",
    "content":"Hello *World* **2**, this is our second post!.",
    "published":0,
    "author_id":1
}
```

*Result*

```json
{
  "id": "7"
}
```

#### Delete*

Description: *Delete an existing post.*

*Example*

```php
DELETE /api/post/{id}?token=1234
```

*Result*

```json
{
  "id": 2
}
```

### Authentication

#### Login

Description: *Login to the system as a user.*

* Username = string
* Password = sha256 hash

*Example*

```php
POST /api/login
```

*POST Parameter*

```json
{
    "username":"florian",
    "password":"9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
}
```

*Result*

```json
{
  "username": "florian",
  "id": 1,
  "email": "florian@blubbr.ch",
  "token": "1234"
}
```

#### Logout*

Description: *Logout your current user.*

*Example*

```php
GET /api/logout?token=1234
```

*Result*

```json
{
  "id": 1
}
```

## Technology
* Framework: Slim
* Datenbank: MySQL
* REST API: [Bing Spell Checker](https://www.microsoft.com/cognitive-services/en-us/bing-spell-check-api)

## Team
* Julian
* Ilija
* Florian