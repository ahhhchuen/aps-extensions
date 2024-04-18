﻿  /////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by APS Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

var viewer;
var fileName;

function launchViewer(urn, name) {
  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getApsToken
  };

  fileName = name;

  Autodesk.Viewing.Initializer(options, () => {
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('apsViewer'));
    viewer.start(null, null, null, null, {
      webglInitParams: {
          useWebGL2: false  // It's for Potree extension. If this is causing performance issue or any other problem, just use viewer.start();
      }
    });
    // viewer.start();
    var documentId = 'urn:' + urn;
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
  });
}

function onDocumentLoadSuccess(doc) {
  var viewables = doc.getRoot().getDefaultGeometry();
  viewer.loadDocumentNode(doc, viewables).then(i => {
    // documented loaded, any action?
    var ViewerInstance = new CustomEvent("viewerinstance", {detail: {viewer: viewer}});      
      document.dispatchEvent(ViewerInstance);
      // var LoadExtensionEvent = new CustomEvent("loadextension", {
      //   detail: {
      //     extension: "Extension1",
      //     viewer: viewer
      //   }
      // });      
      // document.dispatchEvent(LoadExtensionEvent);
  });
}

function onDocumentLoadFailure(viewerErrorCode) {
  console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function getApsToken(callback) {
  fetch('/api/auth/token').then(res => {
    res.json().then(data => {
      callback(data.access_token, data.expires_in);
    });
  });
}