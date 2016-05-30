/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />
var SVG_VERTICAL_CHAR_WIDTH = 32;
var SVG_VERTICAL_CHAR_HEIGHT = 44; // 40 will cause the inputing digit is higher
var ProblemType;
(function (ProblemType) {
    ProblemType[ProblemType["Normal"] = 0] = "Normal";
    ProblemType[ProblemType["Literal"] = 1] = "Literal";
    ProblemType[ProblemType["Function"] = 2] = "Function";
    ProblemType[ProblemType["Radio"] = 3] = "Radio";
    ProblemType[ProblemType["TrueFalse"] = 4] = "TrueFalse";
    ProblemType[ProblemType["Checkbox"] = 5] = "Checkbox";
    ProblemType[ProblemType["Inline"] = 6] = "Inline";
    ProblemType[ProblemType["InlineLiteral"] = 7] = "InlineLiteral";
    ProblemType[ProblemType["InlineFunction"] = 8] = "InlineFunction";
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
})();
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
})();
var Problem = (function () {
    function Problem(prob, index) {
        this.index = index;
        this.type = prob.type;
        this.level = prob.level;
        this.question = prob.question;
        this.parameter = prob.parameter;
        this.knowledge = prob.knowledge;
        this.hint = prob.hint;
        this.inputCount = 0;
        this.value_map = {};
        this.status = Answer.Incomplete;
        this.reportStatus = Answer.Incomplete;
    }
    Problem.prototype.splitParameter = function () {
        return this.parameter.trim().split('$$');
    };
    Problem.prototype.replaceKnownParameters = function (str) {
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
        for (var candidate in candidates) {
            candidate = candidate.replace(/\s/g, '').toLowerCase();
            if (candidate.length > 0 && entered == candidate) {
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
            return first + rand(last - first + 1);
        }
        else {
            var enum_list = parameter.split(',');
            return this.eval(enum_list[rand(enum_list.length)]);
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
        for (var _i = 0; _i < parameter_list.length; _i++) {
            var parameter = parameter_list[_i];
            var eql = parameter.indexOf('=');
            if (eql < 0)
                continue;
            var name_1 = parameter.substr(0, eql).trim();
            var value = parameter.substr(eql + 1).trim();
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
    Problem.prototype.replaceOemathTags = function (question, index) {
        //<canvas#(<w>,<h>)></canvas>
        question = question.replace(/<\s*canvas(\d*)\s*\(\s*(\d+)\s*,\s*(\d+)\)\s*>(.*?)<\s*\/canvas\s*>/g, function (m, $1, $2, $3, $4) {
            return "<div id='oemath-canvas-div" + $1 + "' style='position:relative;width:" + $2 + "px;height:" + $3 + "px'><canvas id='oemath-canvas" + $1 + "' width='" + $2 + "' height='" + $3 + "'>" + $4 + "<\/canvas><\/div>";
        });
        //<script-canvas#>
        question = question.replace(/<\s*script-canvas(\d*)\s*>/, function (m, $1) {
            return "<script>var ctx = document.getElementById('oemath-canvas" + $1 + "').getContext('2d');";
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
            for (var i = 0; i < options.length; i++)
                index_1[i] = i;
            shuffle(index_1);
            for (var idx = 0; idx < index_1.length; idx++) {
                var i_1 = index_1[idx];
                var expected = i_1 == 0 ? 1 : 0;
                answer_html += ("<div expected='" + expected + "'><input type='radio' choiceindex='" + idx + "' name='oemath-question-radio' id='oemath-choice-" + i_1 + "' class='oemathclass-question-choice' expected='" + expected + "'>") +
                    ("<label for='oemath-choice-" + i_1 + "' class='oemathclass-question-choice-label'>" + options[i_1].trim() + "</label></div >");
            }
        }
        else if (this.type == ProblemType.Checkbox) {
            var options = answer.split(';;');
            var corrects = parseInt(options[0]);
            var index_2 = new Array(options.length - 1);
            for (var i = 1; i < options.length; i++)
                index_2[i - 1] = i - 1;
            shuffle(index_2);
            for (var idx = 0; idx < index_2.length; idx++) {
                var i_2 = index_2[idx];
                var expected = i_2 < corrects ? 1 : 0;
                answer_html += ("<div expected='" + expected + "'><input type='checkbox' choiceindex='" + idx + "' name='oemath-question-checkbox' id='oemath-choice-" + i_2 + "' class='oemathclass-question-choice' expected='" + expected + "'>") +
                    ("<label for='oemath-choice-" + i_2 + "' class='oemathclass-question-choice-label'>" + options[i_2 + 1].trim() + "</label></div >");
            }
        }
        answer_html += "<\/form>";
        this.value_map['<ans>'] = answer_html;
    };
    Problem.prototype.checkAnswer = function () {
        var correct = true;
        var answer_entered;
        var answer_expected;
        switch (this.type) {
            case ProblemType.TrueFalse:
            case ProblemType.Radio:
            case ProblemType.Checkbox:
                var entered = false;
                $('.oemathclass-question-choice').each(function (index) {
                    var expected = $(this).attr('expected');
                    var checked = $(this).is(':checked');
                    if (checked)
                        entered = true;
                    if ((expected == '1' && !checked) || (expected == '0' && checked)) {
                        correct = false;
                    }
                });
                if (!entered)
                    return Answer.Incomplete;
                break;
            case ProblemType.Normal:
                answer_entered = $("#oemathid-answer-input-0").val().trim();
                if (answer_entered.length == 0) {
                    return Answer.Incomplete;
                }
                correct = this.eval("(" + answer_entered + ")==(" + this.value_map['<ans>'] + ")") ? true : false;
                break;
            case ProblemType.Literal:
                break;
            case ProblemType.Function:
            case ProblemType.Inline:
                var inputElems = $('#oemathid-practice-question .oemathclass-inline-input');
                for (var i = 0; i < inputElems.length; i++) {
                    var inputElem = inputElems[i];
                    answer_entered = inputElem.value.trim();
                    if (answer_entered.length == 0) {
                        return Answer.Incomplete;
                    }
                }
                for (var i = 0; i < inputElems.length; i++) {
                    var inputElem = inputElems[i];
                    answer_entered = inputElem.value;
                    answer_expected = inputElem.getAttribute("expected");
                    if (!this.eval("(" + answer_entered + ")==(" + answer_expected + ")")) {
                        correct = false;
                        break;
                    }
                }
                break;
            case ProblemType.InlineLiteral:
            case ProblemType.InlineFunction:
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
    Problem.prototype.generateHtmls = function () {
        this.htmlBase =
            "<div id=\"oemathid-question-html\"><hr/><h1 class=\"oemathclass-practice-title\">Question</h1><div class=\"oemathclass-practice-question\"><h3 id=\"oemathid-practice-question\" class=\"oemathclass-practice-question\">" + this.question + "</h3></div><hr/><div class=\"form-inline\">";
        if (this.type == ProblemType.Normal || this.type == ProblemType.Literal || this.type == ProblemType.Function) {
            var answerHint = this.value_map['<ans_hint>'];
            if (!answerHint)
                answerHint = this.value_map['<ans>'];
            this.htmlBase +=
                "<h1 class=\"oemathclass-answer-title\">Answer</h1><div class=\"form-inline\"><input index=\"" + (this.inputCount++) + "\" id=\"oemathid-answer-input-0\" type=\"text\" class=\"form-control oemathclass-answer-input oemathclass-input\" expected='" + answerHint + "' oninput=\"onInputChange(this)\">";
        }
        this.htmlSubmit = "<button id=\"oemathid-practice-submit\" class=\"oemathclass-practice-button\" onclick=\"onclickSubmit()\">Submit</button>";
        this.htmlShowAnswer = "<button id=\"oemathid-practice-show-answer\" class=\"oemathclass-practice-button\" onclick=\"onclickShowAnswer()\">Show Correct Answer</button>";
        this.htmlSkip = "<button id=\"oemathid-practice-skip\" class=\"oemathclass-practice-button\" onclick=\"onclickSkip()\">Skip</button>";
        this.htmlStartReview = "<button id=\"oemathid-practice-start-review\" class=\"oemathclass-practice-button\" onclick=\"onclickStartReview()\">Start Review</button>";
        this.htmlFinishReview = "<button id=\"oemathid-practice-finish-review\" class=\"oemathclass-practice-button\" onclick=\"onclickFinishReview()\">Finish Review</button>";
        this.htmlClosing = "</div>";
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
            html += this.htmlSkip;
            html += this.htmlStartReview;
        }
        else if (phase == Phase.Review) {
            html += this.htmlShowAnswer;
            html += this.htmlFinishReview;
        }
        html += this.htmlClosing;
        $(id).empty().append(html);
        this.fillEntered(this.entered);
        if (phase == Phase.Practice) {
            $(id + " input[index=0]").focus();
        }
        else if (phase == Phase.Review) {
            $("#oemathid-question-html .oemathclass-input").prop("disabled", true);
            $(".oemathclass-question-form input").prop("disabled", true);
        }
    };
    Problem.prototype.process = function () {
        this.parseParameterMap();
        this.parameter = this.replaceKnownParameters(this.parameter);
        this.parameter = this.replaceOemathTags(this.parameter, this.index);
        this.processAnswerType();
        this.question = this.replaceKnownParameters(this.question);
        this.question = this.replaceOemathTags(this.question, this.index);
        this.generateHtmls();
        this.entered = new Array(this.inputCount);
        this.entered_wrong = null;
        return true;
    };
    return Problem;
})();
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
    }
    else if ("INPUT" == elem.tagName.toUpperCase()) {
        content += elem.value;
    }
    practice.problem().entered[parseInt(elem.getAttribute('index'))] = content;
    console.log(elem.tagName + ":" + parseInt(elem.getAttribute('index')) + ":" + content);
}
//# sourceMappingURL=problem.js.map