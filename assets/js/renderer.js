/**
 * @name Render_Process
 * @author bcli
 * @description 
 * @see https://www.npmjs.com/package/jquery
 * @see https://www.npmjs.com/package/shelljs
 */

 // libraries
const fs     = require('fs');           // file system
const os     = require('os');           // operating system
const path   = require('path');         // path joiner
const $      = require('jquery');       // jQuery
const shell  = require('shelljs');      // cli executor
const lang   = require('./locales').en; // locales

// prefix of shrinked files
const pdf_prefix = 'shrink_';

// on OSX, gs can be accessed by both terminal & npm start but not
// the packed Application, thus I have to do a walk around by providing
// absolute path to gs executable
let gs = 'gs';
if(os.platform == 'darwin'){
    gs = '/usr/local/bin/gs';
}

// global varialbes, DO NOT CHANGE
let shrinking = false;
let appendedLogs = [];
let pdfNotFound = false;
let loading = '';
let done = '';

/**
 * initialization
 * @see https://stackoverflow.com/questions/6756583/prevent-browser-from-loading-a-drag-and-dropped-file
 */
function init(){
    // just in case user drop to somewhere outside the shrimp
    window.addEventListener("dragover",function(e){
        e = e || event;
        e.preventDefault();
    },false);
    window.addEventListener("drop",function(e){
        e = e || event;
        e.preventDefault();
    },false);
    
    // set text
    $('#info').html(lang.drop_pdf_here);

    // append table header
    let $tableHeader = $(`<tr><th>${lang.order}</th><th>${lang.filename}</th><th>${lang.rate}</th></tr>`);
    $('#reset button').html(lang.reset);
    $('#log table').append($tableHeader);
    loading = $('#loading-icon').html();
    done = $('#done-icon').html();
}

/**
 * Register jQuery Events
 * we have to call preventDefault on both 'dragenter' and 'dragover'
 * to enable the triggering of 'drop'
 * @see https://stackoverflow.com/questions/21339924/drop-event-not-firing-in-chrome
 */
function addEvents(){
    // dragging mouse enters the shrimp
    $('#shrimp').on('dragenter',(e)=>{
        e.preventDefault();
        if(shrinking) return;   // do nothing if we are already shrinking the files
        $('#shrimp').attr('class','shrimp-img-with-file');  // otherwise, show spinning shrimp
    });

    // dragging mouse over the shrimp
    $('#shrimp').on('dragover',(e)=>{
        e.preventDefault();
        if(shrinking) return;   // do nothing if we are already shrinking the files
    });

    // dragging mouse leaves the shrimp
    $('#shrimp').on('dragleave',(e)=>{
        if(shrinking) return;   // do nothing if we are already shrinking the files
        $('#shrimp').attr('class','shrimp-img');    // otherwise, reset spinning shrimp
        $('#info').html(lang.drop_pdf_here); // reset text
    });

    // if user drops a file list without any pdf files, then leave the shrimp, then
    // 'dragleave' won't be triggered since there are no files attached to the mouse
    // thus we have to use mouseleave event plus a pdfNotFound flag to simulate the same effect
    // as 'drop non pdfs then leave'
    $('#shrimp').on('mouseleave',(e)=>{
        if(pdfNotFound){
            if(shrinking) return;   // do nothing if we are already shrinking the files
            $('#shrimp').attr('class','shrimp-img');    // otherwise, reset spinning shrimp
            $('#info').html(lang.drop_pdf_here); // reset text
            pdfNotFound = false;
        }
    });

    // dragging mouse drop files to shrimp
    $('#shrimp').on('drop', (e)=>{
        e.preventDefault();
        e.stopPropagation();    // prevent chrome from openning the file
        if(shrinking) return;   // do nothing if we are already shrinking the files
        // otherwise try to get pdf pathes user has dropped to us
        let pdfPathes = [];
        for (let f of e.originalEvent.dataTransfer.files) { // note: dataTransfer is avaliable in originalEvent not jQuery event(e)
            if(f.path.split('.').pop().toLowerCase() === 'pdf'){
                pdfPathes.push(f.path);
            }
        }
        let len = pdfPathes.length;
        if(len > 0){    // if we got 1 or more pdf pathes, start shrinking
            $('#info').html('');
            $('#shrimp').fadeOut('fast',()=>{
                $('#icon').html(loading);
                $('#icon').fadeIn('fast',()=>{
                    $('#log').fadeIn('fast');
                    shrink(pdfPathes);  // async function
                });
            });
        }else{  // if we got no pdf pathes, show the error
            $('#info').html(lang.pdf_not_found); // text and shrimp would be reset upon mouse leave
            pdfNotFound = true;
        }
  });

  // reset button
  $('#reset').click(()=>{
    if(shrinking) return;
    $('#info').html('');
    $('#reset').fadeOut('fast');
    $('#icon').fadeOut('fast');
    $('#log').fadeOut('fast',()=>{ // hide log table
        appendedLogs.forEach((ele)=>{ // remove logs
            ele.remove();
        });
        appendedLogs = [];
        $('#shrimp').attr('class','shrimp-img');  // reset shrimp
        $('#shrimp').fadeIn('fast',()=>{
            $('#info').html(lang.drop_pdf_here); // reset text
        });
    });
  });
}

/**
 * Shrink PDF files by given string array
 * @param {Array} pdfPathes
 * in JS everything uses callback which is pretty annoying for C/JAVA programmers
 * ex: define:   A.callback(print 'A Done'),  B.callback(print 'B Done')
 *     execute:  A;B;
 *     expect:  'A Done'
 *              'B Done'
 *     get:     'B Done'
 *              'A Done'
 * so how can we do 'regular' stuff like A -> B in JavaScript? or 'if A returns true then execute B?'
 * this is when promise and promise chaining comes in handy!
 * to know more about promise & promise chaining and async-await (simplified promise chaining in ES8)
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
 */
