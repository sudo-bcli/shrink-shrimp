/**
 * Win Builder
 * @author bcli
 * @see https://github.com/electron-userland/electron-packager/blob/master/usage.txt
 */

const shell = require('shelljs');
const os = require('os');

const opt = {
    "name":         "shrink_shrimp",                 // name of executable
    "platform":     "win32",                        // target platform
    "arch":         "x64",                           // target arch
    "icon":         "assets/icon/shrimp_win.icon",// app icon, @see https://elliotekj.com/2014/05/27/how-to-create-high-resolution-icns-files/
    "copyright":    "MIT License",                   // copyright info
    "company":      "bclicn",                        // company name
    "description":  "https://github.com/bclicn/shrink-shrimp/" // package description
};

const cmd = `npx electron-packager . ${opt.name} --platform=${opt.platform} --arch=${opt.arch} --app-version=${process.env.npm_package_version} --build-version=${process.env.npm_package_version} --icon=${opt.icon} --overwrite --asar --prune=true --out=./release-builds/${process.env.npm_package_version}/ --win32metadata.CompanyName="${opt.company}" --win32metadata.FileDescription="${opt.description}"`;

if(os.platform != 'win32'){
    console.warn('You are trying to build a Windows release on ' + os.platform + ', this may cause unexpect results.');
}else{
    console.log(`Building Windows Release of ${opt.name}...`);
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