// note: tried to put this in .eleventy.js for immediate reload, but it didn't work and it's not really necessary
const fs = require('fs')

// fetch data from design-tokens.json
const data = require('../styles/design-tokens.json')
toScss('color', 'variables', data)
toScss('font', 'properties', data)

function toScss(type, output, data) {
    let dataArray = toObjectArray(type, data[type])
    let scss

    if (output == 'variables') {
        scss = toScssVariables(type, dataArray)
    } else if (output == 'properties') {
        scss = toScssProperties(dataArray)
    }
    
    writeFile(type, scss)
}

// map data to array of objects
function toObjectArray(type, data) {
    let array = []
    if (type == 'color') {
        for (let key in data) {
            array.push({
                [key]: {
                    [type]: data[key].value
                }
            })
        }
        return array
    } 
    else if (type == 'font') {
        for (let key in data) {
            let property = data[key].value
            let values = ''
            for (let key in property) {
                values += `${   sanitizeString(key)   }: ${property[key]}${addUnit(sanitizeString(key))};\n`
            }
            array.push({
                [key]: `{ ${values} }`
            })
        }
        return array
    }
}

// map array of objects to list of ready-to-use scss variables
function toScssVariables(type, data) {
    let scss = ''
    data.forEach(item => {
        for (let key in item) {
            scss += `$${replaceSpaceWithDash(key)}: ${item[key][type]};\n`
        }
    })
    return scss
}

// map array of objects to list of assigned properties to heading in scss
function toScssProperties(data) {
    let scss = ''
    data.forEach(item => {
        for (let key in item) {
            scss += `.${sanitizeString(key)} ${item[key]} \n`
        }
    })
    return scss
}

function sanitizeString(string) {
    let withoutDash = replaceSpaceWithDash(string)
    let kebabCase = camelCaseToKebabCase(withoutDash)
    return convertOddNames(kebabCase)
}

// scss variable names can't have spaces
function replaceSpaceWithDash(string) {
    return string.replace(/ /g, '-')
}

// convert to actual css properties
function camelCaseToKebabCase(string) {
    return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

// some names are odd (@figma dev?), so we need to convert them manually
function convertOddNames(string) {
    if (string == 'text-case') {
        return  'text-transform'
    } else if (string == 'paragraph-indent') {
        return  'text-indent'
    } else if (string == 'paragraph-spacing') {
        return 'word-spacing'
    } else {
        return string
    }
}

function addUnit(property) {
    if (property == 'font-size' || property == 'line-height') {
        return 'px'
    } else {
      return ''
    }
}

function writeFile(type, scss) {
    fs.writeFile(`assets/css/settings/_settings.${type}.scss`, scss, (err) => {
        if (err) throw err
        console.log('The scss file has been generated from data and saved!')
    })
}