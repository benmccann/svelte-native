const fs = require('fs')
const path = require('path')
const packageFileContent = fs.readFileSync(path.resolve(__dirname, '../package.json'), { encoding: "utf8" });
const rootPackageContent = JSON.parse(packageFileContent);

let desiredKeys = [
    "name",
    "version",
    "description",
    "author",
    "license",
    "sideEffects",
    "peerDependencies",
    "keywords",
    "homepage",
    "repository"
]

let destinationPackageContent = {}

for (let key of desiredKeys) {
    destinationPackageContent[key] = rootPackageContent[key]
}

Object.assign(destinationPackageContent, {
    ...destinationPackageContent,
    "main": "index.js",
    "types": "index.d.ts"
})

const finalFileContent = JSON.stringify(destinationPackageContent, null, 4)
fs.writeFileSync(path.resolve(__dirname, "../dist/package.json"), finalFileContent)

//Copy our readme and license file
const filesToCopy = ["Readme.md", "LICENSE", "CHANGELOG.md"]
for (let file of filesToCopy) {
    fs.copyFileSync(path.resolve(__dirname, `../${file}`), path.resolve(__dirname, `../dist/${file}`))
}

const typeDefsToCopy = ["components/Template.svelte.d.ts", "jsx/svelte-native-jsx-nativescript-core.d.ts", "jsx/shims.d.ts", "ambient.d.ts"]
for (let file of typeDefsToCopy) {
    let dest = path.resolve(__dirname, `../dist/${file}`);
    if (!fs.existsSync(path.dirname(dest)))
        fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(path.resolve(__dirname, `../src/${file}`), dest)
}

// inject our JSX types
var indexdtspath = path.resolve(__dirname, `../dist/index.d.ts`);
var indexdts = fs.readFileSync(indexdtspath, "utf-8");
fs.writeFileSync(indexdtspath, indexdts + "\n\nimport './jsx/svelte-native-jsx-nativescript-core'\nimport './jsx/shims.d.ts'\n", "utf-8");