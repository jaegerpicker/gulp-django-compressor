/*jslint node: true */
'use strict';

var util = require('util');

var Block = function () {
    this.inUse = false;
    this.originals = [];
    this.replacements = [];
    this.keepUnassigned = false;
    this.indent = '';
    this.template = null;
};

Block.prototype.compile = function () {
    this.inUse = false;

    if (!this.replacements.length) {
        return this.keepUnassigned ? this.originals : [];
    }

    return this.replacements.map(function (replacement) {
        if (this.template) {
            return this.indent + util.format(this.template, replacement);
        }

        var file_name = replacement.name.split('.');
        var first_part = file_name.slice(0, file_name.length - 1);
        var ext = file_name.pop().toLowerCase();


        return this.indent + first_part.join('').replace('//css//', '//css//build//') + '.css';
    }.bind(this));
};

Block.prototype.reset = function(){
    this.originals = [];
    this.replacements = [];
    this.template = null;
};

Block.prototype.setTask = function(task) {
    this.reset();
    this.inUse = true;

    if(task) {
        this.replacements = task.src;
        this.template = task.tpl;
    }
};

module.exports = Block;
