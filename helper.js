function _findElemByText({ str, selector, leaf = 'outerHTML' }) {
    const regex = new RegExp(str, 'gmi');
    const matchOuterHTML = e => (regex.test(e[leaf]))
    const elementArray = [...document.querySelectorAll(selector.join('a'))];

    return elementArray.filter(matchOuterHTML)
}