(function(window){

    'use strict';
    var dynamicTemplate = {
        render : render
    };

    // Gets the template, finds dynamic value queries, replaces with its value and return a string of the new HTML
    function render(template_selector, object){

        // Similar as jQuery we distinct with a $ the variables that contains HTMLElements.
        // This can help to distinguish when you are dealing with strings or HTMLElements
        var $template = document.getElementById(template_selector);

        // Check if template exists
        if(!$template){
            console.error("Template doesn't exists! Check Your template Selector: " + template_selector);
            return '';
        }

        return applyDynamicValues($template.innerHTML, object);
    }

    // We create a function to replace the curly braces with data values
    function applyDynamicValues(str_html, object){
        // Iterates over all the dynamic queries found and replace by its values
        return getDynamicValues(str_html).reduce(function(html, dyn_value){

            // Creates a regex to replace the value for each element found
            var regexp = new RegExp("{{" + dyn_value + "}}", 'g');

            // Gets the value of the dynamic query
            var value = getValueFromObject(dyn_value, object);

            // Apply the replace to all items in the original HTML string
            return html.replace(regexp, value !== null ? value : '');
        }, str_html);
    }

    function getDynamicValues(str){

        // Regex Explanation:
        // (?<={{) Require opening curly braces before match, but not include in the result
        // ([^}]*) Accept all characters except }
        // (?=}}) - Require closing curly braces after match

        // Returns matches or an empty array if there's no matches
        var result = (str.match(/(?<={{)([^}]*)(?=}})/g) || []);

        // Filter the results to remove duplicates
        return result.filter(function(item, pos) {
            return result.indexOf(item) === pos;
        })
    }

    function getValueFromObject(str_property, object){
        // Clean white spaces
        str_property=str_property.trim();

        // set the default value for the object
        var value = null;

        // We protect the code to throw an error when trying to access a property of undefined
        try {
            // Iterates through the dot notation checking if the object has the property
            value = str_property.split('.').reduce(function(props, item){
                return props.hasOwnProperty(item) ? props[item] : null;
            }, object);
        } catch(e){
            // We catch errors when trying to access properties for undefined objects
            console.warn("Tried to read a property of undefined, str_property: " + str_property);
            if(typeof object === 'undefined'){
                console.warn("The Object is undefined. Check the Object passed to fill the data");
            }
            value = null;
        }

        return value;
    }

    window.dt = dynamicTemplate;

})(window);