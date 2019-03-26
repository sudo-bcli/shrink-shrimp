/**
 * Locales
 * @author bcli, Mar.25 2019
 * @description currently we support English(en), Simplified Chinese(zh_cn) and Traditional Chinese (zh_tw)
 *              to add another language, please follow the language code bellow and export it here and import in the rednerer.js
 * @see https://www.w3schools.com/tags/ref_language_codes.asp
 */

// English
const en = {
    name:           "Shrink Shrimp",
    drop_pdf_here:  "Drop PDF Here",
    pdf_not_found:  "No PDF Files",
    error:          "Error",
    order:          "No.",
    filename:       "Filename",
    rate:           "Rate",
    reset:          "Reset"
};

// Simplified Chinese
const zh_cn = {
    name:           "虾压",
    drop_pdf_here:  "拖拽PDF至此",
    pdf_not_found:  "无PDF文件",
    error:          "错误",
    order:          "序号",
    filename:       "文件名",
    rate:           "比率",
    reset:          "重置"
};

// Tranditional Chinese
const zh_tw = {
    name:           "蝦壓",
    drop_pdf_here:  "拖拽PDF至此",
    pdf_not_found:  "無PDF文件",
    error:          "錯誤",
    order:          "序號",
    filename:       "文件名",
    rate:           "比率",
    reset:          "重置"
};

// export
module.exports = {en,zh_cn,zh_tw};