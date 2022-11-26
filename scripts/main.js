'use strict';

/**
 * GUI functions.
 */
class App {
    /**
     * Return the contents in the input textarea.
     */
    static #getInput() {
        return document.getElementById('in').value;
    }
    /**
     * Return the contents in the output textarea.
     */
    static #getOutput() {
        return document.getElementById('out').value;
    }
    /**
     * Set the contents to the input textarea.
     */
    static #setInput(value = '') {
        document.getElementById('in').value = value;
    }
    /**
     * Set the contents to the output textarea.
     */
    static #setOutput(value = '') {
        document.getElementById('out').value = value;
    }
    /**
     * Set the status in the status bar.
     */
    static #setStatus(fileType = '', content = '') {
        // const out = App.#getOutput(), lines = out.split('\n').length, length = out.length;
        // let fileType = '';
        // try {
        //     JSONCSV.minify(out);
        //     fileType = 'JSON';
        // } catch (e) {
        //     fileType = 'CSV';
        // }
        document.getElementById('statusbar').textContent = 'Format: ' + fileType + ' | Lines: ' + content.split('\n').length + ' | Length: ' + content.length;
    }
    /**
     * Beautify the input string.
     */
    static beautify() {
        try {
            const out = JSONCSV.beautify(App.#getInput());
            App.#setOutput(out);
            App.#setStatus('JSON', out);
        } catch (e) {
            alert(e);
        }
    }
    /**
     * Minify the input string.
     */
    static minify() {
        try {
            const out = JSONCSV.minify(App.#getInput());
            App.#setOutput(out);
            App.#setStatus('JSON', out);
        } catch (e) {
            alert(e);
        }
    }
    /**
     * Convert the input JSON to a CSV format.
     */
    static JSON2CSV() {
        try {
            const out = JSONCSV.JSON2CSV(App.#getInput());
            App.#setOutput(out);
            App.#setStatus('CSV', out)
        } catch (e) {
            alert(e);
        }
    }
    /**
     * Convert the input CSV to a JSON format.
     */
    static CSV2JSON() {
        try {
            const out = JSONCSV.CSV2JSON(App.#getInput());
            App.#setOutput(out);
            App.#setStatus('JSON', out);
        } catch (e) {
            alert(e);
        }
    }
    /**
     * Copy the output to the input field.
     */
    static copy() {
        App.#setInput(App.#getOutput());
    }
}

/**
 * Functions for beatufying JSON and converting to and from CSV.
 */
class JSONCSV {
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
     * Double quote and add slashes before double quotes in a string.
     */
    static #addSlashes(str = '') {
        return typeof str === 'string' ? ('"' + str.replace(/"/g, '\\"') + '"') : str;
    }
    /**
     * Remove excess slashes in a string.
     */
    static #removeSlashes(str = '') {
        return str.replace(/\\/g, '');
    }
    /**
     * Beautify the JSON string parameter.
     */
    static beautify(jsonString = '') {
        return JSONCSV.#write(jsonString, JSONCSV.#NUM_SPACES);
    }
    /**
     * Minify the JSON string parameter.
     */
    static minify(jsonString = '') {
        return JSONCSV.#write(jsonString);
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
                        keys = Object.keys(obj);
                        keys.forEach(key => csv += JSONCSV.#addSlashes(key) + ', ');
                        csv += '\n';
                    }
                    keys.forEach(key => csv += JSONCSV.#addSlashes(obj[key]) + ', ');
                    csv += '\n';
                } else {
                    csv += JSONCSV.#addSlashes(obj) + '\n';
                }
            });
            return csv;
        } else {
            throw 'Input parameter must be an array of valid JSON objects.';
        }
    }
    /**
     * Convert a CSV string to JSON.
     */
    static CSV2JSON(csvString = '') {
        const lines = csvString.trim().split('\n'),
            regex = /\s*(["']?)(.*?)\1\s*,/g,
            values = lines.map(line => [...(line + ',').matchAll(regex)].map(r => r[2]));
        let json = [];
        if (values.length > 1 && values[0].length > 1) {
            for (let y = 1; y < values.length; y++) {
                const newObj = {};
                for (let x = 0; x < values[0].length; x++) {
                    values[0][x] && (newObj[JSONCSV.#removeSlashes(values[0][x])] = JSONCSV.#removeSlashes(values[y][x]));
                }
                json.push(newObj);
            }
        } else {
            json = values.flat().map(v => JSONCSV.#removeSlashes(v));
        }
        return JSON.stringify(json, null, JSONCSV.#NUM_SPACES);
    }
}
