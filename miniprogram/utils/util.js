"use strict";
var loadImageToCav = function (canvas, imageSrc) {
    var img = canvas.createImage();
    img.src = imageSrc;
    return new Promise(function (resolve) {
        img.onload = function () {
            resolve(true);
        };
    });
};
module.exports = {
    loadImageToCav: loadImageToCav
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQU0sY0FBYyxHQUFHLFVBQUMsTUFBVyxFQUFFLFFBQWdCO0lBQ25ELElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNqQyxHQUFHLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQztJQUVuQixPQUFPLElBQUksT0FBTyxDQUFDLFVBQUEsT0FBTztRQUN4QixHQUFHLENBQUMsTUFBTSxHQUFHO1lBQ1gsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hCLENBQUMsQ0FBQTtJQUNILENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNmLGNBQWMsZ0JBQUE7Q0FDZixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgbG9hZEltYWdlVG9DYXYgPSAoY2FudmFzOiBhbnksIGltYWdlU3JjOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgaW1nID0gY2FudmFzLmNyZWF0ZUltYWdlKCk7XG4gIGltZy5zcmMgPSBpbWFnZVNyYztcblxuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgfVxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbG9hZEltYWdlVG9DYXZcbn0iXX0=