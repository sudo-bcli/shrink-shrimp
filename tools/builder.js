const shell = require('shelljs');
const os = require('os');
const path = require('path');

function prebuild(opt){
    return new Promise((resolve,reject)=>{
        let plat = os.platform();
        let arch = os.arch();
        if(plat == opt.platform && arch == opt.arch){
            console.log(`TARGET:  ${opt.name}-${process.env.npm_package_version} ${opt.platform}_${opt.arch}`);
            console.log(`SRC_DIR: ${process.cwd()}`);
            resolve('');
        }else{
            reject(`You are trying to build ${opt.platform}_${opt.arch} release on ${plat}_${arch}, this may cause unexpected results.`);
        }
    });
}

function build(command){
    return new Promise((resolve,reject)=>{
        console.log(`CMD:     ${command}`);
        shell.exec(command,{silent:true},(code,stdout,stderr)=>{
            if(code === 0){
                console.log(`FILES GENERATED`);
                resolve('');
            }else{
                reject(stderr);
            }
        });
    });
}

function postbuild(opt){
    return new Promise((resolve,reject)=>{
        let dir = path.join(process.cwd(),'release-builds',opt.version,`${opt.name}-${opt.platform}-${opt.arch}`);
        let pth;
        opt.remove.forEach((ele)=>{
            pth = path.join(dir,ele);
            console.log(`RM: ${pth}`);
            result = shell.rm('-rf',pth);
            if(result.code !== 0){
                reject(`failed to remove ${ele}, ${result.stderr}`);
            }
        });
        resolve('');
    });
}

module.exports = {prebuild,build,postbuild};