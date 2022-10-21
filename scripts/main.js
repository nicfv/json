'use strict';

class App {
    /**
     * The number of spaces to use for indentation in code.
     */
    static #NUM_SPACES = 2;
    /**
     * Write JSON string with a variable number of indentation spaces.
     */
    static #write(jsonString = '', spaces = 0) {
        return JSON.stringify(JSON.parse(jsonString), null, spaces);
    }
    /**
     * Add slashes before double quotes in a string.
     */
    static #addSlashes(str = '') {
        return str.replace('"', '\\"')
    }
    /**
     * Beautify the JSON string parameter.
     */
    static beautify(jsonString = '') {
        return App.#write(jsonString, App.#NUM_SPACES);
    }
    /**
     * Minify the JSON string parameter.
     */
    static minify(jsonString = '') {
        return App.#write(jsonString);
    }
    /**
     * Convert JSON to a CSV string.
     */
    static JSON2CSV(jsonString = '') {
        const objArr = JSON.parse(jsonString);
        let csv = '', keys = [];
        if (Array.isArray(objArr)) {
            objArr.forEach(obj => {
                if (typeof obj === 'object') {
                    if (!csv.length) {
                        keys = Object.keys(obj); // sort?
                        keys.forEach(key => csv += '"' + App.#addSlashes(key) + '", ');
                        csv += '\n';
                    }
                    keys.forEach(key => csv += '"' + App.#addSlashes(obj[key]) + '", ');
                    csv += '\n';
                } else {
                    csv += '"' + App.#addSlashes(obj) + '"\n';
                }
            });
        }
    }
    /**
     * Convert a CSV string to JSON.
     */
    static CSV2JSON(csvString = '') {
        const lines = csvString.split('\n'),
            regex = / *(["']?)(.*?[^\1])\1(, *|$)/g,
            values = lines.map(line => [...line.matchAll(regex)].map(r => r[2])); console.log(values);
        let json = [];
        if (values[0].length > 1) {
            for (let y = 1; y < values.length; y++) {
                const newObj = {};
                for (let x = 0; x < values[0].length; x++) {
                    newObj[values[0][x]] = values[y][x];
                }
                json.push(newObj);
            }
        } else {
            values.forEach(value => json.push(value));
        } console.log(json);
        return JSON.stringify(json, null, App.#NUM_SPACES);
    }
}
