const fs = require('fs');
const names = fs.readFileSync('names.txt').toString().split("\n");
const async = require('async');
const XMLHttpRequest  = require("xhr2");


//check solo.to to see if each of the names exist and wait 10 seconds between each check
async.eachSeries(names, function(name, callback) {
        setTimeout(function() {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", "https://solo.to/" + name);
                xhr.send();
                xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                                console.log('The name ' + name + ' returned ' + xhr.status);
                                if (xhr.status == 404) {
                                        console.log(name + " does not exist");
                                        fs.writeFileSync('workingnames.txt', name + "\n", {flag: 'a'});
                                } else {
                                        if(xhr.status == 200) {
                                                console.log(name + " exists");
                                                fs.appendFileSync('workingnames.txt', name + "\n", {flag: 'a'});
                                        }
                                }
                        }
                }
                callback();
        }, 3500);
}, function(err) {
        console.log('done');
});
