/**
 * Windows Builder
 * @author bcli
 * @description builder for Windows x64, tested on Windows 10 x64
 * @see https://github.com/electron-userland/electron-packager/blob/master/usage.txt
 * @see https://elliotekj.com/2014/05/27/how-to-create-high-resolution-icns-files/
 */

const builder = require('./builder');

// cli options
const opt = {
    name:         "shrink_shrimp",                // name of executable
    version:      process.env.npm_package_version,// use version defined in package.json
    platform:     "win32",                        // target platform
    arch:         "x64",                          // target arch
    icon:         "assets/icon/shrimp_win.icon",  // app icon
    copyright:    "MIT License",                  // copyright
    company:      "bclicn",                        // company name
    description:  "https://github.com/bclicn/shrink-shrimp/", // package description
    remove:       [                               // remove some unnecessary files which will only add to release size
                        'locales',
                        'swiftshader',
                        'chrome_100_percent.pak',      
                        'chrome_200_percent.pak',
                        'd3dcompiler_47.dll',
                        'libGLESv2.dll',
                        'LICENSES.chromium.html',
                        'osmesa.dll',
                        'snapshot_blob.bin',
                        'VkICD_mock_icd.dll',
                        'VkLayer_core_validation.dll',
                        'VkLayer_object_tracker.dll',
                        'VkLayer_parameter_validation.dll',
                        'VkLayer_threading.dll',
                        'VkLayer_unique_objects.dll'
                    ]
};

// electron packager command
const command = `npx electron-packager . ${opt.name} --platform=${opt.platform} --arch=${opt.arch} --app-version=${opt.version} --build-version=${opt.version} --icon=${opt.icon} --overwrite --asar --prune=true --out=./release-builds/${opt.version}/ --win32metadata.CompanyName="${opt.company}" --win32metadata.FileDescription="${opt.description}"`;

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

