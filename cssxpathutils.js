var xpathNamespaceResolver = {
    svg: 'http://www.w3.org/2000/svg',
    mathml: 'http://www.w3.org/1998/Math/MathML'
};

getElementByXPath = function getElementByXPath(_regex, _selectors) {
    const allElements = [...document.querySelectorAll(_selectors.join(','))];
    // convert expression var -> regex;
    const regex = new RegExp(_regex, 'gi');
    const nodes = [];
    allElements.forEach(el => {
        const found = regex.test(el['outerHTML']);
        if (found)
            nodes.push(el);
    });
    return nodes;
};

retrieveCssOrXpathSelector = function (arg, selectors, type) {
    var root = [], nodes;
    nodeType = type.toLowerCase();
    function retrieveNodeNameAndAttributes(node) {
        var output = '';
        try {
            var nodeName = node.nodeName.toLowerCase();
        } catch (e) {
            console.error('ERROR no matching node');
            return;
        }
        if (node.hasAttributes()) {
            var attrs = node.attributes;
            for (var i = 0; i < attrs.length; i++) {
                if (nodeType === 'xpath') {
                    if (attrs[i].value) {
                        output += '[@' + attrs[i].name + "='" + attrs[i].value + "']";
                    }
                    else {
                        output += '[@' + attrs[i].name + ']';
                    }
                }
                else if (nodeType === 'css') {
                    if (attrs[i].value) {
                        if (attrs[i].name === 'id') {
                            if (/:/.test(attrs[i].value)) {
                                output += "[id='" + attrs[i].value + "']"; // new Ex: [id="foo:bar"]
                            }
                            else {
                                output += "#" + attrs[i].value;
                            }
                        } else if (attrs[i].name === 'class') {
                            var classes = attrs[i].value.split(/\s+\b/).join('.');
                            output += '.' + classes;
                        }
                        // else {
                        //     output += "[" + attrs[i].name + "='" + attrs[i].value + "']";
                        // }
                    }
                    else {
                        output += "[" + attrs[i].name + "]";
                    }
                }
            }
        }

        var txt = '';
        if (nodeName === 'a' && nodeType === 'xpath') {
            txt = "[text()='" + node.innerText + "']";
        }

        root.push({ 'name': nodeName, 'attrs': output, txt });

        if (nodeName === 'body') return;
        else retrieveNodeNameAndAttributes(node.parentNode); // recursive function
    }

    if (typeof arg === 'string') { // text from within the page
        nodes = getElementByXPath(arg, selectors);
    } else if (typeof arg === 'object') { // node argument, let's do some 'duck typing'
        if (arg && arg.nodeType) {
            node = arg;
        }
        else {
            console.error("ERROR expected node, get object");
            return;
        }
    } else {
        console.error("ERROR expected node or string argument");
        return;
    }

    var outputs = [];
    for (node of nodes) {
        retrieveNodeNameAndAttributes(node);

        var output = '';
        if (nodeType === 'css') {
            output = root.reverse().map(elt => elt.name + elt.attrs).join(' > ');
        }
        else if (nodeType === 'xpath') {
            output = '//' + root.reverse().map(elt => elt.name + elt.txt + elt.attrs).join('/');
        }
        else {
            console.error('ERROR unknown type ' + type);
        }
        outputs.push(output);
    }

    return outputs;
};


x = function (arg, selectors) {
    debugger;
    console.log("CSS\n" + retrieveCssOrXpathSelector(arg, selectors, 'css'));
    console.log("XPath\n" + retrieveCssOrXpathSelector(arg, selectors, 'xpath'));
};
