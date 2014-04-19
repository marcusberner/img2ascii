(function () {

	function convertToAscii(img, fontSize) {

		var
			ctx,
			matchChar,
			charHeight = Math.round(fontSize * 6 / 8),
			charWidth = fontSize * 5 / 8,
			parent = img.parentNode,
			imageClass,
			canvasNode = document.createElement('canvas'),
			asciiNode = document.createElement('div');

		matchChar = function (data, x, y) {
			var chars, r, g, b, alpha, darkness;
			r = data[((img.clientWidth * y) + x) * 4];
			g = data[((img.clientWidth * y) + x) * 4 + 1];
			b = data[((img.clientWidth * y) + x) * 4 + 2];
			alpha = data[((img.clientWidth * y) + x) * 4 + 3];
			darkness = Math.round(alpha * ((255 * 3) - r - g - b) / 3 / 255);
			chars = [ '&nbsp;', '&#47;', '&#61', '#' ];
			return chars[Math.min(chars.length - 1, Math.floor(darkness * chars.length / 255))];
		};

		asciiNode.setAttribute('style', 'display:block;overflow:hidden;font-family:monospace;font-size: ' + fontSize + 'px;line-height: ' + charHeight + 'px;letter-spacing:0px;');
		imageClass = img.getAttribute("class");
		if (imageClass) asciiNode.setAttribute('class', imageClass);
		canvasNode.setAttribute('style', 'display:none;');
		parent.insertBefore(canvasNode, img);
		ctx = canvasNode.getContext('2d');

		img.onload = function() {
			var x, y, data, lines, line;
			canvasNode.height = img.clientHeight;
			canvasNode.width = img.clientWidth;
			ctx.drawImage(img, 0, 0, img.clientWidth, img.clientHeight);
			data = ctx.getImageData(0, 0, img.clientWidth, img.clientHeight).data;
			lines = [];
			for(y = 0; y <= (img.clientHeight - charHeight); y += charHeight) {
				line = [];
				for(x = 0; x <= (img.clientWidth - charWidth); x += charWidth) {
					line.push(matchChar(data, Math.round(x), y));
				}
				lines.push(line.join(''));
			}
			asciiNode.innerHTML = lines.join('<br/>');
			parent.removeChild(canvasNode);
			parent.insertBefore(asciiNode, img);
			parent.removeChild(img);
		}

	}

	if (!window.WebGLRenderingContext) return;
	document.addEventListener('DOMContentLoaded', function () {
		var i, shouldConvert, fontSize, images = document.getElementsByTagName('img');
		for (i = 0; i < images.length; i++) {
			shouldConvert = images[i].getAttribute('data-img2ascii');
			if (!shouldConvert && shouldConvert !== '') return;
			fontSize = images[i].getAttribute('data-ascii-font-size');
			if (fontSize) fontSize = parseInt(fontSize, 10);
			else fontSize = 4;
			convertToAscii(images[i], fontSize);
		}
	}, false);

})();