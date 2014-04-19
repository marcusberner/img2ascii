img2ascii
=========

Converts all images with the `data-img2ascii` attribute to ASCII art.

The font size of the ASCII art can be controlled by providing an integer value in the `data-ascii-font-size` attribute. If no font size is provided the default size of 4px will be used.

```html
<img data-img2ascii data-ascii-font-size="2" src="image.jpg" />
```

The image gets replaced with a `<div>` containing ASCII art. Any CSS class gets transferred from the img tag to the div tag.

### Prerequisites and limitations

HTML5 canvas support is required and cross-domain images are not supported due to browser security features.