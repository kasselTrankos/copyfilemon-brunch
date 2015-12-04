var mkdirp = require('mkdirp'),
  copyFile = require('quickly-copy-file'),
  path = require('path'),
  fs = require('fs');

var filemon;
filemon = (function(){
  var _0777 = parseInt('0777', 8),
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul','Aug', 'Sep', 'Oct', 'Nov','Dec'];
  var copiedFiles = [];
  var logging = true;
  return {
    mkdir: function(target){
      var _return = true;
      mkdirp(target, this._0777, function (err) {
          if (err) _return = false;
      });
      return _return;
    },
    copyFolderRecursiveAsync: function(source, target){
      if ( !fs.existsSync( target ) )
        this.mkdir(target);

      if ( fs.lstatSync( source ).isDirectory()){
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
          var curSource = path.join( source, file );
          if ( fs.lstatSync( curSource ).isDirectory()){
            var curTarget = path.join( target, path.basename( curSource ) );
            filemon.copyFolderRecursiveAsync( curSource, curTarget );
          }else{
            filemon.copyFileAsync( curSource, target );
          }
        });
      }else{
        this.copyFileAsync( source, target );
      }
    },
    copyFileAsync: function(original, copy){
      _copyFile = path.join( copy, path.basename( original ) );

      var date = new Date();
      var d = (date.getDate()<=9) ?'0'+date.getDate():date.getDate();
      var month = months[parseInt(date.getMonth())];
      var h = (date.getHours()<=9) ?'0'+date.getHours():date.getHours();
      var m = (date.getMinutes()<=9) ?'0'+date.getMinutes():date.getMinutes();
      var s = (date.getSeconds()<=9) ?'0'+date.getSeconds():date.getSeconds();
      var hhmmss = h+':'+m+':'+s;
      copiedFiles.push(_copyFile);

      copyFile(original, _copyFile, function(error) {
        if (error)
          console.error(error, ' que error!!!');
        else{
          ////
          if(logging){
            logging = false;
            copiedFiles.forEach(function(file){
              var log = d+' '+month+' '+hhmmss+' - \x1b[32minfo\x1b[30m: file was copied '+file;
              console.log(log);
            });
          }

        }
      });
    }
  }
})();

module.exports = filemon;
