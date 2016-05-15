/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />

const DEFAULT_INPUT_RADIUS: number = 25;
const DEFAULT_INLINE_INPUT_WIDTH: number = 30;
const SVG_MARGIN: number= 2;
const SVG_VERTICAL_CHAR_WIDTH: number = 32;
const SVG_VERTICAL_CHAR_HEIGHT: number = 44; // 40 will cause the inputing digit is higher

enum ProblemType {
    Normal = 0,
    SingleChoice = 1,
    MultipleChoice = 2,
    InlineInput = 3,
    Literal = 4,
    Function = 5
}

enum ProblemLevel {
    Easiest = 1,
    Easy = 2,
    Normal = 3,
    Hard = 4,
    Hardest = 5
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
    public answer: string;
    public inputs: number; // number of inputs

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

        this.answer = '';
        this.inputs = 0;

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

            if (!(name == 'ans' && (this.type == ProblemType.Literal || this.type == ProblemType.Function))) {
                value = this.eval(value).toString();
            }

            this.value_map[`<${name}>`] = value;
        }

        if (!this.value_map["<ans>"]) {
            this.value_map["<ans>"] = (this.type != ProblemType.InlineInput ? '0' : '');
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
                        vertical_inputs += '<input readonly value="' + c + '" type="text" style="left:' + (x - gx / 2) + 'px;top:' + (y - 2) + 'px"/>';//'<text x='+x+' y='+y+'>'+c+'</text>';
                    }
                    else {
                        ++input_numbers;
                        vertical_inputs += '<input type="text" id="oemath-input-field-' + prob_index + '-' + input_numbers + '" style="left:' + (x - gx / 2) + 'px;top:' + (y - 2) + 'px" hint="' + hints[hint_index++] + '" placeholder="' + c + '"/>';
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

    private replaceOemathTags(prob: string, index: number): [string, number] {//{ question: string, inputs: number } {
        prob = prob.replace(/<oemath-script>/g, '<script type="text/javascript">');
        prob = prob.replace(/<\/oemath-script>/g, '<\/script>');

        ///////////////////////
        // oemath-svg tags
        ///////////////////////
        let circles: { string: SvgCircle };
        let circle_inputs = '';
        let svg_width: number = 0;
        let svg_height: number = 0;
        let translateX: number = SVG_MARGIN;
        let translateY: number = SVG_MARGIN;
    
        // '<oemath-svg((w|width)=100,h|height=200)>'
        prob = prob.replace(/<\s*oemath-svg\(([^\)]+)\)\s*>/g, function (m, $1) {
            let prop : string = this.parsePropString($1, function (k, v) {
                if (k == 'width' || k == 'w') {
                    svg_width = this.eval(v);
                }
                else if (k == 'height' || k == 'h') {
                    svg_height = this.eval(v);
                }
                else if (k == 'tx' || k == 'translateX') {
                    translateX = this.eval(v);
                }
                else if (k == 'ty' || k == 'translateY') {
                    translateY = this.eval(v);
                }
                return false;
            });

            return '<svg width=' + (svg_width + 2 * translateX) + ' height=' + (svg_height + 2 * translateY) + ' class="oemath-svg-svg">' +
                '<g transform="translate(' + translateX + ',' + translateY + ')">';
        });

        // 'def_circle C#=(200,200,100)' +: define a circle named C#, cx=200, cy=200, radius=100
        prob = prob.replace(/def_circle\s+([^=\s]+)\s*=\s*\(\s*([^,\s\)]+)\s*,\s*([^,\s\)]+)\s*,\s*([^,\s\)]+)\s*\)/g, function (m, $1, $2, $3, $4) {
            circles[$1] = new SvgCircle(this.eval($2), this.eval($3), this.eval($4));
            return "";
        });

        // <svg-polygon[(nofill)] (x,y)|C#0(theta)[ (x,y)|C#0(theta)]+/>
        prob = prob.replace(/<\s*svg-polygon\(?([^\)\s]+)?\)?\s+([^>]+)>/g, function (m, $1, $2) {
            var pts = $2.trim().split(' ');
            var ret = '<polygon points="';
            for (let i = 0; i < pts.length; i++) {
                let xy: Point = this.parsePosition(circles, pts[i].trim());
                ret += (xy.x + ',' + xy.y + ' ');
            }

            ret += `" class="oemath-svg" ${this.parsePropertyString($1)}/>`;

            return ret;
        });


        // <svg-line(props) (x,y)|C#0(theta) (x,y)|C#0(theta)/>
        prob = prob.replace(/<\s*svg-line\(?([^\)\s]+)?\)?\s+(\S+)\s+([^>]+)>/g, function (m, $1, $2, $3) {
            var p1: Point = this.parsePosition(circles, $2);
            var p2: Point = this.parsePosition(circles, $3.trim());
            return `<line x1=${p1.x} y1=${p1.y} x2=${p2.x} y2=${p2.y} class="oemath-svg" ${this.parsePropertyString($1)}/>`;
        });

        // <svg-rect(props) (x,y)|C#0(theta) (x,y)|C#0(theta)/>
        prob = prob.replace(/<\s*svg-rect\(?([^\)\s]+)?\)?\s+(\S+)\s+([^>]+)>/g, function (m, $1, $2, $3) {
            var p1: Point = this.parsePosition(circles, $2);
            var p2: Point = this.parsePosition(circles, $3.trim());
            return `<rect x=${p1.x} y=${p1.y} width=${p2.x - p1.x} height=${p2.y - p1.y} class="oemath-svg" ${this.parsePropertyString($1)}/>`;
        });

        // <svg-circle[(props)] (x,y,r)>
        prob = prob.replace(/<\s*svg-circle\(?([^\)\s]+)?\)?\s+\(([^,]+),([^,]+),([^,]+)\)>/g, function (m, $1, $2, $3, $4) {

            var prop: string = this.parsePropertyString($1, function (k, v) {
                if (k == 'hint') {
//                    circle_inputs += '<svg-input(hint=' + v + ') ' + $2 + '>';
                    circle_inputs += `<svg-input(hint=${v}) ${$2}>`;
                    return false;
                }
                return true; // continue processing
            });

            return `<circle cx=${$2} cy=${$3} r=${$4}${prop}/>`;
        });

        // <svg-circle[(props)] C#(theta) r=<radius>> or
        // <svg-circle[(props)] C#>
        prob = prob.replace(/<\s*svg-circle\(?([^\)\s]+)?\)?\s+([^\s>]+)([^>]*)>/g, function (m, $1, $2, $3) {

            var prop: string = this.parsePropertyString($1, function (k, v) {
                if (k == 'hint') {
//                    circle_inputs += '<svg-input(hint=' + v + ') ' + $2 + '>';
                    circle_inputs += `<svg-input(hint=${v}) ${$2}>`;
                    return false;
                }
                return true; // continue processing
            });

            if ($2.indexOf('(') >= 0) { // C#0(theta) r=<radius>
                let xy: Point = this.parsePosition(circles, $2);
                let radius: number = this.getPropertyNumber($3, 'r', DEFAULT_INPUT_RADIUS);
//                return '<circle cx=' + xy.x + ' cy=' + xy.y + ' r=' + radius + prop + '/>';
                return `<circle cx=${xy.x} cy=${xy.y} r=${radius} ${prop}/>`;
            }
            else { // C#: to show this circle
                var cr = circles[$2.trim()];
//                return '<circle cx=' + cr.x + ' cy=' + cr.y + ' r=' + cr.r + prop + '/>';
                return `<circle cx=${cr.x} cy=${cr.y} r=${cr.r} ${prop}/>`;
            }
        });

        // inject circle inputs
        let has_foreign = false;
        prob = prob.replace(/(<\s*oemath-foreignObject\s*>)/g, function (m, $1) {
            has_foreign = true;
            return $1 + circle_inputs;
        });
        if (!has_foreign) {
            prob = prob.replace(/(<\s*\/\s*oemath-svg\s*>)/g, function (m, $1) {
//                return '<oemath-foreignObject>' + circle_inputs + '</oemath-foreignObject>' + $1;
                return `<oemath-foreignObject>${circle_inputs}</oemath-foreignObject>${$1}`;
            });
        }
    
        // oemath-image-input tags
        var input_numbers = -1;

        // <inline-input(props) [width=<width>]/>
        prob = prob.replace(/\<inline-input\(([^\)]+)\)([^>]*)>/g, function (m, $1, $2) {
            ++input_numbers;

            let width: number = this.getPropertyNumber($2, 'width', DEFAULT_INLINE_INPUT_WIDTH);

//            return '<input type="text" id="oemath-input-field-' + prob_index + '-' + input_numbers + '" class="oemath-inline-input" style="width:' + width + 'px" placeholder="?"' + parse_prop_str($1) + '>';
            return `<input type="text" id="oemath-input-field-${index}-${input_numbers}" class="oemath-inline-input" style="width:${width}px" placeholder="?"${this.parsePropertyString($1)}>`;
        });


        // <svg-input(props) [(x,y)|C#0(theta)] [width=<width>]/>
        // <svg-input(0) (10,10) width=100/>
        // <svg-input(0) (10,10)/>
        // <svg-input(0) C#0(10) width=100/>
        prob = prob.replace(/<\s*svg-input\(([^\)]+)\)\s+([^\s>]+)([^>]*)>/g, function (m, $1, $2, $3) {
            ++input_numbers;

            let width: number = this.getPropertyNumber($3, 'width', DEFAULT_INPUT_RADIUS * 2);
            var xyp: Point = this.parsePosition(circles, $2);
            if (xyp.polar) { // It's a polar coordination, find the left top corner
                xyp.x -= width / 2;
                xyp.y -= DEFAULT_INPUT_RADIUS;
            }
/*            return '<input type="text" id="oemath-input-field-' + prob_index + '-' + input_numbers + '"' +
                parse_prop_str($1) +
                ' style="left:' + xyp.x + 'px; top:' + xyp.y + 'px; width:' + width + 'px"' +
                ' class="oemath-svg-input" placeholder="?"/>';*/
            return `<input type="text" id="oemath-input-field-${index}-${input_numbers}"${this.parsePropertyString($1)} ` +
                `style="left:${xyp.x}px; top:${xyp.y}px; width:${width}px" class="oemath-svg-input" placeholder="?"/>`;
        });

        // see <svg-input>
        prob = prob.replace(/<\s*svg-text\(([^\)]+)\)\s+([^\s>]+)([^>]*)>/g, function (m, $1, $2, $3) {
            var width: number = this.getPropertyNumber($3, 'width', DEFAULT_INPUT_RADIUS * 2);
            var xyp = this.parsePosition(circles, $2);
            if (xyp.p) { // It's a polar coordination, find the left top corner
                xyp.x -= width / 2;
                xyp.y -= DEFAULT_INPUT_RADIUS;
            }
            let prop: {string: string} = this.parseProperty($1);
/*            return '<div style="position:absolute;left:' + (xyp.x - width / 2) + 'px;top:' + (xyp.y - DEFAULT_INPUT_RADIUS) + 'px"><input type="text" readonly value="' +
                prop["value"] +
                '" style="left:0;top:0;width:' + width + 'px;height:' + (DEFAULT_INPUT_RADIUS * 2) + 'px"' +
                '/></div>';*/
            return `<div style="position:absolute;left:${xyp.x - width / 2}px;top:${xyp.y - DEFAULT_INPUT_RADIUS}px"><input type="text" readonly value="${prop["value"]}" ` +
                `style="left:0;top:0;width:${width}px;height:${DEFAULT_INPUT_RADIUS * 2}px"/>` +
                '</div>';
        });

        prob = prob.replace(/<\s*oemath-foreignObject\s*>/g, '<foreignObject x=0 y=0 width=' + svg_width + ' height=' + svg_height + '>');
        prob = prob.replace(/<\s*\/\s*oemath-foreignObject\s*>/g, '<\/foreignObject>');
        prob = prob.replace(/<\s*\/\s*oemath-svg\s*>/g, '</g><\/svg>');

        var desc_inputs = this.replaceVertical(prob, index, input_numbers);

//        return { question: desc_inputs.problem, inputs: desc_inputs.inputs + 1 };
        return [desc_inputs.problem, desc_inputs.inputs + 1 ];
    }

    public process(index: number): boolean {
        this.parseParameterMap();

        this.question = this.replaceKnownParameters(this.question);

        [ this.question, this.inputs ] = this.replaceOemathTags(this.question, index);

        this.answer = this.replaceKnownParameters('<ans>');

        return true;
    }
}

/*function rx(question: string, parameter: string): string {
    let problem = new Problem(ProblemType.Normal, ProblemLevel.Normal, question, parameter);

    problem.process(2);

    return problem.question;
}*/
