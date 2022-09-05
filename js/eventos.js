const Events = {
    findInArray: function (array, value) {
        for (let v of array) {
            if (v == value) {
                return true;
            }
        }
        return false;
    },

    ignoreInText: function (text, value) {

        var result = '';

        for (let l of text) {
            if (l != value) {
                result += l;
            }
        }

        return result;

    },

    filterText: function (text, filter) {
        text = text.toLowerCase();
        filter = filter.toLowerCase();

        for (let l in text) {
            if (text[l] == filter[0]) {
                if (text.substring(l, (Number(l) + Number(filter.length))) == filter) {
                    return true
                }
            }
        }

        return false;
    },

    createElements: function (isParent, Manter, Elementos) {
        var elements = '';

        for (let _element in Elementos) {

            var elementName = _element.split('_')[0];
            var elementInfo = Elementos[_element]
            var elementConfig = elementInfo.Attribute;

            // console.log(`\n\n\n\n\n`)
            // console.log(isParent);
            // console.log(elementName);
            // console.log(elementInfo);

            function setConfig() {
                var result = '';

                for (let _config in elementConfig) {
                    var attribute = elementConfig[_config];

                    switch (typeof attribute) {
                        case 'string': {
                            result += `${_config}="${attribute}"`;
                        } break;

                        case 'object': {
                            result += `${_config}="`

                            for (let info in attribute) {
                                if (Array.isArray(attribute)) {
                                    result += `${attribute[info]} `

                                } else {

                                    result += `${info}:${attribute[info]};`

                                }
                            }
                            result += `"`;
                        } break;
                    }
                }

                return result;
            }

            var ELEMENTO = `<${elementName} ${setConfig()}> ${(elementInfo.Content != undefined ? elementInfo.Content : '')} ${(elementInfo.Close === true ? ('</' + elementName + '>') : '')}`;

            if (isParent) {
                elements += ELEMENTO;
                continue
            }

            if (Manter) {
                elementInfo.Parent.innerHTML += ELEMENTO;

            } else {
                elementInfo.Parent.innerHTML = ELEMENTO;
            }
        }

        if (isParent) {
            if (Manter) {
                isParent.innerHTML += elements;

            } else {
                isParent.innerHTML = elements;
            }

        } else {

            if (Manter) {
                elementInfo.Parent.innerHTML += elements;

            } else {
                elementInfo.Parent.innerHTML = elements;
            }
        }
    },

    secondsToMinute: function (time) {
        const min = Math.floor(time / 60);
        const seg = Math.floor(time % 60);

        return `${("0" + min).slice(-2)}:${("0" + seg).slice(-2)}`
    },

    readText: function (DIR) {

        var FILE = new FileReader();

        FILE.onload = function () {
            return FILE.result;
        }

        FILE.readAsText();
    }
}

