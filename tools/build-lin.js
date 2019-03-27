/**
 * Linux Builder
 * @author bcli
 * @see https://github.com/electron-userland/electron-packager/blob/master/usage.txt
 */

const shell = require('shelljs');
const os = require('os');

const opt = {
    "name":         "shrink_shrimp",                 // name of executable
    "platform":     "linux",                        // target platform
    "arch":         "x64",                           // target arch
    "icon":         "assets/icon/shrimp_lin.png",// app icon, @see https://elliotekj.com/2014/05/27/how-to-create-high-resolution-icns-files/
    "copyright":    "MIT License"                   // copyright info
};

const cmd = `npx electron-packager . ${opt.name} --platform=${opt.platform} --arch=${opt.arch} --app-version=${process.env.npm_package_version} --build-version=${process.env.npm_package_version} --icon=${opt.icon} --overwrite --asar --no-deref-symlinks --prune=true --out=./release-builds/${process.env.npm_package_version}/`;

if(os.platform != 'linux'){
    console.warn('You are trying to build a Linux release on ' + os.platform + ', this may cause unexpect results.');
}else{
    console.log(`Building Linux Release of ${opt.name}...`);
    console.log(process.cwd());
    console.log(cmd);
}

shell.exec(cmd,{silent:true},(code,stdout,stderr)=>{
    if(code === 0){
        console.log('Done');
        console.log(`built under ./release-builds/${process.env.npm_package_version}/`);
    }else{
        console.error('Failed');
        console.error(stderr);
    }
});