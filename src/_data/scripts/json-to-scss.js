// Requiring fs module in which writeFile function is defined.
const fs = require('fs')

// fetch data from design-tokens.json
const data = require('../styles/design-tokens.json')

toScss('color', data)

function toScss(type, data) {
    let dataArray = toObjectArray(type, data[type])
    let scss = toScssVariables(dataArray)
    fs.writeFile(`assets/css/settings/_settings.${type}.scss`, scss, (err) => {
        if (err) throw err
        console.log('The scss file has been generated from data and saved!')
    })
}

// map data to array of objects
function toObjectArray(type, data) {
    let array = []
    for (let key in data) {
        array.push({
            [key]: { [type]: data[key].value }
        })}
    return array
}

// map array of objects to list of ready-to-use scss variables
function toScssVariables(data) {
    let scss = ''
    data.forEach(item => {
        for (let key in item) {
            scss += `$${replaceSpaceWithDash(key)}: ${item[key].color};\n`
        }
    })
    return scss
}

// scss variable names can't have spaces
function replaceSpaceWithDash(string) {
    return string.replace(/ /g, '-')
}