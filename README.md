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
The next one _origin_ is a custom attribute, the only thing to say is that in this file, you don't need to start your attribute by \_ if the attribute in the template (the _kan_ file) does. 
And finally, to simulate multiline fields you only need to add _\<br \/\>_ between your 'lines' as you can see in the last attribute.