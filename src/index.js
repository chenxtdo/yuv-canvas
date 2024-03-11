var YUVCanvas = require("./yuv-canvas.js");

var yuvCanvasMap = {};

function getYuvFrame(data, width, height, displayWidth, displayHeight) {
  var uvWidth = width / 2;
  var pixelStorei = 1;
  if (uvWidth % 8 === 0) {
    pixelStorei = 8;
  } else if (uvWidth % 4 === 0) {
    pixelStorei = 4;
  } else if (uvWidth % 2 === 0) {
    pixelStorei = 2;
  }
  return {
    format: {
      width: width,
      height: height,
      chromaWidth: width / 2,
      chromaHeight: height / 2,
      cropLeft: 0, // default
      cropTop: 0, // default
      cropHeight: height,
      cropWidth: width,
      displayWidth: displayWidth || width, // derived from width via cropWidth
      displayHeight: displayHeight || height, // derived from cropHeight
      pixelStorei: pixelStorei, // default
    },
    y: {
      bytes: data.bytes.subarray(0, data.yOffset),
      stride: data.yStride,
    },
    u: {
      bytes: data.bytes.subarray(data.yOffset, data.uOffset),
      stride: data.uStride,
    },
    v: {
      bytes: data.bytes.subarray(data.uOffset, data.vOffset),
      stride: data.vStride,
    },
  };
}

this.addEventListener(
  "message",
  function (e) {
    var data = e.data;
    var uuid = data.uuid;
    var type = data.type || 'video';
    var canvas = data.canvas;
    var frame = data.frame;
    var canvasKey = type + '-' + uuid;
    if (canvas) {
      var yuvCanvas = YUVCanvas.attach(canvas);
      yuvCanvasMap[canvasKey] = yuvCanvas;
    } else if (frame) {
      var yuvFrame = getYuvFrame(
        frame.data,
        frame.width,
        frame.height,
        frame.displayWidth,
        frame.displayHeight
      );
      var yuvCanvas = yuvCanvasMap[canvasKey];
      yuvCanvas.drawFrame(yuvFrame);
    }
  },
  false
);
