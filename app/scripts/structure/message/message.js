'use strict';
angular
    .module('struct.message', [])
    .controller('messageCtrl',[messageCtrl]);

function messageCtrl()
{
    var msg=this;
 //   console.log(msg);
    var title;
    var message;
    msg.setTilte=function(value){title=value; /*console.log(value)*/};
    msg.setMessage=function(value){message=value; /*console.log(value)*/};
    msg.tilte=function(){/*console.log(title);*/ return title;};
    msg.message=function(){/*console.log(message);*/return message};
    msg.confirm='button.confirm.label';
    msg.cancel='button.cancel.label';
}