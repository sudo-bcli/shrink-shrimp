/**
 * OSX Builder
 * @author bcli
 * @description builder for OSX, tested on OSX 10.14.3
 * @see https://github.com/electron-userland/electron-packager/blob/master/usage.txt
 */

const builder = require('./builder');

// cli options
const opt = {
    name:         "shrink_shrimp",                // name of executable
    version:      process.env.npm_package_version,// use version defined in package.json
    platform:     "darwin",                       // target platform
    arch:         "x64",                          // target arch
    icon:         "assets/icon/shrimp_mac.icns",  // app icon
    copyright:    "MIT License",                  // copyright
    remove:       [                               // remove some unnecessary files which will only add to release size
                        'LICENSES.chromium.html',
                        'LICENSE',
                        'version'
                    ]
};

// electron packager command
const command = `npx electron-packager . ${opt.name} --platform=${opt.platform} --arch=${opt.arch} --app-version=${opt.version} --icon=${opt.icon} --overwrite --asar --prune=true --out=./release-builds/${opt.version}/`;

async function build(){
    try{
        await builder.prebuild(opt);
        await builder.build(command);
        await builder.postbuild(opt);
        console.log('BUILD COMPLETE');
        process.exit(0);
    }catch(err){
        console.error(err);
        process.exit(1);
    }
}

build();
