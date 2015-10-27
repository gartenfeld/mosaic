importScripts('factory.js');

onmessage = function (e) {
  reduceRowData(e.data.row, function(html) {
    postMessage({ results: html, index: e.data.index });
    close();
  });
};