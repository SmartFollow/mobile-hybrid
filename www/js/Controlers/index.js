/* 
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById("submitBtn").addEventListener("click", connect);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

function connect() {
    var addr = document.getElementById("addrInput").value;
    var password = document.getElementById("passwordInput").value;
    
    if (addr.indexOf("@") == -1 || password.length < 6) {
        console.log("error");
    }
    else {
        console.log("ok");
        httpPostAsync();
    }
}

function httpPostAsync(){
    var url = "http://api.dev.smartfollow.org/oauth/token";
    var type = "POST";
    var asyn = true;
    var param = new FormData();
    param.append('grant_type', 'password');
    param.append('client_id', '2');
    param.append('client_secret', 'BjEebk7a3NP9nXOswW2Y5nJ04V7aRLGjxKYUEV3C');
    param.append('username', 'devon73@example.com');
    param.append('password', 'secret');
    param.append('scope', '');
    var request = new NetWorkConnection(url, param);
    request.initialize(asyn, type);
    
    request.getRequest().onreadystatechange = function() {
        var http = request.getRequest();
        console.log("http.responseText");
        if (http.readyState === 4 && http.status === 200) {
            alert(http.responseText);
            console.log(http.responseText);
        }
    };
    
    request.sendRequest(param);
}

function NetWorkConnection (url, params) {
    this.request = new XMLHttpRequest();
    this.url = url;
    this.params = params;
    
    this.initialize = function(asyn, type) {
        this.request.open(type, this.url, asyn);
        this.request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    };
    
    this.getRequest  = function() {
        return (this.request);
    };
    
    this.sendRequest = function() {
        this.request.send(this.params);
    };
}