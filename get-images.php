<?php
require 'vendor/autoload.php';

use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Admin\AdminApi;

Configuration::instance([
    'cloud' => [
        'cloud_name' => 'dswsqkceo',
        'api_key'    => '641462995997692',
        'api_secret' => 'k65CJtBMpcXqd72iUnDVPCW_7D8'
    ],
    'url' => [
        'secure' => true
    ]
]);

header('Content-Type: application/json');

try {
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
    $nextCursor = isset($_GET['next_cursor']) ? $_GET['next_cursor'] : null;

    $params = [
        'type' => 'upload',
        'prefix' => 'home/', // Cloudinary folder name
        'max_results' => $limit
    ];

    if ($nextCursor) {
        $params['next_cursor'] = $nextCursor;
    }

    $api = new AdminApi();
    $resources = $api->assets($params);

    $galleryItems = [];
    foreach ($resources['resources'] as $index => $item) {
        $galleryItems[] = [
            'id' => $index + 1,
            'category' => 'gallery',
            'imageSrc' => $item['secure_url'],
            'altText' => $item['public_id'],
            'title' => basename($item['public_id']),
            'description' => 'Uploaded to Cloudinary'
        ];
    }

    echo json_encode([
        'items' => $galleryItems,
        'next_cursor' => $resources['next_cursor'] ?? null
    ]);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
