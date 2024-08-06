<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['filename'])) {
        $filename = $_POST['filename'];
        if (file_exists($filename)) {
            if (unlink($filename)) {
                echo "deleted";
            }
        }
    }
}
?>