async function shrink(pdfPathes){
    shrinking = true;   // tell ui we are doing shrinking!
    let errCount = 0;   // count error for final report
    let len = pdfPathes.length;
    for (let i=0; i<len; i++){
        let pth = {};
        try{
            pth = await parsePath(pdfPathes[i]);    // path is already taken so we use pth instead
            // pth.in: input PDF path
            // pth.ps: temporary ghostscript path
            // pth.out: output PDF path
            await pdf2ps(pth.in, pth.ps);   // convert pdf to ghostscript
            await ps2pdf(pth.ps, pth.out);  // convert ghostscript back to pdf
            await rmPS(pth.ps);             // remove temporary ghostscript file (usually bigger than both pdfs)
            appendLog(i,len,errCount,pth);   // append log to $('#log')
        }catch(err){    // will catch >>first<< error in the try block
            appendLog(i,len,errCount,pth,err);  // append log (with error message) to $('#log')
            errCount++;
            continue; // if we encounter an error in the try block, then the whole pdf shrinking process for this file is skipped
        }
    }
    shrinking = false; // tell ui the shrink is done
    $('#reset').fadeIn('fast');
}

/**
 * Parse PDF Path
 * feed pth with pathes of input/output PDF and temporary ghostscript
 * @param {string} pdfPath 
 */
function parsePath(pdfPath) {
    return new Promise(resolve => {
        let dir = path.dirname(pdfPath);
        let filename = path.basename(pdfPath).replace('.PDF', '.pdf');
        let ps = path.join(dir, '.' + filename.replace('.pdf', '.ps')); // ghostscript would start with '.' thus hidden from user
        let out = path.join(dir, pdf_prefix + filename);
        resolve({in: pdfPath, ps: ps, out: out});
    });
}

/**
 * Convert PDF to GhostScript
 * @param {string} pdfPath 
 * @param {string} psPath 
 */
function pdf2ps(pdfPath, psPath){
    return new Promise((resolve, reject) => {
        let cmd = `${gs} -q -dNOPAUSE -dBATCH -P- -dSAFER -sDEVICE=ps2write "-sOutputFile=${psPath}"  -c save pop -f "${pdfPath}"`;
        shell.exec(cmd, {silent:true}, (code, stdout, stderr)=>{
            if(code === 0){
                resolve({code: code, stdout: stdout, stderr: stderr});
            }else{
                reject({code: code, stdout: stdout, stderr: stderr});
            }
        });
    });
}

/**
 * Convert ghostscript back to PDF
 * @param {string} psPath 
 * @param {string} pdfPath
 */
function ps2pdf(psPath, pdfPath){
    return new Promise((resolve, reject) => {
        let cmd = `${gs} -P- -dSAFER -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sstdout=%stderr "-sOutputFile=${pdfPath}" -P- -dSAFER -c .setpdfwrite -f "${psPath}"`;
        shell.exec(cmd, {silent:true}, (code, stdout, stderr)=>{
            if(code === 0){
                resolve({code: code, stdout: stdout, stderr: stderr});
            }else{
                reject({code: code, stdout: stdout, stderr: stderr});
            }
        });
    });
}

/**
 * Delete GhostScript
 * @param {string} psPath 
 */
function rmPS(psPath){
    return new Promise((resolve, reject) => {
        let res = shell.rm('-f', psPath);
        if(res.code === 0){
            resolve({code: res.code, stdout: res.stdout, stderr: res.stderr});
        }else{
            reject({code: res.code, stdout: res.stdout, stderr: res.stderr});
        }
    });
}

/**
 * Append Log to $('#log')
 * @param {number} i 
 * @param {number} errCount
 * @param {number} len 
 * @param {object} pth 
 * @param {object} err 
 */
function appendLog(i,len,errCount,pth,err = undefined){
    let id, filename, rate, errMsg, errCountMsg;
    id = i + 1;
    filename = formatFilename(path.basename(pth.in),16);
    if(err === undefined){
        rate = shrinkRate(pth);
        errMsg = "done";
    }else{
        rate = 'err';
        errMsg = err.stderr;
        console.log(err);
    }
    let $newTableRow = $(`<tr class="error" title="${errMsg}"><td>${id}</td><td>${filename}</td><td>${rate}</td></tr>`);
    appendedLogs.push($newTableRow);
    $('#log table').append($newTableRow);

    if(errCount > 0){
        errCountMsg = ', Error: ' + errCount;
    }else{
        errCountMsg = '';
    }
    if(len == i+1){
        $('#icon').html(done);
    }
    $('#info').html(Math.round((id/len)*100).toString() + '%' + errCountMsg);
}

/**
 * Convert filename which is longer than len to ...filename
 * @param {string} filename 
 * @param {number} len 
 */
function formatFilename(filename, len){
    if(filename.length > len){
        filename = '...' + filename.substring(filename.length-len,filename.length);
    }
    return filename;
}

/**
 * Get file size in bytes
 * @param {string} filePath
 * @see https://techoverflow.net/2012/09/16/how-to-get-filesize-in-node-js/
 */
function fileSize(filePath){
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    return fileSizeInBytes;
}

/**
 * Get shrink rate (percentage reduced)
 * @param {object} pth 
 */
function shrinkRate(pth){
    let rate = 1-(fileSize(pth.out)/fileSize(pth.in));
    if(rate < 0){
        rate = 0;
    }
    return Math.round(rate*100).toString() + '%';
}

/**
 * -------------------
 *  Execution
 * -------------------
 */
init();
addEvents();