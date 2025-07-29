# KankaTemplates

a small projet to make templates for Kanka [https://kanka.io](https://kanka.io).
As it uses the blade engine from Laravel, I have made (with the help of ChatGpt) a small express server with an engine who normally works like blade.

## Setup
You will need to install node and yarn.
Then install the dependencies :
```
yarn install
```

then, you start the server:
```
yarn start
```

## The templates
To make a template, you create a new folder in the folder _templates_.
The name of the folder will be used in the url to see the template.
For example: http://localhost:3000/template/BoL to see the BoL template.


As in Kanka, when you make your plugin, your template is splitted in 3 parts:
- _template.kan_ : this one will be rendered as html
- _template.css_ : for the style
- _template.js_ : for the javascript

You will copy their contents in the Kanka plugin editor.

You have another file in the folder _template.json_ : this file contains values for attributes and translations for i18n, it will be used by the 'like blade engine'.

this file is like this :
```json
{
  "i18n": {
    "Name": "Nom",
    "Origin": "Origine"
  },
  "attributes": {
    "entity_name": "Thorgal",
    "origin": "Valgard",
    "equipment": "something <br />multilines"
  }
}
```
At this point, I just want to emulate the translation, so there is only one translation.

in the attributes part, you can see an attribute _entity_name_ who is a reference to _$\_entity\_name_ that Kanka provide.
The next one _origin_ is a custom attribute,.
The only thing to say is that you don't need to start your attribute by \_ in the attributes in the _template.json_ even if the attribute in the _template.kan_ file does. 
And finally, to simulate multiline fields you only need to add _\<br \/\>_ between your 'lines' as you can see in the last attribute.

## Main page
I had a problem to design a character sheet based on a unique background image.
On the kanka app website there is some useful tools and menus, on the left (for a width of 484px).
I used ratios (10% of width or height) of the component to put everything in place, but for the size of the fonts I used a ratio of the viewport (vw).
In my own server everything was fine, but on kanka, it was not. Thanks to javascript, I solved this too.

So, I have decided to render the component in a page with a big panel on the left (484px).
That's in the _index.kan_ template. You will find the javascript and css import in this file.
It's in this file that you can play with the size of the left panel

## Images
We can't put images to render in the template in Kanka, so like I have seen in this repository https://github.com/Dschaykib/kankaTemplate, I have linked the images to the files in this repository.
For example : 
```css
background-image: url('https://raw.githubusercontent.com/Ajrarn/KankaTemplates/main/templates/BoL/fond.svg');
```
So don't forget to push your images in the github repository before using this tip.