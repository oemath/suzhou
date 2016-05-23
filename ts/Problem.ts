/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />

const DEFAULT_INPUT_RADIUS: number = 25;
const DEFAULT_INLINE_INPUT_WIDTH: number = 30;
const SVG_MARGIN: number= 2;
const SVG_VERTICAL_CHAR_WIDTH: number = 32;
const SVG_VERTICAL_CHAR_HEIGHT: number = 44; // 40 will cause the inputing digit is higher

enum ProblemType {
    Normal = 0,
    Literal = 1,
    Function = 2,
    Radio = 3,
    TrueFalse = 4,
    Checkbox = 5,
    Inline = 6,
    InlineLiteral = 7,
    InlineFunction = 8
}

enum ProblemLevel {
    Easiest = 1,
    Easy = 2,
    Normal = 3,
    Hard = 4,
    Hardest = 5
}

enum Answer {
    Correct = 0,
    Wrong = 1,
    Incomplete = 2
}

class SvgCircle {
    x: number;
    y: number;
    r: number;

    constructor(x: number, y: number, r: number) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
}

class Point {
    x: number;
    y: number;
    polar: boolean;

    constructor(x: number = 0, y: number = 0, polar: boolean = false) {
        this.x = x;
        this.y = y;
        this.polar = polar;
    }
}


class Problem {
    ///////////
    public type: ProblemType;
    public level: ProblemLevel;
    public question: string;
    public parameter: string;
    public knowledge: string;
    public hint: string;

    ///////////
    // derived
    ///////////
    public inputCount: number; // count of inputs.  Each <input> counts as 1, each form of radios, or checkboxes counts as 1.
                               // all input has a class "oemathclass-input", so it should be equal to $('.oemathclass-input').length
    public html: string;    // html to be appended
    public entered: string[];

    ///////////
    // helper
    ///////////
    private value_map: { [key:string]: string };

    public constructor(prob: any) {
        this.type = prob.type;
        this.level = prob.level;
        this.question = prob.question;
        this.parameter = prob.parameter;
        this.knowledge = prob.knowledge;
        this.hint = prob.hint;

        this.inputCount = 0;
        this.html = '';

        this.value_map = {};
    }

    private splitParameter(): string[] {
        return this.parameter.trim().split('$$');
    }

    private replaceKnownParameters(str: string): string {
        $.each(this.value_map, function (k, v) {
            str = str.replace(new RegExp(k, "g"), v);
        });
        return str;
    }

    // use wrapper to avoid being modified by eval()
    private eval(exp: string): number {
        try {
            return eval(exp);
        }
        catch (e) {
            // log eval error
        }
    }

    private evalLiteral(entered: string, expected: string): boolean {
        entered = entered.replace(/\s/g, '').toLowerCase();
        let candidates = expected.split(';;');
        for (let candidate in candidates) {
            candidate = candidate.replace(/\s/g, '').toLowerCase();
            if (candidate.length > 0 && entered == candidate) {
                return true;
            }
        }
        return false;
    }

    /////////////////////////////////////////////////
    // Parse parameters - Start
    /////////////////////////////////////////////////
    private generateValue(parameter : string) : number {
        if (parameter.indexOf('-') > 0) {
            let range = parameter.trim().split('-');
            let first = this.eval(range[0]);
            let last = this.eval(range[1]);
            return first + rand(last - first + 1);
        }
        else {
            let enum_list : string[] = parameter.split(',');
            return this.eval(enum_list[rand(enum_list.length)]);
        }
    }

    private evalRandom(parameter: string) : string {
        while (true) {
            var start = parameter.indexOf('{{');
            if (start < 0) break;

            var end = parameter.indexOf('}}', start + 2);
            var rand_result = this.generateValue(parameter.substr(start + 2, end - start - 2));
            parameter = parameter.substr(0, start) + rand_result + parameter.substr(end + 2);
        }

        return parameter;
    }

