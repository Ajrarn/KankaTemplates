const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()

// Cache global pour les templates compilés
const fileCache = {}

// Fonction d'échappement HTML
const escapeHtml = (unsafe) =>
    String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")

// Compile un template .kan en fonction JS
function compileTemplate(content) {
    let tpl = content

    // Variables brutes {!! var !!}
    tpl = tpl.replace(/\{\!\!\s*([a-zA-Z0-9_]+)\s*\!\!\}/g, (_, varName) => {
        return `\$\{options.attributes["${varName}"] ?? ""\}`
    })

    // Variables sécurisées {{ $_var }}
    tpl = tpl.replace(/\{\{\s*\$_([a-zA-Z0-9_]+)\s*\}\}/g, (_, varName) => {
        return `\$\{escapeHtml(options.attributes["${varName}"] ?? "")\}`
    })

    // Variables directes non échappées {{ $var }}
    tpl = tpl.replace(/\{\{\s*\$([a-zA-Z0-9_]+)\s*\}\}/g, (_, varName) => {
        return `\$\{options.attributes["${varName}"] ?? ""\}`
    })

    // @i18n("Text")
    tpl = tpl.replace(/@i18n\("([^"]+)"\)/g, (_, txt) => {
        return `\$\{(options.i18n && options.i18n["${txt}"]) || "${txt}"\}`
    })

    // @liveAttribute('field') – version non échappée pour supporter les <br />
    tpl = tpl.replace(/@liveAttribute\('([^']+)'\)/g, (_, field) => {
        return `\$\{options.attributes["${field}"] ?? ""\}`
    })

    // Conditions
    tpl = tpl
        .replace(/@if\s*\(([^)]+)\)/g, (_, condition) => {
            return `\`); if (${condition}) { out.push(\``
        })
        .replace(/@elseif\s*\(([^)]+)\)/g, (_, condition) => {
            return `\`); } else if (${condition}) { out.push(\``
        })
        .replace(/@else/g, () => {
            return `\`); } else { out.push(\``
        })
        .replace(/@endif/g, () => {
            return `\`); } out.push(\``
        })

    // Boucles
    tpl = tpl
        .replace(/@foreach\s*\(([^)]+)\)/g, (_, expression) => {
            return `\`); for (${expression}) { out.push(\``
        })
        .replace(/@endforeach/g, () => {
            return `\`); } out.push(\``
        })

    const finalCode = `
        let out = [];
        out.push(\`${tpl}\`);
        return out.join("");
    `;

    try {
        return new Function('options', 'escapeHtml', finalCode);
    } catch (err) {
        console.error("Erreur dans compileTemplate:", err);
        console.error("Code généré:", finalCode);
        return null;
    }

}

function renderTemplate(filePath, options) {
    const content = fs.readFileSync(filePath, 'utf8')

    let renderFn = fileCache[filePath]
    if (!renderFn) {
        renderFn = compileTemplate(content)
        fileCache[filePath] = renderFn
    }

    if (typeof renderFn !== 'function') {
        throw new Error(`La compilation de ${filePath} n'a pas produit de fonction.`)
    }

    return renderFn(options, escapeHtml)
}

// Déclaration du moteur
app.engine('kan', (filePath, options, callback) => {
    try {
        const rendered = renderTemplate(filePath, options)
        callback(null, rendered)
    } catch (err) {
        callback(err)
    }
})

app.set('views', path.join(__dirname, 'templates'))
app.set('view engine', 'kan')

// Route : /template/:name
app.get('/template/:name', (req, res) => {
    const tplName = req.params.name
    const baseDir = app.get('views')
    const tplDir = path.join(baseDir, tplName)

    const tplPath = path.join(tplDir, 'template.kan')
    const jsonPath = path.join(tplDir, 'template.json')

    if (!fs.existsSync(tplPath)) {
        return res.status(404).send('Template not found')
    }

    let jsonData = {}
    if (fs.existsSync(jsonPath)) {
        jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    }

    // **Important : structurer correctement les options**
    const innerHTML = renderTemplate(tplPath, {
        attributes: jsonData.attributes || {},
        i18n: jsonData.i18n || {}
    })

    const layoutOptions = {
        attributes: {
            template: innerHTML, // <-- ajouté ici
            css_url: `/${tplName}/template.css`,
            js_url: `/${tplName}/template.js`,
            ...(jsonData.attributes || {})
        },
        i18n: jsonData.i18n || {}
    }

    res.render('index', layoutOptions)
})

app.use(express.static(path.join(__dirname, 'templates')))

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
