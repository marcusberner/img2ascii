(function () {

	if (!window.WebGLRenderingContext) return;

	function hide(element) {
		var style = element.getAttribute('style');
		if (style && style !== '') {
			element.setAttribute('data-original-style', style);
		}
		element.setAttribute('style', 'display:none;');
	}

	function show(element) {
		var style = element.getAttribute('data-original-style');
		if (!style) {
			style = '';
		}
		element.setAttribute('style', style);
	}

	function getMatchingChar(data, x, y, width) {
		var chars, r, g, b, alpha, darkness;
		r = data[((width * y) + x) * 4];
		g = data[((width * y) + x) * 4 + 1];
		b = data[((width * y) + x) * 4 + 2];
		alpha = data[((width * y) + x) * 4 + 3];
		darkness = Math.round(alpha * ((255 * 3) - r - g - b) / 3 / 255);
		chars = [ '&nbsp;', '-', '=', '#' ];
		return chars[Math.min(chars.length - 1, Math.floor(darkness * chars.length / 255))];
	}

	function updateAsciiElement(img, asciiElement) {
		var oldAscii, asciiId = img.getAttribute('data-ascii-id');
		if (asciiId && asciiId !== '') {
			oldAscii = document.getElementById(asciiId);
			oldAscii.parentNode.removeChild(oldAscii);
		} else {
			asciiId = Math.round(Math.random() * 10000000).toString();
			img.setAttribute('data-ascii-id', asciiId);
		}
		asciiElement.setAttribute('id', asciiId);
		img.parentNode.insertBefore(asciiElement, img);
	}

	function convertToAscii(img, fontSize, firstTime) {

		var
			convert,
			ctx,
			charHeight = 1.005 * Math.round(fontSize * 6 / 8),
			charWidth = 0.96 * fontSize * 5 / 8,
			parent = img.parentNode,
			imageClass,
			canvasNode = document.createElement('canvas'),
			asciiNode = document.createElement('div'),
			innerAsciiNode = document.createElement('div');

		imageClass = img.getAttribute('class');
		if (imageClass) asciiNode.setAttribute('class', imageClass);
		canvasNode.setAttribute('style', 'display:none;');
		parent.insertBefore(canvasNode, img);
		ctx = canvasNode.getContext('2d');

		convert = function() {
			if (firstTime !== true) show(img);
			var x, y, data, lines, line;
			asciiNode.setAttribute('style', 'display:block;overflow:hidden;width:' + img.clientWidth + 'px;height:' + img.clientHeight + 'px;');
			innerAsciiNode.setAttribute('style', 'font-family:monospace;width:99999px;font-size: ' + fontSize + 'px;line-height: ' + charHeight + 'px;letter-spacing:0px;');
			canvasNode.height = img.clientHeight;
			canvasNode.width = img.clientWidth;
			ctx.drawImage(img, 0, 0, img.clientWidth, img.clientHeight);
			data = ctx.getImageData(0, 0, img.clientWidth, img.clientHeight).data;
			lines = [];
			for(y = 0; y <= (img.clientHeight - charHeight); y += charHeight) {
				line = [];
				for(x = 0; x <= (img.clientWidth - charWidth); x += charWidth) {
					line.push(getMatchingChar(data, Math.round(x), Math.round(y), img.clientWidth));
				}
				lines.push(line.join(''));
			}
			innerAsciiNode.innerHTML = lines.join('<br/>');
			asciiNode.appendChild(innerAsciiNode);
			parent.removeChild(canvasNode);
			updateAsciiElement(img, asciiNode);
			hide(img);
		};
		if (firstTime === true) {
			img.onload = function() {
				window.addEventListener('resize', img2Ascii, true);
				convert();
			}
		} else {
			convert();
		}

	}

	function img2Ascii(firstTime) {
		var i, shouldConvert, fontSize, images = document.getElementsByTagName('img');
		for (i = 0; i < images.length; i++) {
			shouldConvert = images[i].getAttribute('data-img2ascii');
			if (!shouldConvert && shouldConvert !== '') continue;
			fontSize = images[i].getAttribute('data-ascii-font-size');
			if (fontSize) fontSize = parseInt(fontSize, 10);
			else fontSize = 4;
			convertToAscii(images[i], fontSize, firstTime);
		}
	}

	document.addEventListener('DOMContentLoaded', function () {
		img2Ascii(true);
	}, false);

})();