    private parseParameterMap(): boolean {
        let parameter_list: string[] = this.splitParameter();

        for (let parameter of parameter_list) {
            let eql = parameter.indexOf('=');
            if (eql < 0) continue;

            let name: string = parameter.substr(0, eql).trim();
            let value: string = parameter.substr(eql + 1).trim();
            value = this.replaceKnownParameters(value).replace(/[\r\n]/g, '');
            value = this.evalRandom(value);

            if (!(name == 'ans' && (this.type == ProblemType.Function || this.type == ProblemType.InlineFunction))) {
                value = this.eval(value).toString();
            }

            this.value_map[`<${name}>`] = value;
        }

        if (!this.value_map["<ans>"]) {
            this.value_map["<ans>"] = '0';
        }

        return true;
    }
    /////////////////////////////////////////////////
    // Parse parameters - End
    /////////////////////////////////////////////////

    private parseProperty(str: string, filter: (k: string, v: string) => boolean, ch: string = '='): { string: string } {
        let prop: { string: string };
        prop['fill'] = 'white';
        prop['stroke'] = 'black';
        prop['stroke-width'] = '1';
        if (str) {
            let p = str.split('&');
            for (let i = 0; i < p.length; i++) {
                let kv = p[i].split('=');
                if (kv.length <= 1) {
                    kv = p[i].split(':');
                }

                if (kv.length <= 1) { // default key is "value"
                    prop["value"] = kv[0];
                }
                else if (!filter || filter(kv[0], kv[1])) {
                    prop[kv[0]] = kv[1];
                }
            }
        }

        return prop;
    }

    private parsePropertyString(str: string, filter: (k: string, v: string) => boolean, ch:string = '='): string {
        ch = typeof ch !== 'undefined' ? ch : '=';
        let prop_map: { string: string } = this.parseProperty(str, filter, ch);
        let prop_str = ' ';
        $.each(prop_map, function (k, v) {
            prop_str += `${k}${ch}"${v}"`;
        });

        return prop_str;
    }

    //polar coordination to cart coordination
    private polar2Cart(centerX: string, centerY: string, radius: string, angleInDegrees: string): Point {
        let x: number = this.eval(centerX);
        let y: number = this.eval(centerY);
        let r: number = this.eval(radius);
        let a: number = (360.0 - this.eval(angleInDegrees)) * Math.PI / 180.0;

        return new Point(x + (r * Math.cos(a)), y + (r * Math.sin(a)), true);
    }

    private parsePosition(circles: { string: SvgCircle }, str): Point {
        var start = str.indexOf('(');
        var end = str.indexOf(')');
        if (start == 0) {
            let xy = str.substring(start + 1, end).split(',');
            if (xy.length == 2) { // (x,y)
                return new Point(this.eval(xy[0]), this.eval(xy[1]));
            }
            else { // (cx,cy,radius,theta)
                return this.polar2Cart(xy[0], xy[1], xy[2], xy[3]);
            }
        }
        else if (start > 0) { // C#2(45)
            var cr = circles[str.substr(0, start)];
            var c = this.polar2Cart(cr.x, cr.y, cr.r, str.substring(start + 1, end));
        }
        else { // C#2
            var cr = circles[str];
            return new Point(cr.x, cr.y);
        }
    }

    private getPropertyNumber(str: string = '', key: string = '', def_value: number): number {
    var vals = str.trim().split('=');
    if (vals.length == 2 && vals[0].trim() == key) {
        try { return this.eval(vals[1]); } catch (e) { }
    }
    return def_value;
}

