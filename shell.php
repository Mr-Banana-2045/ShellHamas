<html class="no-js" lang="fr">
  <head>
    <meta charset="UTF-8">
    <!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=edge"><![endif]-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <title>Terminal page</title>
    <link rel="stylesheet" href="styles.css" media="all">
  </head>
  <body>
    <code>
    <div id="terminal">
      <?php
      echo "<header style='color:red;'>Shell Haniyeh</header><br>";
      ?>
      </div>
    </div>
  </code>
    <script src="jquery.min.js"></script>
    <script src="terminal_programs.js"></script>
    <script src="terminal.js"></script>
    <script>$( "#terminal" ).setAsTerminal("#terminal", "root", "Hamas", "~", "$", PROGAMS);</script>
  </body>
</html>