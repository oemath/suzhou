/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />
var SVG_VERTICAL_CHAR_WIDTH = 32;
var SVG_VERTICAL_CHAR_HEIGHT = 44; // 40 will cause the inputing digit is higher
/*enum ProblemType {
    Normal = 0,             => 0
    Literal = 1,            => 0
    Function = 2,           => 2
    Radio = 3,              => 4
    TrueFalse = 4,          => 5
    Checkbox = 5,           => 6
    Inline = 6,             => 1
    InlineLiteral = 7,
    InlineFunction = 8,
    Customized = 9,
    CustomizedFunction = 10
}*/
var ProblemType;
(function (ProblemType) {
    ProblemType[ProblemType["Normal"] = 0] = "Normal";
    ProblemType[ProblemType["Inline"] = 1] = "Inline";
    ProblemType[ProblemType["Function"] = 2] = "Function";
    ProblemType[ProblemType["InlineFunction"] = 3] = "InlineFunction";
    ProblemType[ProblemType["Radio"] = 4] = "Radio";
    ProblemType[ProblemType["TrueFalse"] = 5] = "TrueFalse";
    ProblemType[ProblemType["Checkbox"] = 6] = "Checkbox";
    ProblemType[ProblemType["Customized"] = 7] = "Customized";
})(ProblemType || (ProblemType = {}));
var ProblemLevel;
(function (ProblemLevel) {
    ProblemLevel[ProblemLevel["Easiest"] = 1] = "Easiest";
    ProblemLevel[ProblemLevel["Easy"] = 2] = "Easy";
    ProblemLevel[ProblemLevel["Normal"] = 3] = "Normal";
    ProblemLevel[ProblemLevel["Hard"] = 4] = "Hard";
    ProblemLevel[ProblemLevel["Hardest"] = 5] = "Hardest";
})(ProblemLevel || (ProblemLevel = {}));
var Answer;
(function (Answer) {
    Answer[Answer["Correct"] = 0] = "Correct";
    Answer[Answer["Wrong"] = 1] = "Wrong";
    Answer[Answer["Incomplete"] = 2] = "Incomplete";
})(Answer || (Answer = {}));
var SvgCircle = (function () {
    function SvgCircle(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
    return SvgCircle;
}());
var Point = (function () {
    function Point(x, y, polar) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (polar === void 0) { polar = false; }
        this.x = x;
        this.y = y;
        this.polar = polar;
    }
    return Point;
}());
var Problem = (function () {
    function Problem(prob, index) {
        this.abbrs = {
            'bbans': '<br><br><ans>',
            'bbcenter': '<br><br><center>',
            'ospan': '<span style="text-decoration:overline">',
            'bb': '<br><br>',
            'rf': '  <b>Express your answer as a reduced fraction.</b>',
            'dec': '  <b>Express your answer to the nearest integer.</b>',
            'dec1': '  <b>Express your answer as a decimal to the nearest tenth.</b>',
            'dec2': '  <b>Express your answer as a decimal to the nearest hundredth.</b>',
            'dec3': '  <b>Express your answer as a decimal to the nearest thousandth.</b>',
            'per': '  <b>Express your answer to the nearest whole percent.</b>',
            'per1': '  <b>Express your answer to the nearest tenth of a percent.</b>',
            'per2': '  <b>Express your answer to the nearest hundredth of a percent.</b>',
            'sci': '  <b>Express your answer in scientific notation.</b>',
        };
        this.index = index;
        this.type = prob.type;
        this.level = prob.level;
        this.question = prob.question;
        this.parameter = prob.parameter;
        this.knowledge = prob.knowledge;
        this.hint = prob.hint;
        this.flag = prob.flag;
        this.inputCount = 0;
        this.value_map = {};
        this.status = Answer.Incomplete;
        this.reportStatus = Answer.Incomplete;
    }
    Problem.prototype.splitParameter = function () {
        return this.parameter.trim().split('$$');
    };
    Problem.prototype.replaceKnownParameters = function (str) {
        if (str == null)
            return null;
        $.each(this.value_map, function (k, v) {
            str = str.replace(new RegExp(k, "g"), v);
        });
        return str;
    };
    // use wrapper to avoid being modified by eval()
    Problem.prototype.eval = function (exp) {
        try {
            return eval(exp);
        }
        catch (e) {
        }
    };
    Problem.prototype.evalLiteral = function (entered, expected) {
        entered = entered.replace(/\s/g, '').toLowerCase();
        var candidates = expected.split(';;');
        for (var i = 0; i < candidates.length; i++) {
            candidates[i] = candidates[i].replace(/\s/g, '').toLowerCase();
            if (candidates[i].length > 0 && entered == candidates[i]) {
                return true;
            }
        }
        return false;
    };
    /////////////////////////////////////////////////
    // Parse parameters - Start
    /////////////////////////////////////////////////
    Problem.prototype.generateValue = function (parameter) {
        if (parameter.indexOf('-') > 0) {
            var range = parameter.trim().split('-');
            var first = this.eval(range[0]);
            var last = this.eval(range[1]);
            return first + oe.rand(last - first + 1);
        }
        else {
            var enum_list = parameter.split(',');
            return this.eval(enum_list[oe.rand(enum_list.length)]);
        }
    };
    Problem.prototype.evalRandom = function (parameter) {
        while (true) {
            var start = parameter.indexOf('{{');
            if (start < 0)
                break;
            var end = parameter.indexOf('}}', start + 2);
            var rand_result = this.generateValue(parameter.substr(start + 2, end - start - 2));
            parameter = parameter.substr(0, start) + rand_result + parameter.substr(end + 2);
        }
        return parameter;
    };
    Problem.prototype.parseParameterMap = function () {
        var parameter_list = this.splitParameter();
        for (var _i = 0, parameter_list_1 = parameter_list; _i < parameter_list_1.length; _i++) {
            var parameter = parameter_list_1[_i];
            var name_1 = 'ans';
            var value = parameter.trim();
            var eql = parameter.indexOf('=');
            if (eql >= 0) {
                name_1 = parameter.substr(0, eql).trim();
                value = parameter.substr(eql + 1).trim();
            }
            value = this.replaceKnownParameters(value).replace(/[\r\n]/g, '');
            value = this.evalRandom(value);
            if (!(name_1 == 'ans' && (this.type == ProblemType.Function ||
                this.type == ProblemType.InlineFunction ||
                this.type == ProblemType.TrueFalse ||
                this.type == ProblemType.Radio ||
                this.type == ProblemType.Checkbox))) {
                value = "" + this.eval(value);
            }
            this.value_map[("<" + name_1 + ">")] = value;
        }
        if (!this.value_map["<ans>"]) {
            this.value_map["<ans>"] = '0';
        }
        return true;
    };
    /////////////////////////////////////////////////
    // Parse parameters - End
    /////////////////////////////////////////////////
    Problem.prototype.parseProperty = function (str, filter, ch) {
        if (ch === void 0) { ch = '='; }
        var prop;
        prop['fill'] = 'white';
        prop['stroke'] = 'black';
        prop['stroke-width'] = '1';
        if (str) {
            var p = str.split('&');
            for (var i = 0; i < p.length; i++) {
                var kv = p[i].split('=');
                if (kv.length <= 1) {
                    kv = p[i].split(':');
                }
                if (kv.length <= 1) {
                    prop["value"] = kv[0];
                }
                else if (!filter || filter(kv[0], kv[1])) {
                    prop[kv[0]] = kv[1];
                }
            }
        }
        return prop;
    };
    Problem.prototype.parsePropertyString = function (str, filter, ch) {
        if (ch === void 0) { ch = '='; }
        ch = typeof ch !== 'undefined' ? ch : '=';
        var prop_map = this.parseProperty(str, filter, ch);
        var prop_str = ' ';
        $.each(prop_map, function (k, v) {
            prop_str += "" + k + ch + "\"" + v + "\"";
        });
        return prop_str;
    };
    //polar coordination to cart coordination
    Problem.prototype.polar2Cart = function (centerX, centerY, radius, angleInDegrees) {
        var x = this.eval(centerX);
        var y = this.eval(centerY);
        var r = this.eval(radius);
        var a = (360.0 - this.eval(angleInDegrees)) * Math.PI / 180.0;
        return new Point(x + (r * Math.cos(a)), y + (r * Math.sin(a)), true);
    };
    Problem.prototype.parsePosition = function (circles, str) {
        var start = str.indexOf('(');
        var end = str.indexOf(')');
        if (start == 0) {
            var xy = str.substring(start + 1, end).split(',');
            if (xy.length == 2) {
                return new Point(this.eval(xy[0]), this.eval(xy[1]));
            }
            else {
                return this.polar2Cart(xy[0], xy[1], xy[2], xy[3]);
            }
        }
        else if (start > 0) {
            var cr = circles[str.substr(0, start)];
            var c = this.polar2Cart(cr.x, cr.y, cr.r, str.substring(start + 1, end));
        }
        else {
            var cr = circles[str];
            return new Point(cr.x, cr.y);
        }
    };
    Problem.prototype.getPropertyNumber = function (str, key, def_value) {
        if (str === void 0) { str = ''; }
        if (key === void 0) { key = ''; }
        var vals = str.trim().split('=');
        if (vals.length == 2 && vals[0].trim() == key) {
            try {
                return this.eval(vals[1]);
            }
            catch (e) { }
        }
        return def_value;
    };
    Problem.prototype.vertical = function (fml, hints, prob_index, input_numbers) {
        var hint_index = 0;
        var gx = SVG_VERTICAL_CHAR_WIDTH;
        var gy = SVG_VERTICAL_CHAR_HEIGHT;
        var lh = 10;
        var height = 0;
        var width = 0;
        for (var i = 0; i < fml.length; i++) {
            var s = fml[i];
            height += ((s[0] == '_' || s[0] == '|') ? lh : gy);
            var w = s.length;
            width = Math.max(width, s.length);
        }
        width *= gx;
        var y = 0;
        var svg = '<svg width=' + (4 + width) + ' height=' + (4 + height) + ' class="oemath-svg-vertical"><g transform="translate(2,2)">';
        var vertical_inputs = '<foreignObject x=0 y=0 width=' + width + ' height=' + height + '>';
        for (var i = 0; i < fml.length; i++) {
            var s = fml[i];
            var w = s.length;
            if (s[0] == '_') {
                y += 2;
                var x1 = width - w * gx - gx / 4;
                svg += '<line x1=' + x1 + ' y1=' + y + ' x2=' + width + ' y2=' + y + ' />';
                y += (lh - 2);
            }
            else if (s[0] == '|') {
                y += 2;
                var x1 = width - (w - 1) * gx - gx / 4;
                svg += '<line x1=' + x1 + ' y1=' + y + ' x2=' + width + ' y2=' + y + ' />';
                svg += '<path d="M ' + x1 + ',' + y + ' a ' + gx / 2 + ' ' + (gy * 5 / 4) + ' 0 0 1 ' + (-gx / 2) + ',' + (gy * 6 / 5) + '" />';
                y += (lh - 2);
            }
            else {
                var x = width - gx * w + gx / 2;
                for (var j = 0; j < w; j++) {
                    var c = s.charAt(j);
                    if ((0 <= c && c <= 9) || c == '+' || c == '-' || c == 'x') {
                        vertical_inputs += "<input index=\"" + (this.inputCount++) + "\" readonly value=\"" + c + "\" type=\"text\" style=\"left:" + (x - gx / 2) + "px;top:" + (y - 2) + "px\" oninput=\"onInputChange(this)\"/>"; //'<text x='+x+' y='+y+'>'+c+'</text>';
                    }
                    else {
                        ++input_numbers;
                        vertical_inputs += "<input index=\"" + (this.inputCount++) + "\" type=\"text\" id=\"oemath-input-field-" + prob_index + "-" + input_numbers + "\" style=\"left:" + (x - gx / 2) + "px;top:" + (y - 2) + "px\" hint=\"" + hints[hint_index++] + "\" placeholder=\"" + c + "\"/>";
                    }
                    x += gx;
                }
                y += gy;
            }
        }
        vertical_inputs += '</foreignObject>';
        svg += vertical_inputs + '</g></svg>';
        return { problem: svg, inputs: input_numbers };
    };
    Problem.prototype.replaceVertical = function (prob, prob_index, input_numbers) {
        var inputs = input_numbers;
        prob = prob.replace(/\s*<\s*oemath-vertical\s+\(([^\)]+)\)\s+\(([^\)]+)\)\s*>/g, (function (thisObj) {
            return function (m, $1, $2) {
                var desc_inputs = thisObj.vertical(thisObj.eval($1), thisObj.eval($2), prob_index, input_numbers);
                inputs = desc_inputs.inputs;
                return desc_inputs.problem;
            };
        })(this));
        return { problem: prob, inputs: inputs };
    };
    Problem.prototype.replaceOemathTags = function (question) {
        if (question == null)
            return null;
        //<canvas#(<w>,<h>)></canvas>
        question = question.replace(/<\s*canvas(\d*)\s*\(\s*(\d+)\s*,\s*(\d+)\)\s*>(.*?)<\s*\/canvas\s*>/g, function (m, $1, $2, $3, $4) {
            var cw = parseInt($2) + 100;
            var ch = parseInt($3) + 100;
            return "<div id='oemath-canvas-div" + $1 + "' style='position:relative;width:" + cw + "px;height:" + ch + "px'><canvas id='oemath-canvas" + $1 + "' width='" + cw + "' height='" + ch + "'>" + $4 + "</canvas></div>";
        });
        //<canvas#(<w>,<h>)></canvas>
        question = question.replace(/<\s*center-canvas(\d*)\s*\(\s*(\d+)\s*,\s*(\d+)\)\s*>(.*?)<\s*\/canvas\s*>/g, function (m, $1, $2, $3, $4) {
            var cw = parseInt($2) + 100;
            var ch = parseInt($3) + 100;
            return "<div id='oemath-canvas-div" + $1 + "' style='display:block;margin:auto;position:relative;width:" + cw + "px;height:" + ch + "px'><canvas id='oemath-canvas" + $1 + "' width='" + cw + "' height='" + ch + "'>" + $4 + "</canvas></div>";
        });
        //<script-canvas#>
        question = question.replace(/<\s*script-canvas(\d*)\s*>/g, function (m, $1) {
            return "<script>var ctx = document.getElementById('oemath-canvas" + $1 + "').getContext('2d'); ctx.lineWidth = 1; ctx.strokeStyle = '#000000'; ctx.fillStyle = 'rgba(128,128,128,1)'; ctx.font = '20px Arial'; ctx.translate(50,50);";
        });
        //<input[#](expected[,placeholder,width,x,y])>
        /* define css style for class: oemathclass-inline-input
        .oemath - input - inline
        {
            border: 1px solid;
            padding: 0px;
            text - align: center;
            font - size:24px;
            background - color:rgba(0, 0, 0, 0);
        }*/
        // Introduce another scope to capture "this"
        question = question.replace(/\s*<\s*input(\d*?)\s*\(\s*([^,]+)\s*,?\s*([^,]?)\s*,?\s*(\d*)\s*,?\s*(\d*)\s*,?\s*(\d*)\s*\)\s*>/g, (function (thisObj) {
            return function (m, id, expected, placeholder, w, x, y) {
                var rtn = "<input index=\"" + (thisObj.inputCount++) + "\" type=\"text\" class='oemathclass-inline-input oemathclass-input' id='oemathid-input-" + (id == '' ? '0' : id) + "' oninput=\"onInputChange(this)\"";
                if (placeholder != '')
                    rtn += " placeholder='" + placeholder + "'";
                if (w != '' || x != '' || y != '') {
                    rtn += " style='";
                    if (w != '') {
                        rtn += "width:" + w + "px;";
                    }
                    if (x != '' || y != '') {
                        rtn += 'position:absolute;';
                    }
                    if (x != '') {
                        rtn += "left:" + x + "px;";
                    }
                    if (y != '') {
                        rtn += "top:" + y + "px;";
                    }
                    rtn += "'";
                }
                if (expected != '')
                    rtn += " expected='" + expected + "'";
                rtn += "/>";
                return rtn;
            };
        })(this));
        return question;
    };
    Problem.prototype.processAnswerType = function () {
        if (this.type != ProblemType.TrueFalse && this.type != ProblemType.Radio && this.type != ProblemType.Checkbox)
            return;
        var answer = this.value_map['<ans>'];
        var answer_html = "<form class=\"oemathclass-question-form oemathclass-input\" id=\"oemathid-question-form\" index=\"" + (this.inputCount++) + "\" onchange=\"onInputChange(this)\">";
        if (this.type == ProblemType.TrueFalse) {
            var value = this.eval(answer) ? 1 : 0;
            [value, 1 - value].forEach(function (expected, idx, array) {
                answer_html += ("<div expected='" + expected + "'><input type='radio' choiceindex='" + idx + "' name='oemath-question-radio' id='oemath-choice-" + idx + "' class='oemathclass-question-choice' expected='" + expected + "'>") +
                    ("<label for='oemath-choice-" + idx + "' class='oemathclass-question-choice-label'>" + ['True', 'False'][idx] + "</label></div >");
            });
        }
        else if (this.type == ProblemType.Radio) {
            var options = answer.split(';;');
            var index_1 = new Array(options.length);
            var maxRandom = 0;
            var fixed = new Array(options.length);
            var maxFixed = -1;
            for (var i = 0; i < options.length; i++) {
                var off = options[i].search(/^\s*##/);
                if (off != -1) {
                    var j = 0;
                    if (options[i].length > (off + 2) && '0' <= options[i][off + 2] && options[i][off + 2] <= '9') {
                        j = parseInt(options[i][off + 2]);
                        ++off;
                    }
                    if (j < options.length) {
                        fixed[j] = i;
                        maxFixed = maxFixed > j ? maxFixed : j;
                        options[i] = options[i].substr(off + 2).trim();
                        continue;
                    }
                }
                index_1[maxRandom++] = i;
            }
            oe.shuffle(index_1, maxRandom);
            for (var i = maxFixed; i >= 0; i--) {
                index_1[maxRandom++] = fixed[i];
            }
            for (var idx = 0; idx < index_1.length; idx++) {
                var i = index_1[idx];
                var expected = i == 0 ? 1 : 0;
                answer_html += ("<div expected='" + expected + "'><input type='radio' choiceindex='" + idx + "' name='oemath-question-radio' id='oemath-choice-" + i + "' class='oemathclass-question-choice' expected='" + expected + "'>") +
                    ("<label for='oemath-choice-" + i + "' class='oemathclass-question-choice-label'>" + options[i].trim() + "</label></div >");
            }
        }
        else if (this.type == ProblemType.Checkbox) {
            var options = answer.split(';;');
            var corrects = parseInt(options[0]);
            var index_2 = new Array(options.length - 1);
            var maxRandom = 0;
            var fixed = new Array(options.length - 1);
            var maxFixed = -1;
            //            for (var i = 1; i < options.length; i++) index[i-1] = i-1;
            for (var i = 1; i < options.length; i++) {
                var off = options[i].search(/^\s*##/);
                if (off != -1) {
                    var j = 0;
                    if (options[i].length > (off + 2) && '0' <= options[i][off + 2] && options[i][off + 2] <= '9') {
                        j = parseInt(options[i][off + 2]);
                        ++off;
                    }
                    if (j < options.length) {
                        fixed[j] = i - 1;
                        maxFixed = maxFixed > j ? maxFixed : j;
                        options[i] = options[i].substr(off + 2).trim();
                        continue;
                    }
                }
                index_2[maxRandom++] = i - 1;
            }
            oe.shuffle(index_2, maxRandom);
            for (var i = maxFixed; i >= 0; i--) {
                index_2[maxRandom++] = fixed[i];
            }
            for (var idx = 0; idx < index_2.length; idx++) {
                var i = index_2[idx];
                var expected = i < corrects ? 1 : 0;
                answer_html += ("<div expected='" + expected + "'><input type='checkbox' choiceindex='" + idx + "' name='oemath-question-checkbox' id='oemath-choice-" + i + "' class='oemathclass-question-choice' expected='" + expected + "'>") +
                    ("<label for='oemath-choice-" + i + "' class='oemathclass-question-choice-label'>" + options[i + 1].trim() + "</label></div >");
            }
        }
        answer_html += "<\/form>";
        this.value_map['<ans>'] = answer_html;
    };
    Problem.prototype.checkIncomplete = function () {
        var inputElems = $('input[index],form[index]');
        for (var i = 0; i < inputElems.length; i++) {
            var inputElem = inputElems[i];
            if (inputElem.style.visibility != 'hidden') {
                var tag = inputElem.tagName.toUpperCase();
                if (tag == 'FORM') {
                    var checked = $("#" + inputElem.getAttribute('id') + " .oemathclass-question-choice:checked");
                    if (checked.length == 0) {
                        return false;
                    }
                }
                else if (tag == 'INPUT') {
                    if (inputElem.value.trim().length == 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    Problem.prototype.checkAnswer = function () {
        if (!this.checkIncomplete())
            return Answer.Incomplete;
        var correct = true;
        var answer_entered;
        var answer_expected;
        switch (this.type) {
            case ProblemType.TrueFalse:
            case ProblemType.Radio:
            case ProblemType.Checkbox:
                var entered_1 = false;
                $('.oemathclass-question-choice').each(function (index) {
                    var expected = $(this).attr('expected');
                    var checked = $(this).is(':checked');
                    if (checked)
                        entered_1 = true;
                    if ((expected == '1' && !checked) || (expected == '0' && checked)) {
                        correct = false;
                    }
                });
                if (!entered_1)
                    return Answer.Incomplete;
                break;
            case ProblemType.Normal:
            case ProblemType.Inline:
            case ProblemType.Function:
            case ProblemType.InlineFunction:
                {
                    var inputElems = $('#oemathid-practice-question input[index]');
                    for (var i = 0; i < inputElems.length; i++) {
                        var inputElem = inputElems[i];
                        if (inputElem.style.visibility != 'hidden') {
                            answer_entered = inputElem.value.trim();
                            if (answer_entered.length == 0) {
                                return Answer.Incomplete;
                            }
                        }
                    }
                    if (this.type == ProblemType.Normal) {
                        answer_entered = $("#oemathid-answer-input-0").val().trim();
                        correct = this.evalLiteral("" + answer_entered, "" + this.value_map['<ans>']) ? true : false;
                    }
                    else if (this.type == ProblemType.Function) {
                        var expression = 'var i0 = ' + $("#oemathid-answer-input-0").val().trim() + "; var ans=i0; ";
                        expression += "" + this.value_map['<ans>'];
                        correct = this.eval(expression) ? true : false;
                    }
                    else if (this.type == ProblemType.Inline) {
                        for (var i = 0; i < inputElems.length; i++) {
                            var inputElem = inputElems[i];
                            if (inputElem.style.visibility != 'hidden') {
                                answer_entered = inputElem.value;
                                answer_expected = inputElem.getAttribute("expected").trim();
                                if (answer_entered != answer_expected) {
                                    correct = false;
                                    break;
                                }
                            }
                        }
                    }
                    else if (this.type == ProblemType.InlineFunction) {
                        var expression = "";
                        for (var i = 0; i < inputElems.length; i++) {
                            var inputElem = inputElems[i];
                            var idx = parseInt(inputElem.getAttribute('index'));
                            expression += ("var i" + idx + " = ") + practice.problem().entered[i] + "; ";
                        }
                        expression += "" + this.value_map['<ans>'];
                        correct = this.eval(expression) ? true : false;
                    }
                }
                break;
        }
        this.status = correct ? Answer.Correct : Answer.Wrong;
        if (this.reportStatus != Answer.Wrong) {
            this.reportStatus = this.status;
        }
        if (!correct) {
            this.entered_wrong = this.entered.slice(0);
        }
        return this.status;
    };
    Problem.prototype.generateHint = function (h, idx) {
        var hints = h.split('$$');
        var html = "<div id='#oemathid-hinttab-" + idx + "'><p>" + hints[0] + "</p>";
        for (var i = 1; i < hints.length; i++) {
            html += "<div style=\"display:none\" id=\"hint" + idx + "-" + i + "\"><hr><p>" + hints[i] + "</p></div>";
        }
        if (hints.length > 1) {
            html += "<a style=\"cursor:pointer\" onclick= \"onClickMoreHints(" + idx + ")\" id= 'oemathid-hintbtn" + idx + "' status= 0 last=" + (hints.length - 1) + " >Show more details</a>";
        }
        html += "</div>";
        return html;
    };
    Problem.prototype.generateHintHtml = function () {
        if (!this.hint)
            return;
        var mul_hints = this.hint.split('$$$');
        this.htmlHint =
            "<div class=\"modal\" id=\"oemathid-hintsModal\" role=\"dialog\"><div class=\"modal-dialog\" id=\"oemathid-hintmodal\"><div class=\"modal-content\">";
        if (mul_hints.length == 1) {
            this.htmlHint += "<div class=\"modal-header\"><h4 class=\"modal-title\">Hint</h4></div >            <div class=\"modal-body\">" + this.generateHint(mul_hints[0], 0);
        }
        else {
            this.htmlHint += "<div class=\"modal-body\"><div class=\"container\" style=\"min-height:300px\"><div id=\"oemathid-hintmodal-tabcontent\"><ul id=\"oemathid-hint-tabs\" class=\"nav nav-tabs\" data-tabs=\"tabs\"><li class=\"active\"><a href=\"#oemathid-hinttab-0\" data-toggle=\"tab\">Hint 1</a></li>";
            for (var i = 1; i < mul_hints.length; i++) {
                this.htmlHint += "<li><a href=\"#oemathid-hinttab-" + i + "\" data-toggle=\"tab\">Hint " + (i + 1) + "</a></li>";
            }
            this.htmlHint += "</ul><div class=\"tab-content\" id=\"oemathid-hintmodal-body\"><div class=\"tab-pane active\" id=\"oemathid-hinttab-0\">" + this.generateHint(mul_hints[0], 0) + "</div>";
            for (var i = 1; i < mul_hints.length; i++) {
                this.htmlHint += "<div class=\"tab-pane\" id=\"oemathid-hinttab-" + i + "\">" + this.generateHint(mul_hints[i], i) + "</div>";
            }
            this.htmlHint += "</div></div></div>";
        }
        this.htmlHint +=
            "</div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button></div></div></div></div>";
        /*
        let hints: string[] = this.hint.split('$$');

        this.htmlHint =
`<div class="modal" id="oemathid-hintsModal" role="dialog"><div class="modal-dialog">\
<div class="modal-content">\
<div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button>\
<h4 class="modal-title">Hints</h4></div>\
<div class="modal-body oemathclass-hintmodal">\
<div><p>${hints[0]}</p>`;
        for (let i: number = 1; i < hints.length; i++) {
            this.htmlHint += `<div style="display:none" id="hint${i}"><hr><p>${hints[i]}</p></div>`;
        }

        if (hints.length > 1) {
            this.htmlHint += `<a style="cursor:pointer" onclick= "onClickMoreHints()" id= 'oemathid-hintbtn' status= 0 last=${hints.length-1} >Show more hints</a>`;
        }

        this.htmlHint +=
`</div></div><div class="modal-footer">\
<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
</div></div></div></div>`;*/
    };
    Problem.prototype.generateHtmls = function () {
        this.htmlBase =
            "<div id=\"oemathid-question-html\"><hr/><div class=\"oemathclass-practice-title\" style=\"height:60px;\"><span style=\"display:inline-block;float:left;font-size:36px;\">Question</span>";
        if (this.hint) {
            this.htmlBase +=
                "<input type=\"image\" data-toggle=\"modal\" data-target=\"#oemathid-hintsModal\" style=\"display:inline-block;float:right;outline:none\" border=\"0\" title=\"Need some hint?\" alt=\"hint\" src=\"/img/hint.png\" width=\"32\" height=\"32\">";
        }
        this.htmlBase +=
            "</div><div id=\"oemathid-practice-question\" class=\"oemathclass-practice-question " + (this.flag == 1 ? "oemathclass-mathjax" : "") + "\">" + this.question + "</div><div class=\"form-inline\" style=\"width:100%\">";
        this.htmlSubmit = "<button id=\"oemathid-practice-submit\" class=\"oemathclass-practice-button oemathclass-button btn\" onclick=\"onclickSubmit()\">Submit</button>";
        this.htmlShowAnswer = "<button id=\"oemathid-practice-show-answer\" class=\"oemathclass-practice-button oemathclass-button btn width200\" onclick=\"onclickShowAnswer()\">Show Correct Answer</button>";
        if (this.type == ProblemType.Normal || this.type == ProblemType.Function) {
            var answerHint = this.value_map['<ans_hint>'];
            if (!answerHint)
                answerHint = this.value_map['<ans>'];
            this.htmlAnswer =
                "<input index=\"" + (this.inputCount++) + "\" id=\"oemathid-answer-input-0\" type=\"text\" class=\"form-control oemathclass-answer-input oemathclass-input\" expected='" + answerHint + "' oninput=\"onInputChange(this)\">";
        }
        else {
            this.htmlAnswer = "";
        }
        this.htmlSkip = "<button id=\"oemathid-practice-skip\" class=\"oemathclass-practice-button oemathclass-button btn oemathclass-right\" onclick=\"onclickSkip()\">Skip</button>";
        this.htmlStartReview = "<button id=\"oemathid-practice-start-review\" class=\"oemathclass-practice-button oemathclass-button btn oemathclass-right\" onclick=\"onclickStartReview()\">Start Review</button>";
        this.htmlFinishReview = "<button id=\"oemathid-practice-finish-review\" class=\"oemathclass-practice-button oemathclass-button btn oemathclass-right\" onclick=\"onclickFinishReview()\">Finish Review</button>";
        this.htmlClosing = "</div>";
        this.generateHintHtml();
    };
    Problem.prototype.fillEntered = function (entered) {
        $('.oemathclass-input').each((function (entered) {
            return function (index) {
                var i = parseInt($(this).attr('index'));
                if ("FORM" == $(this).prop('tagName').toUpperCase()) {
                    $("#" + $(this).attr('id') + " input.oemathclass-question-choice").prop('checked', false);
                    if (entered[i] != null) {
                        var checked = entered[i].split(',');
                        for (var j = 0; j < checked.length; j++) {
                            $("#" + $(this).attr('id') + " input[choiceindex=" + checked[j] + "]").prop('checked', true);
                        }
                    }
                }
                else if ("INPUT" == $(this).prop('tagName').toUpperCase()) {
                    $(this).val(entered[i] ? entered[i] : '');
                }
            };
        })(entered));
    };
    Problem.prototype.appendTo = function (id, phase) {
        var html = this.htmlBase;
        if (phase == Phase.Practice) {
            html += this.htmlSubmit;
            html += this.htmlAnswer;
            html += this.htmlStartReview;
            html += this.htmlSkip;
            html += this.htmlHint;
        }
        else if (phase == Phase.Review) {
            html += this.htmlShowAnswer;
            html += this.htmlAnswer;
            html += this.htmlFinishReview;
            html += this.htmlHint;
        }
        html += this.htmlClosing;
        //html = "<p id='xxxtestxxx'>HELLO!!!</p>" + html;
        $(id).empty().append(html);
        /*    if (MathJax) {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, ".oemathclass-mathjax"], function () { $('.oemathclass-mathjax').css("visibility", "visible"); });
            }*/
        this.fillEntered(this.entered);
        if (phase == Phase.Practice) {
            $(id + " input[index=0]").focus();
        }
        else if (phase == Phase.Review) {
            $("#oemathid-question-html .oemathclass-input").prop("disabled", true);
            $(".oemathclass-question-form input").prop("disabled", true);
        }
        //        $("#xxxtestxxx").text("Hello, world!!");
    };
    Problem.prototype.preprocess = function () {
        var question = this.question;
        var parameter = this.parameter;
        var hint = this.hint;
        // replace reservered keyword <.xxx> in question and hint
        $.each(this.abbrs, function (k, v) {
            if (question != null) {
                question = question.replace(new RegExp("<." + k + ">", "g"), v);
            }
            if (parameter != null) {
                parameter = parameter.replace(new RegExp("<." + k + ">", "g"), v);
            }
            if (hint != null) {
                hint = hint.replace(new RegExp("<." + k + ">", "g"), v);
            }
        });
        this.question = question;
        this.parameter = parameter;
        this.hint = hint;
    };
    Problem.prototype.process = function () {
        this.preprocess(); // replace abbr. like <.bb> in question, parameter and hint.
        this.parseParameterMap();
        this.parameter = this.replaceKnownParameters(this.parameter);
        this.parameter = this.replaceOemathTags(this.parameter);
        this.processAnswerType();
        this.question = this.replaceKnownParameters(this.question);
        this.question = this.replaceOemathTags(this.question);
        this.hint = this.replaceKnownParameters(this.hint);
        this.hint = this.replaceOemathTags(this.hint);
        this.generateHtmls();
        this.entered = new Array(this.inputCount);
        this.entered_wrong = null;
        return true;
    };
    return Problem;
}());
function onclickSubmit() { practice.onclickSubmit(); }
function onclickSkip() { practice.onclickSkip(); }
function onclickStartReview() { practice.onclickStartReview(); }
function onclickFinishReview() { practice.onclickFinishReview(); }
function onclickShowAnswer() {
    var problem = practice.problem();
    var btn = $('#oemathid-practice-show-answer');
    var correct = "Show Correct Answer";
    var yours = "Show Your Answer";
    if (btn.text() == correct) {
        btn.text(yours);
        $('.oemathclass-input').each(function (index) {
            if ("FORM" == $(this).prop('tagName').toUpperCase()) {
                $("#" + $(this).attr('id') + " input.oemathclass-question-choice").each(function (index) {
                    $(this).prop('checked', $(this).attr('expected') == '1' ? true : false);
                });
            }
            else if ("INPUT" == $(this).prop('tagName').toUpperCase()) {
                $(this).val($(this).attr('expected'));
            }
        });
    }
    else {
        btn.text(correct);
        problem.fillEntered(problem.entered_wrong ? problem.entered_wrong : problem.entered);
    }
}
function onClickMoreHints(idx) {
    var n = +$("#oemathid-hintbtn" + idx).attr('status');
    ++n;
    $("#hint" + idx + "-" + n).css('display', 'block');
    $("#oemathid-hintbtn" + idx).attr('status', n);
    if (n == +$("#oemathid-hintbtn" + idx).attr('last')) {
        $("#oemathid-hintbtn" + idx).css('display', 'none');
    }
}
function onInputChange(elem) {
    var content = '';
    if ("FORM" == elem.tagName.toUpperCase()) {
        var checked = $("#" + elem.getAttribute('id') + " .oemathclass-question-choice:checked");
        var checked_marks = [];
        for (var i = 0; i < checked.length; i++) {
            var element = checked[i];
            checked_marks.push(element.getAttribute('choiceindex'));
        }
        content += checked_marks.join(',');
        practice.problem().entered[parseInt(elem.getAttribute('index'))] = content;
    }
    else if ("INPUT" == elem.tagName.toUpperCase()) {
        content += elem.value;
        var problem_1 = practice.problem();
        problem_1.entered[parseInt(elem.getAttribute('index'))] = content;
        if (problem_1.type == ProblemType.Inline || problem_1.type == ProblemType.InlineFunction) {
            //$("#xxxtestxxx").text("changed c:" + content);
            //            var v = content;
            //          var ch = v.charAt(v.length - 1); // limit one digit in the input
            var ph = elem.getAttribute('placeholder');
            //$("#xxxtestxxx").text("changed p:" + ph);
            if (('A' <= ph && ph <= 'Z') || ('a' <= ph && ph <= 'z')) {
                //                $("#xxxtestxxx").text("changed d:" + ch);
                //                $('input.oemathclass-inline-input[placeholder="' + ph + '"]').val(ch);
                $('input.oemathclass-inline-input[placeholder="' + ph + '"]').each(function (index) {
                    $(this).val(content);
                    problem_1.entered[parseInt($(this).attr('index'))] = content;
                });
            }
        }
    }
}
//# sourceMappingURL=Problem.js.map