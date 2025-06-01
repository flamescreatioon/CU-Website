<?php
require 'vendor/autoload.php';

use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Admin\AdminApi;

// Setup Cloudinary config
Configuration::instance([
    'cloud' => [
        'cloud_name' => 'dswsqkceo',
        'api_key'    => '641462995997692',
        'api_secret' => 'k65CJtBMpcXqd72iUnDVPCW_7D8'
    ],
    'url' => ['secure' => true]
]);

header('Content-Type: application/json');

// Get pagination input
/* $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20; */
$nextCursor = $_GET['next_cursor'] ?? null;

$params = [
    'type' => 'upload',
    //'prefix' => 'home/',   // Only fetch images in the "gallery/" folder
    'max_results' => 500
];

if ($nextCursor) {
    $params['next_cursor'] = $nextCursor;
}

try {
    $api = new AdminApi();
    $result = $api->assets($params);

    $items = [];
    foreach ($result['resources'] as $res) {
        $items[] = [
            'id' => uniqid(),
            'category' => 'gallery',
            'imageSrc' => $res['secure_url'],
            'altText' => $res['public_id'],
            'title' => basename($res['public_id']),
            'description' => 'Uploaded to Cloudinary'
        ];
    }

   $jsonData = json_encode([
        'gallery' => [
            'title' => 'Gallery',
            'subtitle' => 'A collection of beautiful images',
            'items' => $items
        ],
        'next_cursor' => $result['next_cursor'] ?? null
    ]);
    file_put_contents('gallery-config.json', $jsonData);
    echo $jsonData;
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
