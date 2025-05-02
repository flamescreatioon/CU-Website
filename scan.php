<?php
/**
 * Gallery Folder Scanner
 * 
 * This script scans the images directory and creates a JSON file with all gallery images
 * It organizes images based on their folders (categories) and creates appropriate metadata
 */

// Set the base directory for gallery images
$galleryDir = 'assets/gallery';

// Check if the directory exists
if (!is_dir($galleryDir)) {
    die("Error: Gallery directory does not exist. Please create the directory structure first.");
}

// Array to store gallery items
$galleryItems = [];

// ID counter for gallery items
$id = 1;

// Get all category directories
$categories = array_diff(scandir($galleryDir), array('..', '.'));

// Loop through each category directory
foreach ($categories as $category) {
    $categoryPath = $galleryDir . '/' . $category;
    
    // Skip if not a directory
    if (!is_dir($categoryPath)) {
        continue;
    }
    
    // Get all images in this category
    $images = array_diff(scandir($categoryPath), array('..', '.'));
    
    // Process each image
    foreach ($images as $image) {
        // Only process image files
        $imageExt = pathinfo($image, PATHINFO_EXTENSION);
        if (!in_array(strtolower($imageExt), ['jpg', 'jpeg', 'png', 'gif'])) {
            continue;
        }
        
        // Generate image path relative to web root
        $imagePath = $galleryDir . '/' . $category . '/' . $image;
        
        // Generate a title from the filename
        $title = str_replace('_', ' ', pathinfo($image, PATHINFO_FILENAME));
        $title = ucwords($title);
        
        // Create a default description
        $description = "Image from the " . ucwords($category) . " category";
        
        // Add the gallery item
        $galleryItems[] = [
            'id' => $id++,
            'category' => $category,
            'imageSrc' => $imagePath,
            'altText' => $title,
            'title' => $title,
            'description' => $description
        ];
    }
}

// Save the gallery data to a JSON file
$jsonData = json_encode($galleryItems, JSON_PRETTY_PRINT);
file_put_contents('gallery-config.json', $jsonData);

echo "Gallery scanning complete. Found " . count($galleryItems) . " images across " . count($categories) . " categories.";

// Output the recommended folder structure
echo "\n\nRecommended folder structure:";
echo "\n- images/";
echo "\n  - gallery/";
echo "\n    - reunions/";
echo "\n    - graduation/";
echo "\n    - events/";
echo "\n    - campus/";
?>