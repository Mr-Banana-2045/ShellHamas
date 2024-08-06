<?php
$filename = basename($_POST['filename']);
$fileContent = $_POST['content'];
if (file_put_contents($filename, $fileContent) !== false) {
    echo "added" . $filename;
} else {
    echo "Error saving file.";
}
?>

