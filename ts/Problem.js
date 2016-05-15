/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />
var DEFAULT_INPUT_RADIUS = 25;
var DEFAULT_INLINE_INPUT_WIDTH = 30;
var SVG_MARGIN = 2;
var SVG_VERTICAL_CHAR_WIDTH = 32;
var SVG_VERTICAL_CHAR_HEIGHT = 44; // 40 will cause the inputing digit is higher
var ProblemType;
(function (ProblemType) {
    ProblemType[ProblemType["Normal"] = 0] = "Normal";
    ProblemType[ProblemType["SingleChoice"] = 1] = "SingleChoice";
    ProblemType[ProblemType["MultipleChoice"] = 2] = "MultipleChoice";
    ProblemType[ProblemType["InlineInput"] = 3] = "InlineInput";
    ProblemType[ProblemType["Literal"] = 4] = "Literal";
    ProblemType[ProblemType["Function"] = 5] = "Function";
})(ProblemType || (ProblemType = {}));
var ProblemLevel;
(function (ProblemLevel) {
    ProblemLevel[ProblemLevel["Easiest"] = 1] = "Easiest";
    ProblemLevel[ProblemLevel["Easy"] = 2] = "Easy";
    ProblemLevel[ProblemLevel["Normal"] = 3] = "Normal";
    ProblemLevel[ProblemLevel["Hard"] = 4] = "Hard";
    ProblemLevel[ProblemLevel["Hardest"] = 5] = "Hardest";
})(ProblemLevel || (ProblemLevel = {}));
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
    function Problem(id, type, level, question, parameter, hint) {
        if (type === void 0) { type = ProblemType.Normal; }
        if (level === void 0) { level = ProblemLevel.Normal; }
        if (question === void 0) { question = ""; }
        if (parameter === void 0) { parameter = ""; }
        if (hint === void 0) { hint = ""; }
        this.id = id;
        this.type = type;
        this.level = level;
        this.question = question;
        this.parameter = parameter;
        this.hint = hint;
        this.answer = '';
        this.inputs = 0;
        this.value_map = {};
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
            if (!(name_1 == 'ans' && (this.type == ProblemType.Literal || this.type == ProblemType.Function))) {
                value = this.eval(value).toString();
            }
            this.value_map[("<" + name_1 + ">")] = value;
        }
        if (!this.value_map["<ans>"]) {
            this.value_map["<ans>"] = (this.type != ProblemType.InlineInput ? '0' : '');
        }
        return true;
    };
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
                        vertical_inputs += '<input readonly value="' + c + '" type="text" style="left:' + (x - gx / 2) + 'px;top:' + (y - 2) + 'px"/>'; //'<text x='+x+' y='+y+'>'+c+'</text>';
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
    };
    Problem.prototype.replaceVertical = function (prob, prob_index, input_numbers) {
        var inputs = input_numbers;
        prob = prob.replace(/\s*<\s*oemath-vertical\s+\(([^\)]+)\)\s+\(([^\)]+)\)\s*>/g, function (m, $1, $2) {
            var desc_inputs = this.vertical(this.eval($1), this.eval($2), prob_index, input_numbers);
            inputs = desc_inputs.inputs;
            return desc_inputs.problem;
        });
        return { problem: prob, inputs: inputs };
    };
    Problem.prototype.replaceOemathTags = function (prob, index) {
        prob = prob.replace(/<oemath-script>/g, '<script type="text/javascript">');
        prob = prob.replace(/<\/oemath-script>/g, '<\/script>');
        ///////////////////////
        // oemath-svg tags
        ///////////////////////
        var circles;
        var circle_inputs = '';
        var svg_width = 0;
        var svg_height = 0;
        var translateX = SVG_MARGIN;
        var translateY = SVG_MARGIN;
        // '<oemath-svg((w|width)=100,h|height=200)>'
        prob = prob.replace(/<\s*oemath-svg\(([^\)]+)\)\s*>/g, function (m, $1) {
            var prop = this.parsePropString($1, function (k, v) {
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
            for (var i = 0; i < pts.length; i++) {
                var xy = this.parsePosition(circles, pts[i].trim());
                ret += (xy.x + ',' + xy.y + ' ');
            }
            ret += "\" class=\"oemath-svg\" " + this.parsePropertyString($1) + "/>";
            return ret;
        });
        // <svg-line(props) (x,y)|C#0(theta) (x,y)|C#0(theta)/>
        prob = prob.replace(/<\s*svg-line\(?([^\)\s]+)?\)?\s+(\S+)\s+([^>]+)>/g, function (m, $1, $2, $3) {
            var p1 = this.parsePosition(circles, $2);
            var p2 = this.parsePosition(circles, $3.trim());
            return "<line x1=" + p1.x + " y1=" + p1.y + " x2=" + p2.x + " y2=" + p2.y + " class=\"oemath-svg\" " + this.parsePropertyString($1) + "/>";
        });
        // <svg-rect(props) (x,y)|C#0(theta) (x,y)|C#0(theta)/>
        prob = prob.replace(/<\s*svg-rect\(?([^\)\s]+)?\)?\s+(\S+)\s+([^>]+)>/g, function (m, $1, $2, $3) {
            var p1 = this.parsePosition(circles, $2);
            var p2 = this.parsePosition(circles, $3.trim());
            return "<rect x=" + p1.x + " y=" + p1.y + " width=" + (p2.x - p1.x) + " height=" + (p2.y - p1.y) + " class=\"oemath-svg\" " + this.parsePropertyString($1) + "/>";
        });
        // <svg-circle[(props)] (x,y,r)>
        prob = prob.replace(/<\s*svg-circle\(?([^\)\s]+)?\)?\s+\(([^,]+),([^,]+),([^,]+)\)>/g, function (m, $1, $2, $3, $4) {
            var prop = this.parsePropertyString($1, function (k, v) {
                if (k == 'hint') {
                    //                    circle_inputs += '<svg-input(hint=' + v + ') ' + $2 + '>';
                    circle_inputs += "<svg-input(hint=" + v + ") " + $2 + ">";
                    return false;
                }
                return true; // continue processing
            });
            return "<circle cx=" + $2 + " cy=" + $3 + " r=" + $4 + prop + "/>";
        });
        // <svg-circle[(props)] C#(theta) r=<radius>> or
        // <svg-circle[(props)] C#>
        prob = prob.replace(/<\s*svg-circle\(?([^\)\s]+)?\)?\s+([^\s>]+)([^>]*)>/g, function (m, $1, $2, $3) {
            var prop = this.parsePropertyString($1, function (k, v) {
                if (k == 'hint') {
                    //                    circle_inputs += '<svg-input(hint=' + v + ') ' + $2 + '>';
                    circle_inputs += "<svg-input(hint=" + v + ") " + $2 + ">";
                    return false;
                }
                return true; // continue processing
            });
            if ($2.indexOf('(') >= 0) {
                var xy = this.parsePosition(circles, $2);
                var radius = this.getPropertyNumber($3, 'r', DEFAULT_INPUT_RADIUS);
                //                return '<circle cx=' + xy.x + ' cy=' + xy.y + ' r=' + radius + prop + '/>';
                return "<circle cx=" + xy.x + " cy=" + xy.y + " r=" + radius + " " + prop + "/>";
            }
            else {
                var cr = circles[$2.trim()];
                //                return '<circle cx=' + cr.x + ' cy=' + cr.y + ' r=' + cr.r + prop + '/>';
                return "<circle cx=" + cr.x + " cy=" + cr.y + " r=" + cr.r + " " + prop + "/>";
            }
        });
        // inject circle inputs
        var has_foreign = false;
        prob = prob.replace(/(<\s*oemath-foreignObject\s*>)/g, function (m, $1) {
            has_foreign = true;
            return $1 + circle_inputs;
        });
        if (!has_foreign) {
            prob = prob.replace(/(<\s*\/\s*oemath-svg\s*>)/g, function (m, $1) {
                //                return '<oemath-foreignObject>' + circle_inputs + '</oemath-foreignObject>' + $1;
                return "<oemath-foreignObject>" + circle_inputs + "</oemath-foreignObject>" + $1;
            });
        }
        // oemath-image-input tags
        var input_numbers = -1;
        // <inline-input(props) [width=<width>]/>
        prob = prob.replace(/\<inline-input\(([^\)]+)\)([^>]*)>/g, function (m, $1, $2) {
            ++input_numbers;
            var width = this.getPropertyNumber($2, 'width', DEFAULT_INLINE_INPUT_WIDTH);
            //            return '<input type="text" id="oemath-input-field-' + prob_index + '-' + input_numbers + '" class="oemath-inline-input" style="width:' + width + 'px" placeholder="?"' + parse_prop_str($1) + '>';
            return "<input type=\"text\" id=\"oemath-input-field-" + index + "-" + input_numbers + "\" class=\"oemath-inline-input\" style=\"width:" + width + "px\" placeholder=\"?\"" + this.parsePropertyString($1) + ">";
        });
        // <svg-input(props) [(x,y)|C#0(theta)] [width=<width>]/>
        // <svg-input(0) (10,10) width=100/>
        // <svg-input(0) (10,10)/>
        // <svg-input(0) C#0(10) width=100/>
        prob = prob.replace(/<\s*svg-input\(([^\)]+)\)\s+([^\s>]+)([^>]*)>/g, function (m, $1, $2, $3) {
            ++input_numbers;
            var width = this.getPropertyNumber($3, 'width', DEFAULT_INPUT_RADIUS * 2);
            var xyp = this.parsePosition(circles, $2);
            if (xyp.polar) {
                xyp.x -= width / 2;
                xyp.y -= DEFAULT_INPUT_RADIUS;
            }
            /*            return '<input type="text" id="oemath-input-field-' + prob_index + '-' + input_numbers + '"' +
                            parse_prop_str($1) +
                            ' style="left:' + xyp.x + 'px; top:' + xyp.y + 'px; width:' + width + 'px"' +
                            ' class="oemath-svg-input" placeholder="?"/>';*/
            return ("<input type=\"text\" id=\"oemath-input-field-" + index + "-" + input_numbers + "\"" + this.parsePropertyString($1) + " ") +
                ("style=\"left:" + xyp.x + "px; top:" + xyp.y + "px; width:" + width + "px\" class=\"oemath-svg-input\" placeholder=\"?\"/>");
        });
        // see <svg-input>
        prob = prob.replace(/<\s*svg-text\(([^\)]+)\)\s+([^\s>]+)([^>]*)>/g, function (m, $1, $2, $3) {
            var width = this.getPropertyNumber($3, 'width', DEFAULT_INPUT_RADIUS * 2);
            var xyp = this.parsePosition(circles, $2);
            if (xyp.p) {
                xyp.x -= width / 2;
                xyp.y -= DEFAULT_INPUT_RADIUS;
            }
            var prop = this.parseProperty($1);
            /*            return '<div style="position:absolute;left:' + (xyp.x - width / 2) + 'px;top:' + (xyp.y - DEFAULT_INPUT_RADIUS) + 'px"><input type="text" readonly value="' +
                            prop["value"] +
                            '" style="left:0;top:0;width:' + width + 'px;height:' + (DEFAULT_INPUT_RADIUS * 2) + 'px"' +
                            '/></div>';*/
            return ("<div style=\"position:absolute;left:" + (xyp.x - width / 2) + "px;top:" + (xyp.y - DEFAULT_INPUT_RADIUS) + "px\"><input type=\"text\" readonly value=\"" + prop["value"] + "\" ") +
                ("style=\"left:0;top:0;width:" + width + "px;height:" + DEFAULT_INPUT_RADIUS * 2 + "px\"/>") +
                '</div>';
        });
        prob = prob.replace(/<\s*oemath-foreignObject\s*>/g, '<foreignObject x=0 y=0 width=' + svg_width + ' height=' + svg_height + '>');
        prob = prob.replace(/<\s*\/\s*oemath-foreignObject\s*>/g, '<\/foreignObject>');
        prob = prob.replace(/<\s*\/\s*oemath-svg\s*>/g, '</g><\/svg>');
        var desc_inputs = this.replaceVertical(prob, index, input_numbers);
        //        return { question: desc_inputs.problem, inputs: desc_inputs.inputs + 1 };
        return [desc_inputs.problem, desc_inputs.inputs + 1];
    };
    Problem.prototype.process = function (index) {
        this.parseParameterMap();
        this.question = this.replaceKnownParameters(this.question);
        _a = this.replaceOemathTags(this.question, index), this.question = _a[0], this.inputs = _a[1];
        this.answer = this.replaceKnownParameters('<ans>');
        return true;
        var _a;
    };
    return Problem;
})();
function rx(question, parameter) {
    var problem = new Problem(1, ProblemType.Normal, ProblemLevel.Normal, question, parameter);
    problem.process(2);
    return problem.question;
}
//# sourceMappingURL=Problem.js.map