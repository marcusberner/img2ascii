img2ascii
=========

Converts all images with the `data-img2ascii` attribute to ASCII art.

```html
<img data-img2ascii src="image.jpg" />
```

The image gets replaced with a `<div>` containing ASCII art. Any CSS class gets transferred from the image to the div.

### Prerequisites and limitations

HTML5 canvas support is required and cross-domain images are not supported due to browser security features.