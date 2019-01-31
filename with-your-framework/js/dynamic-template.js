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
        return getDynamicVariables(str_html).reduce(function(html, dyn_value){

            // Creates a regex to replace the value for each element found
            var regexp = new RegExp("{{" + dyn_value.replace('(','\\(').replace(')','\\)') + "}}", 'g');

            // Gets the value of the dynamic query
            var value = getValue(dyn_value, object);

            // Apply the replace to all items in the original HTML string
            return html.replace(regexp, value !== null ? value : '');
        }, str_html);
    }

    // Extract the dynamic values queried in curly braces
    function getDynamicVariables(str){

        // Regex Explanation:
        // (?<={{) Require opening curly braces before match, but not include in the result
        // ([^]*?) Accept the minimum string length before the next condition below.
        // (?=}}) - Require closing curly braces after match

        // Returns matches or an empty array if there's no matches
        var result = (str.match(/(?<={{)([^]*?)(?=}})/g) || []);

        // Filter the results to remove duplicates
        return result.filter(function(item, pos) {
            return result.indexOf(item) === pos;
        })
    }

function getValue(var_string, object){

    //Check if the dynamic variable is the type {{if:condition:value1:value2}}
    if (var_string.indexOf('if:') > -1) {
        // Retrieves the value from the conditional
        return getValueFromConditional(var_string, object);
    } else if (var_string.indexOf('compute:') > -1) {
        return getValueFromCompute(var_string, object);
    } else {
        return getValueFromObject(var_string, object);
    }
}

// Analize the condition: {{if:some-value:operator:value:option1:option2}}
function getValueFromConditional(str_condition, object){

    // Split conditional parameters into arrey
    var condition = str_condition.split(':');

    // We get the value from the object to compare {{if:SOME-VALUE:operator:value:option1:option2}}
    var variable_value = getValueFromObject(condition[1], object);

    // We convert to native primitives of string values {{if:some-value:operator:VALUE:option1:option2}}
    condition[3] = condition[3] === "null" ? null : condition[3];
    condition[3] = condition[3] === "true" ? true : condition[3];

    // for the conditional values we can use objects indicated by {@object.property@} on {{if:some-value:operator:value:OPTION1:OPTION2}}
    condition[4] = checkVariableInContent(condition[4], object);
    condition[5] = checkVariableInContent(condition[5], object);

    // Finally we compute the conditional based on the operator {{if:some-value:OPERATOR:value:option1:option2}}
    // We use 'is' to compare values to true like: item.name ? 'value if true' : 'value if false'
    switch(condition[2]){
        case 'is':
            return variable_value ? condition[4] : condition[5];
        case '==':
            return (condition[3] == variable_value) ? condition[4] : condition[5];
        case '!=':
            return (condition[3] != variable_value) ? condition[4] : condition[5];
        case '>':
            return (condition[3] > variable_value) ? condition[4] : condition[5];
        case '<':
            return (condition[3] < variable_value) ? condition[4] : condition[5];
        case '<=':
            return (condition[3] <= variable_value) ? condition[4] : condition[5];
    }
}

    // We check if condition values has reference to the object to get dynamic data
    function checkVariableInContent(condition, object){

        // Check if the values contains expressions to evaluate expressed as {@object@} or {@object.property@}
        var expr = condition.match(/{@(.*?)@}/);

        // Replace the expression by its value found in the object or return the string as it is
        return expr ? condition.replace(expr[0],getValueFromObject(expr[1], object)) : condition;
    }

    // Gets the value from the data
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

    function getValueFromCompute(str_compute, object) {

        var regex = /compute:([\w.]*)\((.*)\)/;     // compute:function_name(parameters) -> we create 2 group matches, one for the fn name an another for the parameters
        var parts = regex.exec(str_compute);
        var fn = parts[1];

        // Analize the parameters passed to the function
        var values = parts[2].split(',').map(function(parameter, index){

            // cleaning white spaces
            parameter = parameter.trim();

            // Returning the value. If string, removing the ', if object, get the property of the object
            return parameter.indexOf('\'') > -1 ? parameter.replace(/\'/g, '') : getValueFromObject(parameter, object);
        });

        if(typeof window[fn] === "function"){
            return window[fn](values);
        }else {
            if(fn.indexOf('.')>-1){

                // we break function into properties based on dot notations. object.props0.props1
                var props = fn.split('.');

                // We verify if object.firstField exists and object.firstField.secondField if it is a function
                // If not we check if window.firstField exists and window.firstField.secondField if it is a function
                if (object[props[0]] && typeof object[props[0]][props[1]] === "function") {
                    return object[props[0]][props[1]].apply(object[props[0]], values);
                } else if(window[props[0]] && typeof window[props[0]][props[1]] === "function") {
                    return window[props[0]][props[1]].apply(window[props[0]], values);
                } else {
                    // We create an advice that we are using a not existing function on this template
                    console.log("Error: " + str_compute + " is not a function");
                }
            }
            console.log("Error: " + str_compute + " is not a function");
        }
    }

    window.dt = dynamicTemplate;

})(window);