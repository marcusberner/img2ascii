(function () {

	function convertToAscii(img) {

		var
			ctx,
			matchChar,
			charWidth = 5,
			charHeight = 6,
			parent = img.parentNode,
			imageClass,
			canvasNode = document.createElement("canvas"),
			asciiNode = document.createElement("div");

		matchChar = function (data, x, y) {
			var chars, r, g, b, alpha, darkness, charData = [];
			r = data[((img.clientWidth * y) + x) * 4];
			g = data[((img.clientWidth * y) + x) * 4 + 1];
			b = data[((img.clientWidth * y) + x) * 4 + 2];
			alpha = data[((img.clientWidth * y) + x) * 4 + 3];
			darkness = Math.round(alpha * ((255 * 3) - r - g - b) / 3 / 255);
			chars = [ '&nbsp;', '&#47;', '&#61', '#' ];
			return chars[Math.min(chars.length - 1, Math.floor(darkness * chars.length / 255))];
		};

		asciiNode.setAttribute('style', 'display:block;overflow:hidden;font-family:monospace;font-size: 8px;line-height: 6px;letter-spacing:0px;');
		imageClass = img.getAttribute("class");
		if (imageClass) asciiNode.setAttribute('class', imageClass);
		canvasNode.setAttribute('style', 'display:none;');
		parent.insertBefore(canvasNode, img);
		ctx = canvasNode.getContext("2d");

		img.onload = function() {
			canvasNode.height = img.clientHeight;
			canvasNode.width = img.clientWidth;
			ctx.drawImage(img, 0, 0, img.clientWidth, img.clientHeight);
			var data = ctx.getImageData(0, 0, img.clientWidth, img.clientHeight).data;
			var result = '';
			for(var y = 0; y <= (img.clientHeight - charHeight); y += charHeight) {
				for(var x = 0; x <= (img.clientWidth - charWidth); x += charWidth) {
					result += matchChar(data, x, y);
				}
				result += '<br/>';
			}
			asciiNode.innerHTML = result;
			parent.removeChild(canvasNode);
			parent.insertBefore(asciiNode, img);
			parent.removeChild(img);
		}

	}

	if (!window.WebGLRenderingContext) return;
	document.addEventListener('DOMContentLoaded', function () {
		var images = document.getElementsByTagName('img');
		for (var i = 0; i < images.length; i++) {
			var attr = images[i].getAttribute("data-img2ascii");
			if (attr || attr === '') convertToAscii(images[i], attr === 'simple');
		}
	}, false);

})();