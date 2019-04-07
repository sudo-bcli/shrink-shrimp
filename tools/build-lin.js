/**
 * Linux Builder
 * @author bcli
 * @description a installer.sh would be auto-generated to create a desktop icon for you
 * @see https://github.com/electron-userland/electron-packager/blob/master/usage.txt
 */

const builder = require('./builder');

// cli options
const opt = {
    name:         "shrink_shrimp",                // name of executable
    version:      process.env.npm_package_version,// use version defined in package.json
    platform:     "linux",                        // target platform
    arch:         "x64",                          // target arch
    icon:         "assets/icon/shrimp_lin.png",   // app icon
    copyright:    "MIT License",                  // copyright
    remove:       [                               // remove some unnecessary files which will only add to release size
                        'locales',
                        'swiftshader',
                        'chrome_100_percent.pak',      
                        'chrome_200_percent.pak',
                        'libVkICD_mock_icd.so',
                        'libGLESv2.so',
                        'libVkICD_mock_icd.so',
                        'LICENSES.chromium.html',
                        'snapshot_blob.bin'
                    ]
};

// electron packager command
const command = `npx electron-packager . ${opt.name} --platform=${opt.platform} --arch=${opt.arch} --app-version=${opt.version} --build-version=${opt.version} --icon=${opt.icon} --overwrite --asar --no-deref-symlinks --prune=true --out=./release-builds/${opt.version}/`;


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
