<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['url'])) {
        $data = json_decode(file_get_contents("php://input"), true);
        $fileUrl = $data[$_POST['url']];
        $fileName = basename($fileUrl);

        // دانلود فایل و ذخیره آن در دایرکتوری فعلی
        if (file_put_contents($fileName, fopen($fileUrl, 'r'))) {
            echo "yes";
        } else {
            echo "no";
        }
} else {
    echo "error";
}
