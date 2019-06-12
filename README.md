# itemHeight.js

A plugin that ensures a clean overview by giving the items in your overview a consistent height per row.

### Usage
The first argument can be a nodelist or a valid css selector.
```
itemHeight(document.querySelectorAll('.items'), options);
``` 
**or** 
```
itemHeight('.items', options);
```


### Options

All of the options are optional. If no options are provided the `items_in_row` will default to 3.

| Option | Value |
| ------ | ------ |
| `selectors` | An **array** containing queryselector strings e.g. <br><pre>[<br>  '.title',<br>  '.subtitle'<br>]</pre>|
| `responsive` | An **object** where the key represents the max-width (px) and the value the amount of items in a row e.g.<br><pre>{<br>  1024: 3,<br>  768: 2<br>}</pre>|
| `items_in_row` | A **number** which is the default amount of items in a row|
