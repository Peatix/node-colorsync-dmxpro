"use strict";
var ws = require('ws');
var wss;
global.nervousTimer = require('./nervous-timer');
global.XorShift = require('./xorshift');
global.Peatix = {};

// Monkey patch to ignore LocalStorage related codes.
global.ColorSyncClientAndroid = {
  connect: function(to){
    wss = new ws(to);
    wss.on('message', function (msg) {
      csc.__onMessage({data: msg});
    });
    wss.on('close', function() {

    });
    wss.on('open', function () {
      setTimeout( function () {
        csc.startClockSync();
      },1000);
    });
  },
  send: function(msg){
    wss.send(msg);
  },
  setValue: function(){},
  getValue: function(){},
  deleteKey: function(){}
};

var CS = require('./colorsync-client.js');
var csc;
var server = process.argv[2];
var token = process.argv[3];
var universe = process.argv[4];
var channel = parseInt(process.argv[5]);

csc = new CS({
  server: server,
  token: token
});


var dmxlen = 1;
function r (){return Math.random();}

var dmxpro = require('dmxpro');
var dmx = dmxpro.alloc();
console.log(dmxpro);
dmxpro.init(dmx, {
  colourspace: 'rgb',
  fixtures: [{
    id: 1,
    map: {
      red: channel,
      green: channel + 1,
      blue: channel + 2
    }
  }]
});

global.colorsync = function (col) {
  console.log(col);
  dmxpro.color(dmx, universe, col.r/255, col.g/255, col.b/255);
};
