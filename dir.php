<?php
$directoryPath = getcwd();
if ($handle = opendir($directoryPath)) {
    echo "Files and directories in '$directoryPath':\n";

    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {
            echo "<p style='font-size:10px;'>$entry</p>";
        }
    }

    closedir($handle);
}
?>