    private vertical(fml, hints, prob_index, input_numbers) {
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
                        vertical_inputs += '<input mark="${(this.inputCount++)}" readonly value="' + c + '" type="text" style="left:' + (x - gx / 2) + 'px;top:' + (y - 2) + 'px"/>';//'<text x='+x+' y='+y+'>'+c+'</text>';
                    }
                    else {
                        ++input_numbers;
                        vertical_inputs += '<input mark="${(this.inputCount++)}" type="text" id="oemath-input-field-' + prob_index + '-' + input_numbers + '" style="left:' + (x - gx / 2) + 'px;top:' + (y - 2) + 'px" hint="' + hints[hint_index++] + '" placeholder="' + c + '"/>';
                    }
                    x += gx;
                }
                y += gy;
            }
        }
        vertical_inputs += '</foreignObject>';
        svg += vertical_inputs + '</g></svg>';

        return { problem: svg, inputs: input_numbers };
    }

    private replaceVertical(prob: string, prob_index: number, input_numbers: number) {
        var inputs = input_numbers;
        prob = prob.replace(/\s*<\s*oemath-vertical\s+\(([^\)]+)\)\s+\(([^\)]+)\)\s*>/g, function (m, $1, $2) {
            var desc_inputs = this.vertical(this.eval($1), this.eval($2), prob_index, input_numbers);
            inputs = desc_inputs.inputs;
            return desc_inputs.problem;
        });
        return { problem: prob, inputs: inputs };
    }

    private replaceOemathTags(question: string, index: number): string {
        //<canvas#(<w>,<h>)></canvas>
        question = question.replace(/<\s*canvas(\d*)\s*\(\s*(\d+)\s*,\s*(\d+)\)\s*>(.*?)<\s*\/canvas\s*>/g, function (m, $1, $2, $3, $4) {
            return "<div id='oemath-canvas-div" + $1 + "' style='position:relative;width:" + $2 + "px;height:" + $3 + "px'><canvas id='oemath-canvas" + $1 + "' width='" + $2 + "' height='" + $3 + "'>" + $4 + "<\/canvas><\/div>";
        });

        //<script-canvas#>
        question = question.replace(/<\s*script-canvas(\d*)\s*>/, function (m, $1) {
            return "<script>var ctx = document.getElementById('oemath-canvas" + $1 + "').getContext('2d');"
        });

        //<input[#](expected[,placeholder,width,x,y])>
        /* define css style for class: oemath-input-inline
        .oemath - input - inline
        {
            border: 1px solid;
            padding: 0px;
            text - align: center;
            font - size:24px;
            background - color:rgba(0, 0, 0, 0);
        }*/
        question = question.replace(/\s*<\s*input(\d*?)\s*\(\s*([^,]+)\s*,?\s*([^,]?)\s*,?\s*(\d*)\s*,?\s*(\d*)\s*,?\s*(\d*)\s*\)\s*>/g, function (m, id, expected, placeholder, w, x, y) {
            let rtn: string = `<input mark="${(this.inputCount++)}" class='oemath-input-inline' id='oemathid-input-${id == '' ? '0' : id}'`;
            if (placeholder != '') rtn += ` placeholder='${placeholder}'`;
            if (w != '' || x != '' || y != '') {
                rtn += " style='";
                if (w != '') { rtn += `width:${w}px;`; }
                if (x != '' || y != '') { rtn += 'position:absolute;'; }
                if (x != '') { rtn += `left:${x}px;`; }
                if (y != '') { rtn += `top:${y}px;`; }
                rtn += "'";
            }
            if (expected != '') rtn += ` expected='${expected}'`;
            rtn += "/>";
            return rtn;
        });

        return question;
    }

    private processAnswerType(): void
    {
        let answer = this.value_map['<ans>'];
        let answer_html: string = '<form class="oemathclass-question-form" id="oemathid-question-form">';

        if (this.type == ProblemType.TrueFalse) {
            let value: number = this.eval(answer) ? 1 : 0;
            [value, 1 - value].forEach(function (expected, idx, array) {
                answer_html += `<div expected='${expected}'><input type='radio' mark='${(this.inputCount++)}' name='oemath-question-radio' id='oemath-choice-${idx}' class='oemathclass-question-choice' expected='${expected}'>` +
                    `<label for='oemath-choice-${idx}' class='oemathclass-question-choice-label'>${['True','False'][idx]}</label></div >`;
            });
        }
        else if (this.type == ProblemType.Radio) {
            let options: string[] = answer.split(';;');
            let index = new Array(options.length);
            for (var i = 0; i < options.length; i++) index[i] = i;
            shuffle(index);
            for (let idx = 0; idx < index.length; idx++) {
                let i = index[idx];
                let expected: number = i == 0 ? 1 : 0;
                answer_html += `<div expected='${expected}'><input type='radio' mark='${(this.inputCount++)}' name='oemath-question-radio' id='oemath-choice-${i}' class='oemathclass-question-choice' expected='${expected}'>` +
                    `<label for='oemath-choice-${i}' class='oemathclass-question-choice-label'>${options[i].trim()}</label></div >`;
            }
        }
        else if (this.type == ProblemType.Checkbox) {
            let options: string[] = answer.split(';;');
            let corrects: number = parseInt(options[0]);
            let index = new Array(options.length - 1);
            for (var i = 1; i < options.length; i++) index[i-1] = i-1;
            shuffle(index);
            for (let idx = 0; idx < index.length; idx++) {
                let i = index[idx];
                let expected: number = i < corrects ? 1 : 0;
                answer_html += `<div expected='${expected}'><input type='checkbox' mark='${(this.inputCount++)}' name='oemath-question-checkbox' id='oemath-choice-${i}' class='oemathclass-question-choice' expected='${expected}'>` +
                    `<label for='oemath-choice-${i}' class='oemathclass-question-choice-label'>${options[i + 1].trim() }</label></div >`;
            }
        }

        answer_html += "<\/form>";
        this.value_map['<ans>'] = answer_html;
    }

    public checkAnswer(): Answer
    {
        let correct: boolean = true;

        switch (this.type) {
        case ProblemType.TrueFalse:
        case ProblemType.Radio:
        case ProblemType.Checkbox:
            let entered: boolean = false;
            $('.oemathclass-question-choice').each(function (index) {
                let expected: string = $(this).attr('expected');
                let checked: boolean = $(this).is(':checked');
                if (checked) entered = true;
                if ((expected == '1' && !checked) || (expected == '0' && checked)) {
                    correct = false;
                }
            });
            if (!entered) return Answer.Incomplete;
            break;

        case ProblemType.Normal:
            let answer_entered = $("#oemathid-answer-input").val().trim();
            if (answer_entered.length == 0) {
                return Answer.Incomplete;
            }
            correct = this.eval(`(${answer_entered})==(${this.value_map['<ans>']})`) ? true : false;
            break;

        case ProblemType.Literal:

        case ProblemType.Function:

        case ProblemType.Inline:

        case ProblemType.InlineLiteral:

        case ProblemType.InlineFunction:

        }

        return correct ? Answer.Correct : Answer.Wrong;
    }

    public generateHtml(): string
    {
        let html = 
`<div id="oemathid-problem-html"><hr/><h1 class="oemathclass-practice-title">Question</h1>\
<div class="oemathclass-practice-question">\
<h3 id="oemathid-practice-question" class="oemathclass-practice-problem">${this.question}</h3>\
</div><hr/>\
<div class="form-inline">`;

        if (this.type == ProblemType.Normal || this.type == ProblemType.Literal || this.type == ProblemType.Function) {
            html +=
`<h1 class="oemathclass-answer-title">Answer</h1><div class="form-inline">\
<input mark="${(this.inputCount++)}" id="oemathid-answer-input-0" type="text" class="form-control oemathclass-answer-input">`;
        }

        html += `<button id="oemathid-answer-submit" class="oemathclass-answer-submit" onclick="onclickSubmitPractice()">Submit</button></div></div>`;

        return html;
    }


    public process(index: number): boolean {
        this.parseParameterMap();

        this.parameter = this.replaceKnownParameters(this.parameter);
        this.parameter = this.replaceOemathTags(this.parameter, index);
        this.processAnswerType();
        this.question = this.replaceKnownParameters(this.question);
        this.question = this.replaceOemathTags(this.question, index);

        this.html = this.generateHtml();

        this.entered = new Array(this.inputCount);

        return true;
    }
}


function onclickSubmitPractice()
{
}

