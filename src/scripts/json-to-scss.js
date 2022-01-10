// Requiring fs module in which writeFile function is defined.
const fs = require('fs')
// todo: fetch data from json file
let scssData = {
    "color": {
        "black": {
            "description": "",
            "type": "color",
            "value": "#202020ff",
            "extensions": {
                "org.lukasoppermann.figmaDesignTokens": {
                    "styleId": "S:9a6f71fe7640901dbc31c4a5b7f72b1a468e8615,",
                    "exportKey": "color"
                }
            }
        },
        "gray 1": {
            "description": "",
            "type": "color",
            "value": "#313131ff",
            "extensions": {
                "org.lukasoppermann.figmaDesignTokens": {
                    "styleId": "S:05dbd9effcdebb550f7dd357036f156e5da122ef,",
                    "exportKey": "color"
                }
            }
        },
        "gray 2": {
            "description": "",
            "type": "color",
            "value": "#878a8dff",
            "extensions": {
                "org.lukasoppermann.figmaDesignTokens": {
                    "styleId": "S:9b311e1f529424bfebb192c595528ae204e6a688,",
                    "exportKey": "color"
                }
            }
        },
        "brand": {
            "description": "",
            "type": "color",
            "value": "#67c8f2ff",
            "extensions": {
                "org.lukasoppermann.figmaDesignTokens": {
                    "styleId": "S:a03c810d7a4dbacb689a640f694ee374ba9a4c7b,",
                    "exportKey": "color"
                }
            }
        },
        "gray 3": {
            "description": "",
            "type": "color",
            "value": "#f6f6f6ff",
            "extensions": {
                "org.lukasoppermann.figmaDesignTokens": {
                    "styleId": "S:a20f79553d0dbb4e6587dff90455ef2739f29686,",
                    "exportKey": "color"
                }
            }
        },
        "white": {
            "description": "",
            "type": "color",
            "value": "#ffffffff",
            "extensions": {
                "org.lukasoppermann.figmaDesignTokens": {
                    "styleId": "S:795a1ed3e74bac8d2665aa6bbedcd13e894b9cd5,",
                    "exportKey": "color"
                }
            }
        }
    }
}
let data = toScss(scssData.color)

function toScss(data) {
    let dataArray = toObjectArray(data)
    return toScssVariables(dataArray)
}

// map data to array of objects
function toObjectArray(data) {
    let array = []
    for (let key in data) {
        array.push({
            [key]: {
                color: data[key].value
            }
        })
    }
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

// write data to scss file
fs.writeFile('assets/css/settings/_settings.tokens.scss', data, function (err) {
    if (err) throw err;
    console.log('generated scss file from data');
});