
var PROGAMS = {

  help: function(...a) {
    this.printa({
      "headers": ["command", "description"],
      "upload": ["file name code"],
      "clear": ["clear terminal"],
      "whoami": ["you"]
    });
  },

  upload: function(...args) {
        const filename = args[0];
        const content = args[1];
        
        if (!filename || !content) {
            this.printa("Usage: upload filename content");
            return;
        }
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
  },
  clear: function(...a) {
    this.clear_terminal();
  },
  whoami: function(...a){
    this.printa("Sarbaz Hamas");
  }
};
