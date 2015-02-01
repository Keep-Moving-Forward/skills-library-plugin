#Skills Library JQuery Plugin

The Skills Library Jquery plugin can be used for creating a skills profile for an individual or for creating a skills based job profile. You can retrieve the skills from "It's Your Skills" and create a skills profile using tree interface.

#### HTML
``` html
<div data-href="http://api.itsyourskills.com/widgets" data-apikey="YOUR_MASHAPE_KEY"></div>
```

#### Javascript
``` Javascript
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id))
        return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://raw.githubusercontent.com/itsyourskills/skills-library-plugin/master/widgets.min.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'iys-jssdk'));
```
