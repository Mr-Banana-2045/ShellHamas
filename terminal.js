

/*********************************************************
 ******************* JQUERY PLUGIN ***********************
/********************************************************/
(function ( $ ) {

  function Terminal(tag, user, hostname, path, mode, programs){
    console.log("create terminal object");
    if(this.setTag(tag) && this.setUser(user) && this.setHostname(hostname) && this.setPath(path) && this.setMode(mode) && this.setPrograms(programs)){
      this.setCommandsList();
      this.init();
    }else {
      console.log("Impossible to instanciate new terminal");
    }
  }

  /****************
  *** INIT FUNC ***
  ****************/
  //main init function
  Terminal.prototype.init = function(){
    console.log("init function");
    this.initTerminalLines();
    this.clear_terminal();
    this.newPrompt();
    this.listenKeys();
  }

  //create #terminal_lines div if not already present in terminal tag
  Terminal.prototype.initTerminalLines = function(){
    if(!$("#terminal_lines").length)
      $(this.tag).append("<div id=\"terminal_lines\"></div>");
  }

  //create keyup listener on the terminal
  Terminal.prototype.listenKeys = function(){
    //set tabindex attribute to allow focus on div
    var attr = $(this.tag).attr('tabindex');
    if (typeof attr !== typeof undefined && attr !== false) {
        $(this.tag).attr('tabindex', '1');
    }

    //create keyup listener
    self = this;
    $(this.tag).on("keydown", function(e){
      console.log("keyup");
      self.manageUserInput.call(self, e);
    });
  }

  /*************
  *** GENERIC **
  *************/
  //check if variable is a string
  Terminal.prototype.isString = function (s){
    if(typeof s === 'string' || s instanceof String)
      return true;
    return false;
  }

  //check if variable is an object
  Terminal.prototype.isObject = function(o){
    if(o !== null && typeof o === 'object')
      return true;
    return false;
  }

  //get greater length item in list
  Terminal.prototype.longest = function(a){
    var max = 0;
    for(var i = 0; i < a.length; i++){
      if(a[i].length > max)
        max = a[i].length
    }
    return max;
  }

  //get sum of element size in array
  Terminal.prototype.array_elements_size = function(a, padding = 0){
    var size = 0;
    for(var i = 0; i < a.length; i++)
      size += a[i].toString().length + padding;
    return size;
  }

  /*************
  *** SETTERS **
  *************/
  //set terminal node tag
  Terminal.prototype.setTag = function(tag){
    if($(tag).length){
      this.tag = tag;
      return true;
    }
    else {
      console.log("Node "+tag+" not found in page, impossible to init terminal");
      this.tag = null;
      return false;
    }
  }

  //set user
  Terminal.prototype.setUser = function(user){
    if(this.isString(user)){
      this.user = user;
      return true;
    }
    else{
      console.log("User provided is not a string, impossible to set it");
      this.user = null;
      return false;
    }
  }

  //set host
  Terminal.prototype.setHostname = function(host){
    if(this.isString(host)){
      this.host = host;
      return true;
    }
    else{
      console.log("Host provided is not a string, impossible to set it");
      this.host = null;
      return false;
    }
  }

  //set mode
  Terminal.prototype.setMode = function(mode){
    if(this.isString(mode) && mode.length == 1){
      this.mode = mode;
      return true;
    }
    else{
      console.log("Mode provided is not a one character string, impossible to set it");
      this.mode = null;
      return false;
    }
  }

  //set path
  Terminal.prototype.setPath = function(path){
    if(this.isString(path)){
      this.path = path;
      return true;
    }
    else{
      console.log("Path provided is not a string, impossible to set it");
      this.path = null;
      return false;
    }
  }

  //set path
  Terminal.prototype.setPrograms = function(programs){
    if(this.isObject(programs)){
      this.programs = programs;
      return true;
    }
    else{
      console.log("Programs provided, impossible to set it");
      this.programs = {};
      return false;
    }
  }

  //set command list array
  Terminal.prototype.setCommandsList = function(){
    this.commands_list = [];
    this.last_command_retrieved = -1;
  }

  /*************
  *** GETTERS **
  *************/
  Terminal.prototype.getPrompt = function(){
    return this.user+"@"+this.host+":"+this.path+this.mode;
  }


  /************************
  *** Terminal function ***
  *************************/

  //function to manage user input key
  Terminal.prototype.manageUserInput = function(e){
    var code = e.charCode ? e.charCode : (e.keyCode ? e.keyCode : e.which);
    //console.log("manage user input: "+code);
    switch(code){
      case 13://enter
        this.executeCommand();
        break;
      case 38: //up
        //e.preventDefault();
        this.fetchPreviousCommand("up");
        break;
      case 40: //down
        //e.preventDefault();
        this.fetchPreviousCommand("down");
        break;
    }
  }

  //fetch previous/next command when user type up/down arrow keys
  Terminal.prototype.fetchPreviousCommand = function(dir){
    //console.log("Fetch previous/next command "+dir);
    if(this.commands_list.length > 0 ){
      if(dir == "up"  && (this.last_command_retrieved == -1 || this.last_command_retrieved > 0)){
        if(this.last_command_retrieved == -1)
          this.last_command_retrieved = this.commands_list.length -1;
        else
          this.last_command_retrieved --;
        //console.log("Set previous command "+this.last_command_retrieved+"/"+this.commands_list.length);
        $(this.tag+" input[type=text].command").last().val(this.commands_list[this.last_command_retrieved]);
      }else if(dir == "down" && (this.last_command_retrieved != -1 && this.last_command_retrieved < (this.commands_list.length -1))){
        this.last_command_retrieved ++;
        //console.log("Set next command "+this.last_command_retrieved+"/"+this.commands_list.length);
        $(this.tag+" input[type=text].command").last().val(this.commands_list[this.last_command_retrieved]);
      }else{
        //console.log("Reached end of list");
        $(this.tag+" input[type=text].command").last().val("");
        this.last_command_retrieved = -1;
      }
    }
  }

  //execute command when user type enter
  Terminal.prototype.executeCommand = function(){
    //get last prompt
    var command_raw = $(".command").last().val().trim().toLowerCase().replace(/[^\w\s]/gi, '');
    //console.log("Execute command: "+command_raw);

    var command_arguments = command_raw.split(" ");
    var program = command_arguments[0];
    //console.log("Program:"+program);
    command_arguments.shift();
    //console.log("Arguments:"+command_arguments);

    if (typeof this.programs[program] == 'function') {
      var output = this.programs[program].apply(this, command_arguments);
    }else {
      this.printa("Unknown command");
    }

    this.addCommandToList(command_raw);
    this.newPrompt();
  }

  //add command to list of commands && reset last retreived command
  Terminal.prototype.addCommandToList = function(command_raw){
    this.commands_list.push(command_raw);
    this.last_command_retrieved = -1;
  }

  //print answer line
  Terminal.prototype.printa = function(a, format = {}){
    if (typeof a === 'string' || a instanceof String )
      this.addAnswerLine(a);
    else if(this.isObject(a)){
      this.addAnswerLine(this.makeTableHTML(a, format = {}));
    }
  }

  Terminal.prototype.makeTableHTML = function(obj, format) {
    //headers
    ths = "<tr>";
    for (var i = 0; i < obj["headers"].length; i++) {
      ths += "<th>"+obj["headers"][i]+"</th>";
    }
    ths += "</tr>";
    delete obj["headers"];
    //lines
    trs = "";
    //get table lines
    for(key in obj){
      trs += "<tr><td>"+key+"</td>";

      for (var j = 0; j < obj[key].length; j++) {
        trs += "<td>"+obj[key][j]+"</td>";
      }
      trs += "</tr>"
    }

    return "<table>" + ths + trs + "</table>";
  }


  Terminal.prototype.addAnswerLine = function (s){
    $(this.tag+" #terminal_lines").append("<div class=\"answer\">"+s+"</div>");
  }

  //crear terminal of all user lines && program answers
  Terminal.prototype.clear_terminal = function(){
    //console.log("Clear terminal");
    $(this.tag+" .user_line").remove();
    $(this.tag+" .answer").remove();
  }


  Terminal.prototype.newPrompt = function(){
    //console.log("create_prompt");
    $(".command").prop('disabled', true);//disable previous inputs
    $(this.tag+" #terminal_lines").append(`<div class="user_line">
                                            <span class="prompt">`+this.getPrompt()+`</span>
                                            <input type="text" class="command"></span>
                                            </div>`);
    $(".command").last().focus();
  }

  $.fn.setAsTerminal = function(tag = "#terminal", user=  "user", hostname="host", path="~", mode = "$", programs = {}) {
    //console.log("init terminal");
    new Terminal(tag, user, hostname, path, mode, programs);
  };
}( jQuery ));
