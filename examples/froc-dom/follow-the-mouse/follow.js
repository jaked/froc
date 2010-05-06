// compiled by ocamlc 3.11.2, ocamljs 0.2
var ocamljs$caml_named_value = (function (){
var Match_failure$16g = "Match_failure";
var Out_of_memory$17g = "Out_of_memory";
var Stack_overflow$24g = "Stack_overflow";
var Invalid_argument$18g = "Invalid_argument";
var Failure$19g = "Failure";
var Not_found$20g = "Not_found";
var Sys_error$21g = "Sys_error";
var End_of_file$22g = "End_of_file";
var Division_by_zero$23g = "Division_by_zero";
var Sys_blocked_io$25g = "Sys_blocked_io";
var Assert_failure$26g = "Assert_failure";
var Undefined_recursive_module$27g = "Undefined_recursive_module";
/*
 * This file is part of ocamljs, OCaml to Javascript compiler
 * Copyright (C) 2007-9 Skydeck, Inc
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Library General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Library General Public License for more details.
 *
 * You should have received a copy of the GNU Library General Public
 * License along with this library; if not, write to the Free
 * Software Foundation, Inc., 59 Temple Place - Suite 330, Boston,
 * MA 02111-1307, USA
 */

var caml_blit_string = function (s1, o1, s2, o2, n) {
  for (var i = 0; i < n; i++)
    oc$$ssetu(s2, o2 + i, oc$$srefu(s1, o1 + i));
}
var caml_callback = function (f, a) { return _(f, [a]); }
var caml_callback2 = function (f, a1, a2) { return _(f, [a1, a2]); }
var caml_callback3 = function (f, a1, a2, a3) { return _(f, [a1, a2, a3]); }
var caml_callback4 = function (f, a1, a2, a3, a4) { return _(f, [a1, a2, a3, a4]); }
var caml_callback5 = function (f, a1, a2, a3, a4, a5) { return _(f, [a1, a2, a3, a4, a5]); }
var caml_callbackN = function (f, n, args) { return _(f, args); }
// XXX caml_callback_exn ?
var compare_val = function (v1, v2, total) {
  var LESS = -1;
  var GREATER = 1;
  var EQUAL = 0;
  var UNORDERED = -2; // XXX ok?

  // XXX needs some work

  if (v1 == v2 && total) return EQUAL;

  var t1 = typeof v1;
  var t2 = typeof v2;
  if (t1 == t2) {
    switch (t1) {
    case "boolean":
      if (v1 < v2) return LESS;
      if (v1 > v2) return GREATER;
      return EQUAL;
    case "number":
      if (v1 < v2) return LESS;
      if (v1 > v2) return GREATER;
      if (v1 != v2) {
	if (!total) return UNORDERED;
	if (v1 == v1) return GREATER;
	if (v2 == v2) return LESS;
	return EQUAL;
      }
      return EQUAL;
    case "string":
      if (v1 < v2) return LESS;
      if (v1 > v2) return GREATER;
      return EQUAL;
    case "function":
      caml_invalid_argument("equal: functional value");
    case "object":
      // like NaN
      if (v1 == null) {
	if (v2 == null) return EQUAL;
	return LESS;
      }
      if (v2 == null) return GREATER;

      // XXX is there a way to get the class of an object as a value?
      // XXX is it worth special casing various JS objects?
      if (v1 instanceof Date) {
	var t1 = v1.getTime();
	var t2 = v2.getTime();
	if (t1 < t2) return LESS;
	if (t1 > t2) return GREATER;
	return EQUAL;
      }
      if (v1 instanceof Array) {
	// we should always either have both tags or neither
	// so it is OK to fall through here
	if (v1.t < v2.t) return LESS;
	if (v1.t > v2.t) return GREATER;
	var sz1 = v1.length;
	var sz2 = v2.length;
	if (sz1 < sz2) return LESS;
	if (sz1 > sz2) return GREATER;
	if (sz1 == 0) return EQUAL;
	for (var i=0; i < sz1; i++)
	  {
	    var c = compare_val(v1[i], v2[i], total);
	    if (c != EQUAL) return c;
	  }
	return EQUAL;
      }
      if (v1 instanceof oc$$ms) {
	var s1 = v1.toString();
	var s2 = v2.toString();
	if (s1 < s2) return LESS;
	if (s1 > s2) return GREATER;
	return EQUAL;
      }
      if (v1._m != null && v2._m != null) { // i.e. an OCaml object XXX better test
        var oid1 = v1[1];
        var oid2 = v2[1];
        if (oid1 < oid2) return LESS;
        if (oid1 > oid2) return GREATER;
        return EQUAL;
      }
      return UNORDERED; // XXX
    default:
      return UNORDERED;
    }
  }

  // like NaN
  if (v1 == null) {
    if (v2 == null) return EQUAL;
    return LESS;
  }
  if (v2 == null) return GREATER;

  // one boolean and one int
  if (t1 == "boolean" || t2 == "boolean")
  {
    if (v1 < v2) return LESS;
    if (v1 > v2) return GREATER;
    return EQUAL;
  }
  // one mutable and one immutable string
  if (t1 == "string" || t2 == "string")
  {
    var s1 = v1.toString();
    var s2 = v2.toString();
    if (s1 < s2) return LESS;
    if (s1 > s2) return GREATER;
    return EQUAL;
  }
  // one constructor without data (number) and one with (object Array)
  if (t1 == "number") return LESS;
  if (t2 == "number") return GREATER;
  return UNORDERED;
}
var caml_compare = function (v1, v2) {
  var res = compare_val(v1, v2, 1);
  return res < 0 ? -1 : res > 0 ? 1 : 0;
}
var caml_equal = function (v1, v2) { return compare_val(v1, v2, 0) == 0; }
var caml_failwith = function (s) { throw $(Failure$19g, s); }
var caml_fill_string = function(s, o, l, c) {
  for (var i = 0; i < l; i++)
    oc$$ssetu(s, o + i, c);
}
var caml_float_compare = function (v1, v2) {
  if (v1 === v2) return 0;
  if (v1 < v2) return -1;
  if (v1 > v2) return 1;
  if (v1 === v1) return 1;
  if (v2 === v2) return -1;
  return 0;
}
var caml_float_of_string = function (s) {
  var f = parseFloat(s);
  return isNaN(f) ? caml_failwith("float_of_string") : f;
}
var caml_classify_float = function (f) {
  if (isNan(f)) return 4; // FP_nan
  else if (!isFinite(f)) return 3; // FP_infinite
  else if (f === 0) return 2; // FP_zero
  // can't determine subnormal from js afaik
  else return 0; // FP_normal
}

var caml_format_int = function(f, a) {
  function parse_format(f) { return f; } // XXX see ints.c
  var f2 = parse_format(f);
  return oc$$sprintf(f2, a);
}

var caml_greaterthan = function (v1, v2) { return compare_val(v1, v2, 0) > 0; }
var caml_greaterequal = function (v1, v2) { return compare_val(v1, v2, 0) >= 0; }
var caml_hash_univ_param = function (count, limit, obj) {
  // globals
  hash_univ_limit = limit;
  hash_univ_count = count;
  hash_accu = 0;

  // XXX needs work
  function hash_aux(obj) {
    hash_univ_limit--;
    if (hash_univ_count < 0 || hash_univ_limit < 0) return;

    function combine(n) { hash_accu = hash_accu * 65599 + n; }
    function combine_small(n) { hash_accu = hash_accu * 19 + n; }

    switch (typeof obj) {
    case "number":
      // XXX for floats C impl examines bit rep
      // XXX for constructors without data C impl uses combine_small
      hash_univ_count--;
      combine(obj);
      break;
    case "string":
      hash_univ_count--;
      for (var i = obj.length; i > 0; i--)
        combine_small(obj.charCodeAt(i));
      break;
    case "boolean":
      hash_univ_count--;
      combine_small(obj ? 1 : 0);
      break;
    case "object":
      if (obj instanceof oc$$ms)
        hash_aux(obj.toString());
      else if (obj instanceof Array) { // possibly a block
        if (obj.t) {
          hash_univ_count--;
          combine_small(obj.t);
          for (var i = obj.length; i > 0; i--)
            hash_aux(obj[i]);
        }
      }
      else if (obj._m != null) { // OCaml object, use oid
        hash_univ_count--;
        combine(obj[1]);
      }
      break;
    default:
      break;
    }
  }

  hash_aux(obj);
  return hash_accu & 0x3FFFFFFF;
}
var caml_input_value = function () { throw "caml_input_value"; }
var caml_input_value_from_string = function () { throw "caml_input_value_from_string"; }
var caml_install_signal_handler = function () { throw "caml_install_signal_handler"; }
var caml_int_compare = function (i1, i2) { return (i1 > i2) - (i1 < i2); }
var caml_int32_compare = function (i1, i2) { return (i1 > i2) - (i1 < i2); }
var caml_int64_compare = function (i1, i2) { throw "caml_int64_compare"; }
var caml_int64_float_of_bits = function (s) {
  // see pervasives.ml; int64s are represented by strings
  switch (s) {
  case "9218868437227405312": return Number.POSITIVE_INFINITY;
  case "-4503599627370496": return Number.NEGATIVE_INFINITY;
  case "9218868437227405313": return Number.NaN;
  case "9218868437227405311" : return Number.MAX_VALUE;
  case "4503599627370496": return Number.MIN_VALUE;
  case "4372995238176751616": return 0; // XXX how to get epsilon in js?
  default: return 0;
  }
}
var caml_int_of_string = function (s) {
  var i = parseInt(s, 10);
  return isNaN(i) ? caml_failwith("int_of_string") : i;
}
var caml_invalid_argument = function (s) { throw $(Invalid_argument$18g, s); }
var caml_is_printable = function (c) { return c > 21 && c < 127; } // XXX get this right
var caml_lessthan = function (v1, v2) { return compare_val(v1, v2, 0) -1 < -1; }
var caml_lessequal = function (v1, v2) { return compare_val(v1, v2, 0) -1 <= -1; }
var caml_make_vect = function (l, i) {
  var a = new Array(l);
  for (var j = 0; j < l; j++)
    a[j] = i;
  return a;
}
var caml_marshal_data_size = function () { throw "caml_marshal_data_size"; }
var caml_md5_chan = function () { throw "caml_md5_chan"; }
var caml_md5_string = function () { throw "caml_md5_string"; }
var caml_ml_channel_size = function () { throw "caml_ml_channel_size"; }
var caml_ml_channel_size_64 = function () { throw "caml_ml_channel_size_64"; }
var caml_ml_close_channel = function () { throw "caml_ml_close_channel"; }

var caml_ml_flush = function (c) { }

var caml_ml_input = function () { throw "caml_ml_input"; }
var caml_ml_input_char = function () { throw "caml_ml_input_char"; }
var caml_ml_input_int = function () { throw "caml_ml_input_int"; }
var caml_ml_input_scan_line = function () { throw "caml_ml_input_scan_line"; }
var caml_ml_open_descriptor_in = function () { return 0; } // XXX
var caml_ml_open_descriptor_out = function () { return 0; } // XXX
var caml_ml_out_channels_list = function () { return 0; }

var caml_ml_output = function (c, b, s, l) { print_verbatim(b); }
var caml_ml_output_char = function (c, ch) {  }

var caml_ml_output_int = function () { throw "caml_ml_output_int"; }
var caml_ml_pos_in = function () { throw "caml_ml_pos_in"; }
var caml_ml_pos_in_64 = function () { throw "caml_ml_pos_in_64"; }
var caml_ml_pos_out = function () { throw "caml_ml_pos_out"; }
var caml_ml_pos_out_64 = function () { throw "caml_ml_pos_out_64"; }
var caml_ml_seek_in = function () { throw "caml_ml_seek_in"; }
var caml_ml_seek_in_64 = function () { throw "caml_ml_seek_in_64"; }
var caml_ml_seek_out = function () { throw "caml_ml_seek_out"; }
var caml_ml_seek_out_64 = function () { throw "caml_ml_seek_out_64"; }
var caml_ml_set_binary_mode = function () { throw "caml_ml_set_binary_mode"; }
var caml_named_value = function (n) { return oc$$nv[n]; }
var caml_nativeint_compare = function (i1, i2) { return (i1 > i2) - (i1 < i2); }
var caml_notequal = function (v1, v2) { return compare_val(v1, v2, 0) != 0; }
var caml_obj_dup = function (a) {
  var l = a.length;
  var d = new Array(l);
  for (var i=0; i < l; i++)
    d[i] = a[i];
  d.t = a.t;
  return d;
}
var caml_obj_is_block = function (o) { return !(typeof o == 'number') }
var caml_obj_tag = function(o) { return o.t; }
var caml_obj_set_tag = function(o, t) { o.$t = t; }
var caml_obj_block = function(t, s) { if (s == 0) return t; else { var a = new Array(s); a.$t = t; return a; } }
var caml_obj_truncate = function(o, s) { o.length = s; }
var caml_output_value = function () { throw "caml_output_value"; }
var caml_output_value_to_string = function () { throw "caml_output_value_to_string"; }
var caml_output_value_to_buffer = function () { throw "caml_output_value_to_buffer"; }
var caml_record_backtrace = function () { throw "caml_record_backtrace"; }
var caml_backtrace_status = function () { throw "caml_backtrace_status"; }
var caml_get_exception_backtrace = function () { throw "caml_get_exception_backtrace"; }
var caml_register_named_value = function (n, v) { oc$$nv[n] = v; }
var caml_string_compare = function (s1, s2) {
  if (oc$$slt(s1, s2)) return -1;
  else if (oc$$sgt(s1, s2)) return 1;
  else return 0;
}
var caml_sys_exit = function () { throw "caml_sys_exit"; }
  var init_time = (new Date()).getTime() / 1000;
var caml_sys_time = function () { return (new Date()).getTime() / 1000 - init_time; }
var caml_sys_get_argv = function () { return $("", $()); } // XXX put something here?
var caml_sys_get_config = function () { return $("js", 32); } // XXX browser name?
var caml_sys_open = function () { throw "caml_sys_open"; }
var caml_sys_random_seed = function() { throw "caml_sys_random_seed"; }
/*
 * This file is part of ocamljs, OCaml to Javascript compiler
 * Copyright (C) 2007-9 Skydeck, Inc
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Library General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Library General Public License for more details.
 *
 * You should have received a copy of the GNU Library General Public
 * License along with this library; if not, write to the Free
 * Software Foundation, Inc., 59 Temple Place - Suite 330, Boston,
 * MA 02111-1307, USA
 */

/*
function console_log(s) {
  var cs = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces["nsIConsoleService"]);
  cs.logStringMessage(s);
}
*/

var oc$$nv = {}

// XXX name these sensibly and compactify code afterwards

function ___a(m, t, a) {
  return m.apply(t, a);
}

/*@cc_on @if (@_win32 && @_jscript_version >= 5)
function ___a(m, t, a) {
  if (m.apply)
    return m.apply(t, a);
  else
    // IE < 8 doesn't support apply for DOM methods, but does support "cached" methods bound to an object
    switch (a.length) {
    case 0: return m();
    case 1: return m(a[0]);
    case 2: return m(a[0], a[1]);
    case 3: return m(a[0], a[1], a[2]);
    case 4: return m(a[0], a[1], a[2], a[3]);
    case 5: return m(a[0], a[1], a[2], a[3], a[4]);
    case 6: return m(a[0], a[1], a[2], a[3], a[4], a[5]);
    case 7: return m(a[0], a[1], a[2], a[3], a[4], a[5], a[6]);
    default: throw "unimplemented";
    }
}
@end @*/

function ___m(m, t, a)
{
  function ap(a1, a2) {
    var a = new Array();
    for (var i=0; i < a1.length; i++) a.push(a1[i]);
    for (var i=0; i < a2.length; i++) a.push(a2[i]);
    return a;
  }

  while (true) {
    var al = a.length;
    var ml = m.length;

    if (al < ml)
    {
      switch (ml - al) {
      case 1: return _f(function (z) { return m.apply(t, ap(a, arguments)) });
      case 2: return _f(function (z,y) { return m.apply(t, ap(a, arguments)) });
      case 3: return _f(function (z,y,x) { return m.apply(t, ap(a, arguments)) });
      case 4: return _f(function (z,y,x,w) { return m.apply(t, ap(a, arguments)) });
      case 5: return _f(function (z,y,x,w,v) { return m.apply(t, ap(a, arguments)) });
      case 6: return _f(function (z,y,x,w,v,u) { return m.apply(t, ap(a, arguments)) });
      case 7: return _f(function (z,y,x,w,v,u,s) { return m.apply(t, ap(a, arguments)) });
      default: throw "unimplemented";
      }
    }
    else if (al == ml)
      return m.apply(t, a);
    else // al > ml
    {
      m = _m(m, t, a.slice(0, ml));
      t = m;
      a = a.slice(ml);
    }
  }
}

var $in_tail = false;

// tail call
function __m(m, t, args)
{
  if (m.$oc) {
    if ($in_tail) {
      args.$m = m;
      args.$t = t;
      args.$tr = true;
      return args;
    }
    else
      return _m(m, t, args);
  }
  else {
    var old_in_tail = $in_tail;
    $in_tail = false;
    try { return ___a(m, t, args); }
    finally { $in_tail = old_in_tail; }
  }
}
function __(t, args) { return __m(t, t, args); }

// non tail call
function _m(m, t, args)
{
  if (m.$oc) {
    var old_in_tail = $in_tail;
    $in_tail = true;
    try {
      var v = __m(m, t, args);
      while (v && v.$tr)
        v = ___m(v.$m, v.$t, v);
      return v;
    }
    finally { $in_tail = old_in_tail; }
  }
  else {
    var old_in_tail = $in_tail;
    $in_tail = false;
    try { return ___a(m, t, args); }
    finally { $in_tail = old_in_tail; }
  }
}
function _(t, args) { return _m(t, t, args); }

function _f(f) {
  f.$oc = true;
  return f;
}

function $N(t, a) {
  var l = a.length;
  var b = new Array(l);
  for (var i=0; i < l; i++)
    b[i] = a[i];
  b.t = t;
  return b;
}
function $() { return $N(0, arguments); }
function $1() { return $N(1, arguments); }
function $2() { return $N(2, arguments); }
function $3() { return $N(3, arguments); }
function $4() { return $N(4, arguments); }
function $5() { return $N(5, arguments); }
function $6() { return $N(6, arguments); }
function $7() { return $N(7, arguments); }
function $8() { return $N(8, arguments); }
function $9() { return $N(9, arguments); }
function $t(a) { return a.t; }

function $xM(t) { return { $t: t }; }
function $xN(t, a) { a.$t = t; return a; }
function $xt(a) { return a.$t; }

function oc$$arefs(o, i) {
  return i < o.length ? o[i] : oc$Pervasives$[0]("index out of bounds");
}
function oc$$asets(o, i, v) {
  return i < o.length ? o[i] = v : oc$Pervasives$[0]("index out of bounds");
}

// mutable strings, argh

function oc$$ms(a) {
  this.a = a;
  this.length = a.length;
}

// XXX cache the string rep?
oc$$ms.prototype.toString = function () { return String.fromCharCode.apply(null, this.a); }

function oc$$lms(s) {
  var l = s.length;
  var a = new Array(l);
  for (var i = 0; i < l; i++)
    a[i] = s.charCodeAt(i);
  return new oc$$ms(a);
}
function oc$$cms(n) {
  return new oc$$ms(new Array(n));
}
function oc$$srefu(o, i) { return typeof o == "string" ? o.charCodeAt(i) : o.a[i]; }
function oc$$ssetu(o, i, v) { o.a[i] = v; }
function oc$$srefs(o, i) {
  return i < o.length ? oc$$srefu(o, i) : oc$Pervasives$[0]("index out of bounds");
}
function oc$$ssets(o, i, v) {
  return i < o.length ? oc$$ssetu(o, i, v) : oc$Pervasives$[0]("index out of bounds");
}

function oc$$seq(s1, s2) { return s1.toString() == s2.toString(); }
function oc$$sneq(s1, s2) { return s1.toString() != s2.toString(); }
function oc$$slt(s1, s2) { return s1.toString() < s2.toString(); }
function oc$$sgt(s1, s2) { return s1.toString() > s2.toString(); }
function oc$$slte(s1, s2) { return s1.toString() <= s2.toString(); }
function oc$$sgte(s1, s2) { return s1.toString() >= s2.toString(); }

/*
**  sprintf.js -- POSIX sprintf(3) style formatting function for JavaScript
**  Copyright (c) 2006-2007 Ralf S. Engelschall <rse@engelschall.com>
**  Partly based on Public Domain code by Jan Moesen <http://jan.moesen.nu/>
**  Licensed under GPL <http://www.gnu.org/licenses/gpl.txt>
**
**  modified for ocamljs to more closely match Linux
**
**  $LastChangedDate$
**  $LastChangedRevision$
*/

/*  make sure the ECMAScript 3.0 Number.toFixed() method is available  */
if (typeof Number.prototype.toFixed != "undefined") {
    (function(){
        /*  see http://www.jibbering.com/faq/#FAQ4_6 for details  */
        function Stretch(Q, L, c) {
            var S = Q
            if (c.length > 0)
                while (S.length < L)
                    S = c+S;
            return S;
        }
        function StrU(X, M, N) { /* X >= 0.0 */
            var T, S;
            S = new String(Math.round(X * Number("1e"+N)));
            if (S.search && S.search(/\D/) != -1)
                return ''+X;
            with (new String(Stretch(S, M+N, '0')))
                return substring(0, T=(length-N)) + '.' + substring(T);
        }
        function Sign(X) {
            return X < 0 ? '-' : '';
        }
        function StrS(X, M, N) {
            return Sign(X)+StrU(Math.abs(X), M, N);
        }
        Number.prototype.toFixed = function (n) { return StrS(this, 1, n) };
    })();
}

/*  the sprintf() function  */
var oc$$sprintf = function () {
    /*  argument sanity checking  */
    if (!arguments || arguments.length < 1)
        alert("sprintf:ERROR: not enough arguments 1");

    /*  initialize processing queue  */
    var argumentnum = 0;
    var done = "", todo = arguments[argumentnum++];

    /*  parse still to be done format string  */
    var m;
    while ((m = /^([^%]*)%(\d+$)?([#0 +'-]+)?(\*|\d+)?(\.\*|\.\d+)?([%dioulLnNxXfFgGcs])(.*)$/.exec(todo))) {
        var pProlog    = m[1],
            pAccess    = m[2],
            pFlags     = m[3],
            pMinLength = m[4],
            pPrecision = m[5],
            pType      = m[6],
            pEpilog    = m[7];

        /*  determine substitution  */
        var subst;
        if (pType == '%')
            /*  special case: escaped percent character  */
            subst = '%';
        else {
            /*  parse padding and justify aspects of flags  */
            var padWith = ' ';
            var justifyRight = true;
            if (pFlags) {
                if (pFlags.indexOf('0') >= 0)
                    padWith = '0';
                if (pFlags.indexOf('-') >= 0) {
                    padWith = ' ';
                    justifyRight = false;
                }
            }
            else
                pFlags = "";

            /*  determine minimum length  */
            var minLength = -1;
            if (pMinLength) {
                if (pMinLength == "*") {
                    var access = argumentnum++;
                    if (access >= arguments.length)
                        alert("sprintf:ERROR: not enough arguments 2");
                    minLength = arguments[access];
                }
                else
                    minLength = parseInt(pMinLength, 10);
            }

            /*  determine precision  */
            var precision = -1;
            if (pPrecision) {
                if (pPrecision == ".*") {
                    var access = argumentnum++;
                    if (access >= arguments.length)
                        alert("sprintf:ERROR: not enough arguments 3");
                    precision = arguments[access];
                }
                else
                    precision = parseInt(pPrecision.substring(1), 10);
            }

            /*  determine how to fetch argument  */
            var access = argumentnum++;
            if (pAccess)
                access = parseInt(pAccess.substring(0, pAccess.length - 1), 10);
            if (access >= arguments.length)
                alert("sprintf:ERROR: not enough arguments 4");

            /*  dispatch into expansions according to type  */
            var prefix = "";
            switch (pType) {
                case 'd':
                case 'i':
                    subst = arguments[access];
                    if (typeof subst != "number")
                        subst = 0;
                    subst = subst.toString(10);
                    if (pFlags.indexOf('#') >= 0 && subst >= 0)
                        subst = "+" + subst;
                    if (pFlags.indexOf(' ') >= 0 && subst >= 0)
                        subst = " " + subst;
                    break;
                case 'o':
                    subst = arguments[access];
                    if (typeof subst != "number")
                        subst = 0;
                    subst = subst.toString(8);
                    break;
                case 'u':
                case 'l':
                case 'L':
                case 'n':
                case 'N':
                    subst = arguments[access];
                    if (typeof subst != "number")
                        subst = 0;
                    subst = Math.abs(subst);
                    subst = subst.toString(10);
                    break;
                case 'x':
                    subst = arguments[access];
                    if (typeof subst != "number")
                        subst = 0;
                    subst = subst.toString(16).toLowerCase();
                    if (pFlags.indexOf('#') >= 0)
                        prefix = "0x";
                    break;
                case 'X':
                    subst = arguments[access];
                    if (typeof subst != "number")
                        subst = 0;
                    subst = subst.toString(16).toUpperCase();
                    if (pFlags.indexOf('#') >= 0)
                        prefix = "0X";
                    break;
                case 'f':
                case 'F':
                case 'g':
                case 'G':
                    subst = arguments[access];
                    if (typeof subst != "number")
                        subst = 0.0;
                    subst = 0.0 + subst;
                    if (precision > -1) {
                        if (subst.toFixed)
                            subst = subst.toFixed(precision);
                        else {
                            subst = (Math.round(subst * Math.pow(10, precision)) / Math.pow(10, precision));
                            subst += "0000000000";
                            subst = subst.substr(0, subst.indexOf(".")+precision+1);
                        }
                    }
                    subst = '' + subst;
                    if (pFlags.indexOf("'") >= 0) {
                        var k = 0;
                        for (var i = (subst.length - 1) - 3; i >= 0; i -= 3) {
                            subst = subst.substring(0, i) + (k == 0 ? "." : ",") + subst.substring(i);
                            k = (k + 1) % 2;
                        }
                    }
                    subst = subst.replace('Infinity', 'inf');
                    subst = subst.replace('NaN', 'nan');
                    break;
                case 'c':
                    subst = arguments[access];
                    if (typeof subst != "number")
                        subst = 0;
                    subst = String.fromCharCode(subst);
                    break;
                case 's':
                    subst = arguments[access];
                    if (precision > -1)
                        subst = subst.substr(0, precision);
                    if (typeof subst != "string")
                        subst = "";
                    break;
            }

            /*  apply optional padding  */
            var padding = minLength - subst.toString().length - prefix.toString().length;
            if (padding > 0) {
                var arrTmp = new Array(padding + 1);
                if (justifyRight)
                    subst = arrTmp.join(padWith) + subst;
                else
                    subst = subst + arrTmp.join(padWith);
            }

            /*  add optional prefix  */
            subst = prefix + subst;
        }

        /*  update the processing queue  */
        done = done + pProlog + subst;
        todo = pEpilog;
    }
    return (done + todo);
};

/*@cc_on @if (@_win32 && @_jscript_version >= 5) if (!window.XMLHttpRequest)
window.XMLHttpRequest = function() { return new ActiveXObject('Microsoft.XMLHTTP') };
@end @*/
var oc$Pervasives$ =
  function () {
    var failwith$54 = _f(function (s$55) { throw $(Failure$19g, s$55); });
    var invalid_arg$56 = _f(function (s$57) { throw $(Invalid_argument$18g, s$57); });
    var Exit$58 = $("Pervasives.Exit");
    var min$66 = _f(function (x$67, y$68) { if (caml_lessequal(x$67, y$68)) return x$67; return y$68; });
    var max$69 = _f(function (x$70, y$71) { if (caml_greaterequal(x$70, y$71)) return x$70; return y$71; });
    var abs$87 = _f(function (x$88) { if (x$88 >= 0) return x$88; return -x$88; });
    var lnot$92 = _f(function (x$93) { return x$93 ^ -1; });
    var min_int$97 = 1 << (1 << 31 === 0 ? 30 : 62);
    var max_int$98 = min_int$97 - 1;
    var infinity$131 = caml_int64_float_of_bits("9218868437227405312");
    var neg_infinity$132 = caml_int64_float_of_bits("-4503599627370496");
    var nan$133 = caml_int64_float_of_bits("9218868437227405313");
    var max_float$134 = caml_int64_float_of_bits("9218868437227405311");
    var min_float$135 = caml_int64_float_of_bits("4503599627370496");
    var epsilon_float$136 = caml_int64_float_of_bits("4372995238176751616");
    var $5E$152 = _f(function (s1$153, s2$154) { return s1$153.toString() + s2$154.toString(); });
    var char_of_int$157 =
      _f(function (n$158) { if (n$158 < 0 || n$158 > 255) return __(invalid_arg$56, [ "char_of_int" ]); return n$158; });
    var string_of_bool$164 = _f(function (b$165) { if (b$165) return "true"; return "false"; });
    var bool_of_string$166 =
      _f(function (param$428) {
           if (!oc$$sneq(param$428, "false")) return 0;
           if (oc$$sneq(param$428, "true")) return __(invalid_arg$56, [ "bool_of_string" ]);
           return 1;
         });
    var string_of_int$167 = _f(function (n$168) { return caml_format_int("%d", n$168); });
    var String$171 = $();
    var valid_float_lexem$172 =
      _f(function (s$173) {
           var l$174 = s$173.length;
           var loop$175 =
             _f(function (i$176) {
                  if (i$176 >= l$174) return __($5E$152, [ s$173, "." ]);
                  var match$427 = oc$$srefs(s$173, i$176);
                  var $r58 = false;
                  r$58: {
                    {
                      if (!(match$427 >= 48)) { { if (!(match$427 !== 45)) { { $r58 = true; break r$58; } } return s$173; } }
                      if (!(match$427 >= 58)) { { $r58 = true; break r$58; } }
                      return s$173;
                    }
                  }
                  if ($r58) return __(loop$175, [ i$176 + 1 ]);
                });
           return __(loop$175, [ 0 ]);
         });
    var string_of_float$177 = _f(function (f$178) { return __(valid_float_lexem$172, [ oc$$sprintf("%.12g", f$178) ]); });
    var $40$180 =
      _f(function (l1$181, l2$182) { if (l1$181) return $(l1$181[0], _($40$180, [ l1$181[1], l2$182 ])); return l2$182; });
    var stdin$189 = caml_ml_open_descriptor_in(0);
    var stdout$190 = caml_ml_open_descriptor_out(1);
    var stderr$191 = caml_ml_open_descriptor_out(2);
    var open_out_gen$212 =
      _f(function (mode$213, perm$214, name$215) {
           return caml_ml_open_descriptor_out(caml_sys_open(name$215, mode$213, perm$214));
         });
    var open_out$216 = _f(function (name$217) { return __(open_out_gen$212, [ $(1, $(3, $(4, $(7, 0)))), 438, name$217 ]); });
    var open_out_bin$218 = _f(function (name$219) { return __(open_out_gen$212, [ $(1, $(3, $(4, $(6, 0)))), 438, name$219 ]); });
    var flush_all$222 =
      _f(function (param$424) {
           var iter$223 =
             _f(function (param$425) {
                  if (param$425) {
                    { try { caml_ml_flush(param$425[0]); } catch (exn$426) { } return __(iter$223, [ param$425[1] ]); }
                  }
                  return 0;
                });
           return __(iter$223, [ caml_ml_out_channels_list(0) ]);
         });
    var output_string$228 = _f(function (oc$229, s$230) { return caml_ml_output(oc$229, s$230, 0, s$230.length); });
    var output$231 =
      _f(function (oc$232, s$233, ofs$234, len$235) {
           if (ofs$234 < 0 || (len$235 < 0 || ofs$234 > s$233.length - len$235)) return __(invalid_arg$56, [ "output" ]);
           return caml_ml_output(oc$232, s$233, ofs$234, len$235);
         });
    var output_value$239 = _f(function (chan$240, v$241) { return caml_output_value(chan$240, v$241, 0); });
    var close_out$246 = _f(function (oc$247) { caml_ml_flush(oc$247); return caml_ml_close_channel(oc$247); });
    var close_out_noerr$248 =
      _f(function (oc$249) {
           try { caml_ml_flush(oc$249); } catch (exn$423) { }
           try { return caml_ml_close_channel(oc$249); } catch (exn$422) { return 0; }
         });
    var open_in_gen$251 =
      _f(function (mode$252, perm$253, name$254) {
           return caml_ml_open_descriptor_in(caml_sys_open(name$254, mode$252, perm$253));
         });
    var open_in$255 = _f(function (name$256) { return __(open_in_gen$251, [ $(0, $(7, 0)), 0, name$256 ]); });
    var open_in_bin$257 = _f(function (name$258) { return __(open_in_gen$251, [ $(0, $(6, 0)), 0, name$258 ]); });
    var input$261 =
      _f(function (ic$262, s$263, ofs$264, len$265) {
           if (ofs$264 < 0 || (len$265 < 0 || ofs$264 > s$263.length - len$265)) return __(invalid_arg$56, [ "input" ]);
           return caml_ml_input(ic$262, s$263, ofs$264, len$265);
         });
    var unsafe_really_input$266 =
      _f(function (ic$267, s$268, ofs$269, len$270) {
           if (len$270 <= 0) return 0;
           var r$271 = caml_ml_input(ic$267, s$268, ofs$269, len$270);
           if (r$271 === 0) throw $(End_of_file$22g);
           return __(unsafe_really_input$266, [ ic$267, s$268, ofs$269 + r$271, len$270 - r$271 ]);
         });
    var really_input$272 =
      _f(function (ic$273, s$274, ofs$275, len$276) {
           if (ofs$275 < 0 || (len$276 < 0 || ofs$275 > s$274.length - len$276)) return __(invalid_arg$56, [ "really_input" ]);
           return __(unsafe_really_input$266, [ ic$273, s$274, ofs$275, len$276 ]);
         });
    var input_line$278 =
      _f(function (chan$279) {
           var build_result$280 =
             _f(function (buf$281, pos$282, param$421) {
                  if (param$421) {
                    {
                      var hd$283 = param$421[0];
                      var len$285 = hd$283.length;
                      caml_blit_string(hd$283, 0, buf$281, pos$282 - len$285, len$285);
                      return __(build_result$280, [ buf$281, pos$282 - len$285, param$421[1] ]);
                    }
                  }
                  return buf$281;
                });
           var scan$286 =
             _f(function (accu$287, len$288) {
                  var n$289 = caml_ml_input_scan_line(chan$279);
                  if (!(n$289 === 0)) {
                    {
                      if (n$289 > 0) {
                        {
                          var res$290 = oc$$cms(n$289 - 1);
                          caml_ml_input(chan$279, res$290, 0, n$289 - 1);
                          caml_ml_input_char(chan$279);
                          if (accu$287) {
                            {
                              var len$291 = len$288 + n$289 - 1;
                              return __(build_result$280, [ oc$$cms(len$291), len$291, $(res$290, accu$287) ]);
                            }
                          }
                          return res$290;
                        }
                      }
                      var beg$292 = oc$$cms(-n$289);
                      caml_ml_input(chan$279, beg$292, 0, -n$289);
                      return __(scan$286, [ $(beg$292, accu$287), len$288 - n$289 ]);
                    }
                  }
                  if (accu$287) return __(build_result$280, [ oc$$cms(len$288), len$288, accu$287 ]);
                  throw $(End_of_file$22g);
                });
           return __(scan$286, [ 0, 0 ]);
         });
    var close_in_noerr$300 = _f(function (ic$301) { try { return caml_ml_close_channel(ic$301); } catch (exn$420) { return 0; } });
    var print_char$303 = _f(function (c$304) { return caml_ml_output_char(stdout$190, c$304); });
    var print_string$305 = _f(function (s$306) { return __(output_string$228, [ stdout$190, s$306 ]); });
    var print_int$307 = _f(function (i$308) { return __(output_string$228, [ stdout$190, _(string_of_int$167, [ i$308 ]) ]); });
    var print_float$309 =
      _f(function (f$310) { return __(output_string$228, [ stdout$190, _(string_of_float$177, [ f$310 ]) ]); });
    var print_endline$311 =
      _f(function (s$312) {
           _(output_string$228, [ stdout$190, s$312 ]);
           caml_ml_output_char(stdout$190, 10);
           return caml_ml_flush(stdout$190);
         });
    var print_newline$313 = _f(function (param$419) { caml_ml_output_char(stdout$190, 10); return caml_ml_flush(stdout$190); });
    var prerr_char$314 = _f(function (c$315) { return caml_ml_output_char(stderr$191, c$315); });
    var prerr_string$316 = _f(function (s$317) { return __(output_string$228, [ stderr$191, s$317 ]); });
    var prerr_int$318 = _f(function (i$319) { return __(output_string$228, [ stderr$191, _(string_of_int$167, [ i$319 ]) ]); });
    var prerr_float$320 =
      _f(function (f$321) { return __(output_string$228, [ stderr$191, _(string_of_float$177, [ f$321 ]) ]); });
    var prerr_endline$322 =
      _f(function (s$323) {
           _(output_string$228, [ stderr$191, s$323 ]);
           caml_ml_output_char(stderr$191, 10);
           return caml_ml_flush(stderr$191);
         });
    var prerr_newline$324 = _f(function (param$418) { caml_ml_output_char(stderr$191, 10); return caml_ml_flush(stderr$191); });
    var read_line$325 = _f(function (param$417) { caml_ml_flush(stdout$190); return __(input_line$278, [ stdin$189 ]); });
    var read_int$326 = _f(function (param$416) { return caml_int_of_string(_(read_line$325, [ 0 ])); });
    var read_float$327 = _f(function (param$415) { return caml_float_of_string(_(read_line$325, [ 0 ])); });
    var LargeFile$334 = $();
    var $5E$5E$349 = _f(function (fmt1$350, fmt2$351) { return _($5E$152, [ fmt1$350, _($5E$152, [ "%,", fmt2$351 ]) ]); });
    var string_of_format$352 =
      _f(function (fmt$353) {
           var s$354 = fmt$353;
           var l$355 = s$354.length;
           var r$356 = oc$$cms(l$355);
           caml_blit_string(s$354, 0, r$356, 0, l$355);
           return r$356;
         });
    var exit_function$358 = $(flush_all$222);
    var at_exit$359 =
      _f(function (f$360) {
           var g$361 = exit_function$358[0];
           return exit_function$358[0] = _f(function (param$414) { _(f$360, [ 0 ]); return __(g$361, [ 0 ]); });
         });
    var do_at_exit$362 = _f(function (param$413) { return __(exit_function$358[0], [ 0 ]); });
    var exit$363 = _f(function (retcode$364) { _(do_at_exit$362, [ 0 ]); return caml_sys_exit(retcode$364); });
    caml_register_named_value("Pervasives.do_at_exit", do_at_exit$362);
    return $(invalid_arg$56, failwith$54, Exit$58, min$66, max$69, abs$87, max_int$98, min_int$97, lnot$92, infinity$131,
             neg_infinity$132, nan$133, max_float$134, min_float$135, epsilon_float$136, $5E$152, char_of_int$157,
             string_of_bool$164, bool_of_string$166, string_of_int$167, string_of_float$177, $40$180, stdin$189, stdout$190,
             stderr$191, print_char$303, print_string$305, print_int$307, print_float$309, print_endline$311, print_newline$313,
             prerr_char$314, prerr_string$316, prerr_int$318, prerr_float$320, prerr_endline$322, prerr_newline$324, read_line$325,
             read_int$326, read_float$327, open_out$216, open_out_bin$218, open_out_gen$212,
             _f(function (prim$381) { return caml_ml_flush(prim$381); }), flush_all$222,
             _f(function (prim$383, prim$382) { return caml_ml_output_char(prim$383, prim$382); }), output_string$228, output$231,
             _f(function (prim$385, prim$384) { return caml_ml_output_char(prim$385, prim$384); }),
             _f(function (prim$387, prim$386) { return caml_ml_output_int(prim$387, prim$386); }), output_value$239,
             _f(function (prim$389, prim$388) { return caml_ml_seek_out(prim$389, prim$388); }),
             _f(function (prim$390) { return caml_ml_pos_out(prim$390); }),
             _f(function (prim$391) { return caml_ml_channel_size(prim$391); }), close_out$246, close_out_noerr$248,
             _f(function (prim$393, prim$392) { return caml_ml_set_binary_mode(prim$393, prim$392); }), open_in$255,
             open_in_bin$257, open_in_gen$251, _f(function (prim$394) { return caml_ml_input_char(prim$394); }), input_line$278,
             input$261, really_input$272, _f(function (prim$395) { return caml_ml_input_char(prim$395); }),
             _f(function (prim$396) { return caml_ml_input_int(prim$396); }),
             _f(function (prim$397) { return caml_input_value(prim$397); }),
             _f(function (prim$399, prim$398) { return caml_ml_seek_in(prim$399, prim$398); }),
             _f(function (prim$400) { return caml_ml_pos_in(prim$400); }),
             _f(function (prim$401) { return caml_ml_channel_size(prim$401); }),
             _f(function (prim$402) { return caml_ml_close_channel(prim$402); }), close_in_noerr$300,
             _f(function (prim$404, prim$403) { return caml_ml_set_binary_mode(prim$404, prim$403); }),
             $(_f(function (prim$406, prim$405) { return caml_ml_seek_out_64(prim$406, prim$405); }),
               _f(function (prim$407) { return caml_ml_pos_out_64(prim$407); }),
               _f(function (prim$408) { return caml_ml_channel_size_64(prim$408); }),
               _f(function (prim$410, prim$409) { return caml_ml_seek_in_64(prim$410, prim$409); }),
               _f(function (prim$411) { return caml_ml_pos_in_64(prim$411); }),
               _f(function (prim$412) { return caml_ml_channel_size_64(prim$412); })), string_of_format$352, $5E$5E$349, exit$363,
             at_exit$359, valid_float_lexem$172, unsafe_really_input$266, do_at_exit$362);
  }();
var oc$Array$ =
  function () {
    var init$65 =
      _f(function (l$66, f$67) {
           if (l$66 === 0) return $();
           var res$68 = caml_make_vect(l$66, _(f$67, [ 0 ]));
           var i$69;
           for (i$69 = 1; i$69 <= -1 + l$66; i$69++) { (function (i$69) { res$68[i$69] = _(f$67, [ i$69 ]); }(i$69)); }
           return res$68;
         });
    var make_matrix$70 =
      _f(function (sx$71, sy$72, init$73) {
           var res$74 = caml_make_vect(sx$71, $());
           var x$75;
           for (x$75 = 0; x$75 <= -1 + sx$71; x$75++) {
             (function (x$75) { res$74[x$75] = caml_make_vect(sy$72, init$73); }(x$75));
           }
           return res$74;
         });
    var copy$77 =
      _f(function (a$78) {
           var l$79 = a$78.length;
           if (l$79 === 0) return $();
           var res$80 = caml_make_vect(l$79, a$78[0]);
           var i$81;
           for (i$81 = 1; i$81 <= -1 + l$79; i$81++) { (function (i$81) { res$80[i$81] = a$78[i$81]; }(i$81)); }
           return res$80;
         });
    var append$82 =
      _f(function (a1$83, a2$84) {
           var l1$85 = a1$83.length;
           var l2$86 = a2$84.length;
           if (l1$85 === 0 && l2$86 === 0) return $();
           var r$87 = caml_make_vect(l1$85 + l2$86, (l1$85 > 0 ? a1$83 : a2$84)[0]);
           var i$88;
           for (i$88 = 0; i$88 <= l1$85 - 1; i$88++) { (function (i$88) { r$87[i$88] = a1$83[i$88]; }(i$88)); }
           var i$89;
           for (i$89 = 0; i$89 <= l2$86 - 1; i$89++) { (function (i$89) { r$87[i$89 + l1$85] = a2$84[i$89]; }(i$89)); }
           return r$87;
         });
    var concat_aux$90 =
      _f(function (init$91, al$92) {
           var size$93 =
             _f(function (accu$94, param$262) {
                  if (param$262) return __(size$93, [ accu$94 + (param$262[0]).length, param$262[1] ]);
                  return accu$94;
                });
           var res$97 = caml_make_vect(_(size$93, [ 0, al$92 ]), init$91);
           var fill$98 =
             _f(function (pos$99, param$261) {
                  if (param$261) {
                    {
                      var h$100 = param$261[0];
                      var i$102;
                      for (i$102 = 0; i$102 <= h$100.length - 1; i$102++) {
                        (function (i$102) { res$97[pos$99 + i$102] = h$100[i$102]; }(i$102));
                      }
                      return __(fill$98, [ pos$99 + h$100.length, param$261[1] ]);
                    }
                  }
                  return 0;
                });
           _(fill$98, [ 0, al$92 ]);
           return res$97;
         });
    var concat$103 =
      _f(function (al$104) {
           var find_init$105 =
             _f(function (param$260) {
                  if (param$260) {
                    {
                      var a$106 = param$260[0];
                      if (a$106.length > 0) return __(concat_aux$90, [ a$106[0], al$104 ]);
                      return __(find_init$105, [ param$260[1] ]);
                    }
                  }
                  return $();
                });
           return __(find_init$105, [ al$104 ]);
         });
    var sub$108 =
      _f(function (a$109, ofs$110, len$111) {
           if (ofs$110 < 0 || (len$111 < 0 || ofs$110 > a$109.length - len$111)) return __(oc$Pervasives$[0], [ "Array.sub" ]);
           if (len$111 === 0) return $();
           var r$112 = caml_make_vect(len$111, a$109[ofs$110]);
           var i$113;
           for (i$113 = 1; i$113 <= len$111 - 1; i$113++) { (function (i$113) { r$112[i$113] = a$109[ofs$110 + i$113]; }(i$113)); }
           return r$112;
         });
    var fill$114 =
      _f(function (a$115, ofs$116, len$117, v$118) {
           if (ofs$116 < 0 || (len$117 < 0 || ofs$116 > a$115.length - len$117)) return __(oc$Pervasives$[0], [ "Array.fill" ]);
           var i$119;
           for (i$119 = ofs$116; i$119 <= ofs$116 + len$117 - 1; i$119++) { (function (i$119) { a$115[i$119] = v$118; }(i$119)); }
         });
    var blit$120 =
      _f(function (a1$121, ofs1$122, a2$123, ofs2$124, len$125) {
           if (len$125 < 0 ||
                 (ofs1$122 < 0 || (ofs1$122 > a1$121.length - len$125 || (ofs2$124 < 0 || ofs2$124 > a2$123.length - len$125))))
             return __(oc$Pervasives$[0], [ "Array.blit" ]);
           if (ofs1$122 < ofs2$124) {
             {
               var i$126;
               for (i$126 = len$125 - 1; i$126 >= 0; i$126--) {
                 (function (i$126) { a2$123[ofs2$124 + i$126] = a1$121[ofs1$122 + i$126]; }(i$126));
               }
             }
           }
           var i$127;
           for (i$127 = 0; i$127 <= len$125 - 1; i$127++) {
             (function (i$127) { a2$123[ofs2$124 + i$127] = a1$121[ofs1$122 + i$127]; }(i$127));
           }
         });
    var iter$128 =
      _f(function (f$129, a$130) {
           var i$131;
           for (i$131 = 0; i$131 <= a$130.length - 1; i$131++) { (function (i$131) { _(f$129, [ a$130[i$131] ]); }(i$131)); }
         });
    var map$132 =
      _f(function (f$133, a$134) {
           var l$135 = a$134.length;
           if (l$135 === 0) return $();
           var r$136 = caml_make_vect(l$135, _(f$133, [ a$134[0] ]));
           var i$137;
           for (i$137 = 1; i$137 <= l$135 - 1; i$137++) {
             (function (i$137) { r$136[i$137] = _(f$133, [ a$134[i$137] ]); }(i$137));
           }
           return r$136;
         });
    var iteri$138 =
      _f(function (f$139, a$140) {
           var i$141;
           for (i$141 = 0; i$141 <= a$140.length - 1; i$141++) {
             (function (i$141) { _(f$139, [ i$141, a$140[i$141] ]); }(i$141));
           }
         });
    var mapi$142 =
      _f(function (f$143, a$144) {
           var l$145 = a$144.length;
           if (l$145 === 0) return $();
           var r$146 = caml_make_vect(l$145, _(f$143, [ 0, a$144[0] ]));
           var i$147;
           for (i$147 = 1; i$147 <= l$145 - 1; i$147++) {
             (function (i$147) { r$146[i$147] = _(f$143, [ i$147, a$144[i$147] ]); }(i$147));
           }
           return r$146;
         });
    var to_list$148 =
      _f(function (a$149) {
           var tolist$150 =
             _f(function (i$151, res$152) {
                  if (i$151 < 0) return res$152;
                  return __(tolist$150, [ i$151 - 1, $(a$149[i$151], res$152) ]);
                });
           return __(tolist$150, [ a$149.length - 1, 0 ]);
         });
    var list_length$153 =
      _f(function (accu$154, param$259) {
           if (param$259) return __(list_length$153, [ 1 + accu$154, param$259[1] ]);
           return accu$154;
         });
    var of_list$157 =
      _f(function (l$160) {
           if (l$160) {
             {
               var a$161 = caml_make_vect(_(list_length$153, [ 0, l$160 ]), l$160[0]);
               var fill$162 =
                 _f(function (i$163, param$258) {
                      if (param$258) { { a$161[i$163] = param$258[0]; return __(fill$162, [ i$163 + 1, param$258[1] ]); } }
                      return a$161;
                    });
               return __(fill$162, [ 1, l$160[1] ]);
             }
           }
           return $();
         });
    var fold_left$166 =
      _f(function (f$167, x$168, a$169) {
           var r$170 = x$168;
           var i$171;
           for (i$171 = 0; i$171 <= a$169.length - 1; i$171++) {
             (function (i$171) { r$170 = _(f$167, [ r$170, a$169[i$171] ]); }(i$171));
           }
           return r$170;
         });
    var fold_right$172 =
      _f(function (f$173, a$174, x$175) {
           var r$176 = x$175;
           var i$177;
           for (i$177 = a$174.length - 1; i$177 >= 0; i$177--) {
             (function (i$177) { r$176 = _(f$173, [ a$174[i$177], r$176 ]); }(i$177));
           }
           return r$176;
         });
    var Bottom$178 = $("Array.Bottom");
    var sort$179 =
      _f(function (cmp$180, a$181) {
           var maxson$182 =
             _f(function (l$183, i$184) {
                  var i31$185 = i$184 + i$184 + i$184 + 1;
                  var x$186 = i31$185;
                  if (i31$185 + 2 < l$183) {
                    {
                      if (_(cmp$180, [ oc$$arefs(a$181, i31$185), oc$$arefs(a$181, i31$185 + 1) ]) < 0) x$186 = i31$185 + 1; else;
                      if (_(cmp$180, [ oc$$arefs(a$181, x$186), oc$$arefs(a$181, i31$185 + 2) ]) < 0) x$186 = i31$185 + 2; else;
                      return x$186;
                    }
                  }
                  if (i31$185 + 1 < l$183 && _(cmp$180, [ oc$$arefs(a$181, i31$185), oc$$arefs(a$181, i31$185 + 1) ]) < 0)
                    return i31$185 + 1;
                  if (i31$185 < l$183) return i31$185;
                  throw $(Bottom$178, i$184);
                });
           var trickledown$187 =
             _f(function (l$188, i$189, e$190) {
                  var j$191 = _(maxson$182, [ l$188, i$189 ]);
                  if (_(cmp$180, [ oc$$arefs(a$181, j$191), e$190 ]) > 0) {
                    { oc$$asets(a$181, i$189, oc$$arefs(a$181, j$191)); return __(trickledown$187, [ l$188, j$191, e$190 ]); }
                  }
                  return oc$$asets(a$181, i$189, e$190);
                });
           var trickle$192 =
             _f(function (l$193, i$194, e$195) {
                  try {
                    return _(trickledown$187, [ l$193, i$194, e$195 ]);
                  }
                  catch (exn$257) {
                    if (exn$257[0] === Bottom$178) return oc$$asets(a$181, exn$257[1], e$195);
                    throw exn$257;
                  }
                });
           var bubbledown$197 =
             _f(function (l$198, i$199) {
                  var j$200 = _(maxson$182, [ l$198, i$199 ]);
                  oc$$asets(a$181, i$199, oc$$arefs(a$181, j$200));
                  return __(bubbledown$197, [ l$198, j$200 ]);
                });
           var bubble$201 =
             _f(function (l$202, i$203) {
                  try {
                    return _(bubbledown$197, [ l$202, i$203 ]);
                  }
                  catch (exn$256) {
                    if (exn$256[0] === Bottom$178) return exn$256[1];
                    throw exn$256;
                  }
                });
           var trickleup$205 =
             _f(function (i$206, e$207) {
                  var father$208 = (i$206 - 1) / 3 >> 0;
                  if (i$206 !== father$208); else throw $(Assert_failure$26g, $("ocaml/stdlib/array.ml", 208, 4));
                  if (_(cmp$180, [ oc$$arefs(a$181, father$208), e$207 ]) < 0) {
                    {
                      oc$$asets(a$181, i$206, oc$$arefs(a$181, father$208));
                      if (father$208 > 0) return __(trickleup$205, [ father$208, e$207 ]);
                      return oc$$asets(a$181, 0, e$207);
                    }
                  }
                  return oc$$asets(a$181, i$206, e$207);
                });
           var l$209 = a$181.length;
           var i$210;
           for (i$210 = ((l$209 + 1) / 3 >> 0) - 1; i$210 >= 0; i$210--) {
             (function (i$210) { _(trickle$192, [ l$209, i$210, oc$$arefs(a$181, i$210) ]); }(i$210));
           }
           var i$211;
           for (i$211 = l$209 - 1; i$211 >= 2; i$211--) {
             (function (i$211) {
                var e$212 = oc$$arefs(a$181, i$211);
                oc$$asets(a$181, i$211, oc$$arefs(a$181, 0));
                _(trickleup$205, [ _(bubble$201, [ i$211, 0 ]), e$212 ]);
              }(i$211));
           }
           if (l$209 > 1) {
             { var e$213 = oc$$arefs(a$181, 1); oc$$asets(a$181, 1, oc$$arefs(a$181, 0)); return oc$$asets(a$181, 0, e$213); }
           }
           return 0;
         });
    var cutoff$214 = 5;
    var stable_sort$215 =
      _f(function (cmp$216, a$217) {
           var merge$218 =
             _f(function (src1ofs$219, src1len$220, src2$221, src2ofs$222, src2len$223, dst$224, dstofs$225) {
                  var src1r$226 = src1ofs$219 + src1len$220;
                  var src2r$227 = src2ofs$222 + src2len$223;
                  var loop$228 =
                    _f(function (i1$229, s1$230, i2$231, s2$232, d$233) {
                         if (_(cmp$216, [ s1$230, s2$232 ]) <= 0) {
                           {
                             oc$$asets(dst$224, d$233, s1$230);
                             var i1$234 = i1$229 + 1;
                             if (i1$234 < src1r$226)
                               return __(loop$228, [ i1$234, oc$$arefs(a$217, i1$234), i2$231, s2$232, d$233 + 1 ]);
                             return __(blit$120, [ src2$221, i2$231, dst$224, d$233 + 1, src2r$227 - i2$231 ]);
                           }
                         }
                         oc$$asets(dst$224, d$233, s2$232);
                         var i2$235 = i2$231 + 1;
                         if (i2$235 < src2r$227)
                           return __(loop$228, [ i1$229, s1$230, i2$235, oc$$arefs(src2$221, i2$235), d$233 + 1 ]);
                         return __(blit$120, [ a$217, i1$229, dst$224, d$233 + 1, src1r$226 - i1$229 ]);
                       });
                  return __(loop$228,
                            [
                              src1ofs$219,
                              oc$$arefs(a$217, src1ofs$219),
                              src2ofs$222,
                              oc$$arefs(src2$221, src2ofs$222),
                              dstofs$225
                            ]);
                });
           var isortto$236 =
             _f(function (srcofs$237, dst$238, dstofs$239, len$240) {
                  var i$241;
                  for (i$241 = 0; i$241 <= len$240 - 1; i$241++) {
                    (function (i$241) {
                       var e$242 = oc$$arefs(a$217, srcofs$237 + i$241);
                       var j$243 = dstofs$239 + i$241 - 1;
                       while (j$243 >= dstofs$239 && _(cmp$216, [ oc$$arefs(dst$238, j$243), e$242 ]) > 0) {
                         { oc$$asets(dst$238, j$243 + 1, oc$$arefs(dst$238, j$243)); j$243 = -1 + j$243; }
                       }
                       oc$$asets(dst$238, j$243 + 1, e$242);
                     }(i$241));
                  }
                });
           var sortto$244 =
             _f(function (srcofs$245, dst$246, dstofs$247, len$248) {
                  if (len$248 <= cutoff$214) return __(isortto$236, [ srcofs$245, dst$246, dstofs$247, len$248 ]);
                  var l1$249 = len$248 / 2 >> 0;
                  var l2$250 = len$248 - l1$249;
                  _(sortto$244, [ srcofs$245 + l1$249, dst$246, dstofs$247 + l1$249, l2$250 ]);
                  _(sortto$244, [ srcofs$245, a$217, srcofs$245 + l2$250, l1$249 ]);
                  return __(merge$218, [ srcofs$245 + l2$250, l1$249, dst$246, dstofs$247 + l1$249, l2$250, dst$246, dstofs$247 ]);
                });
           var l$251 = a$217.length;
           if (l$251 <= cutoff$214) return __(isortto$236, [ 0, a$217, 0, l$251 ]);
           var l1$252 = l$251 / 2 >> 0;
           var l2$253 = l$251 - l1$252;
           var t$254 = caml_make_vect(l2$253, oc$$arefs(a$217, 0));
           _(sortto$244, [ l1$252, t$254, 0, l2$253 ]);
           _(sortto$244, [ 0, a$217, l2$253, l1$252 ]);
           return __(merge$218, [ l2$253, l1$252, t$254, 0, l2$253, a$217, 0 ]);
         });
    return $(init$65, make_matrix$70, make_matrix$70, append$82, concat$103, sub$108, copy$77, fill$114, blit$120, to_list$148,
             of_list$157, iter$128, map$132, iteri$138, mapi$142, fold_left$166, fold_right$172, sort$179, stable_sort$215,
             stable_sort$215);
  }();
var oc$List$ =
  function () {
    var length_aux$58 =
      _f(function (len$59, param$394) { if (param$394) return __(length_aux$58, [ len$59 + 1, param$394[1] ]); return len$59; });
    var length$62 = _f(function (l$63) { return __(length_aux$58, [ 0, l$63 ]); });
    var hd$64 = _f(function (param$393) { if (param$393) return param$393[0]; return __(oc$Pervasives$[1], [ "hd" ]); });
    var tl$67 = _f(function (param$392) { if (param$392) return param$392[1]; return __(oc$Pervasives$[1], [ "tl" ]); });
    var nth$70 =
      _f(function (l$71, n$72) {
           if (n$72 < 0) return __(oc$Pervasives$[0], [ "List.nth" ]);
           var nth_aux$73 =
             _f(function (l$74, n$75) {
                  if (!l$74) return __(oc$Pervasives$[1], [ "nth" ]);
                  if (n$75 === 0) return l$74[0];
                  return __(nth_aux$73, [ l$74[1], n$75 - 1 ]);
                });
           return __(nth_aux$73, [ l$71, n$72 ]);
         });
    var append$78 = oc$Pervasives$[21];
    var rev_append$79 =
      _f(function (l1$80, l2$81) { if (l1$80) return __(rev_append$79, [ l1$80[1], $(l1$80[0], l2$81) ]); return l2$81; });
    var rev$84 = _f(function (l$85) { return __(rev_append$79, [ l$85, 0 ]); });
    var flatten$86 =
      _f(function (param$391) {
           if (param$391) return __(oc$Pervasives$[21], [ param$391[0], _(flatten$86, [ param$391[1] ]) ]);
           return 0;
         });
    var map$90 =
      _f(function (f$91, param$390) {
           if (param$390) { { var r$94 = _(f$91, [ param$390[0] ]); return $(r$94, _(map$90, [ f$91, param$390[1] ])); } }
           return 0;
         });
    var rev_map$95 =
      _f(function (f$96, l$97) {
           var rmap_f$98 =
             _f(function (accu$99, param$389) {
                  if (param$389) return __(rmap_f$98, [ $(_(f$96, [ param$389[0] ]), accu$99), param$389[1] ]);
                  return accu$99;
                });
           return __(rmap_f$98, [ 0, l$97 ]);
         });
    var iter$102 =
      _f(function (f$103, param$388) {
           if (param$388) { { _(f$103, [ param$388[0] ]); return __(iter$102, [ f$103, param$388[1] ]); } }
           return 0;
         });
    var fold_left$106 =
      _f(function (f$107, accu$108, l$109) {
           if (l$109) return __(fold_left$106, [ f$107, _(f$107, [ accu$108, l$109[0] ]), l$109[1] ]);
           return accu$108;
         });
    var fold_right$112 =
      _f(function (f$113, l$114, accu$115) {
           if (l$114) return __(f$113, [ l$114[0], _(fold_right$112, [ f$113, l$114[1], accu$115 ]) ]);
           return accu$115;
         });
    var map2$118 =
      _f(function (f$119, l1$120, l2$121) {
           var $r34 = false;
           r$34: {
             {
               if (!l1$120) { { if (l2$121) { { $r34 = true; break r$34; } } return 0; } }
               if (!l2$121) { { $r34 = true; break r$34; } }
               var r$126 = _(f$119, [ l1$120[0], l2$121[0] ]);
               return $(r$126, _(map2$118, [ f$119, l1$120[1], l2$121[1] ]));
             }
           }
           if ($r34) return __(oc$Pervasives$[0], [ "List.map2" ]);
         });
    var rev_map2$127 =
      _f(function (f$128, l1$129, l2$130) {
           var rmap2_f$131 =
             _f(function (accu$132, l1$133, l2$134) {
                  var $r31 = false;
                  r$31: {
                    {
                      if (!l1$133) { { if (l2$134) { { $r31 = true; break r$31; } } return accu$132; } }
                      if (!l2$134) { { $r31 = true; break r$31; } }
                      return __(rmap2_f$131, [ $(_(f$128, [ l1$133[0], l2$134[0] ]), accu$132), l1$133[1], l2$134[1] ]);
                    }
                  }
                  if ($r31) return __(oc$Pervasives$[0], [ "List.rev_map2" ]);
                });
           return __(rmap2_f$131, [ 0, l1$129, l2$130 ]);
         });
    var iter2$139 =
      _f(function (f$140, l1$141, l2$142) {
           var $r30 = false;
           r$30: {
             {
               if (!l1$141) { { if (l2$142) { { $r30 = true; break r$30; } } return 0; } }
               if (!l2$142) { { $r30 = true; break r$30; } }
               _(f$140, [ l1$141[0], l2$142[0] ]);
               return __(iter2$139, [ f$140, l1$141[1], l2$142[1] ]);
             }
           }
           if ($r30) return __(oc$Pervasives$[0], [ "List.iter2" ]);
         });
    var fold_left2$147 =
      _f(function (f$148, accu$149, l1$150, l2$151) {
           var $r29 = false;
           r$29: {
             {
               if (!l1$150) { { if (l2$151) { { $r29 = true; break r$29; } } return accu$149; } }
               if (!l2$151) { { $r29 = true; break r$29; } }
               return __(fold_left2$147, [ f$148, _(f$148, [ accu$149, l1$150[0], l2$151[0] ]), l1$150[1], l2$151[1] ]);
             }
           }
           if ($r29) return __(oc$Pervasives$[0], [ "List.fold_left2" ]);
         });
    var fold_right2$156 =
      _f(function (f$157, l1$158, l2$159, accu$160) {
           var $r28 = false;
           r$28: {
             {
               if (!l1$158) { { if (l2$159) { { $r28 = true; break r$28; } } return accu$160; } }
               if (!l2$159) { { $r28 = true; break r$28; } }
               return __(f$157, [ l1$158[0], l2$159[0], _(fold_right2$156, [ f$157, l1$158[1], l2$159[1], accu$160 ]) ]);
             }
           }
           if ($r28) return __(oc$Pervasives$[0], [ "List.fold_right2" ]);
         });
    var for_all$165 =
      _f(function (p$166, param$377) {
           if (param$377) return _(p$166, [ param$377[0] ]) && _(for_all$165, [ p$166, param$377[1] ]);
           return 1;
         });
    var exists$169 =
      _f(function (p$170, param$376) {
           if (param$376) return _(p$170, [ param$376[0] ]) || _(exists$169, [ p$170, param$376[1] ]);
           return 0;
         });
    var for_all2$173 =
      _f(function (p$174, l1$175, l2$176) {
           var $r27 = false;
           r$27: {
             {
               if (!l1$175) { { if (l2$176) { { $r27 = true; break r$27; } } return 1; } }
               if (!l2$176) { { $r27 = true; break r$27; } }
               return _(p$174, [ l1$175[0], l2$176[0] ]) && _(for_all2$173, [ p$174, l1$175[1], l2$176[1] ]);
             }
           }
           if ($r27) return __(oc$Pervasives$[0], [ "List.for_all2" ]);
         });
    var exists2$181 =
      _f(function (p$182, l1$183, l2$184) {
           var $r26 = false;
           r$26: {
             {
               if (!l1$183) { { if (l2$184) { { $r26 = true; break r$26; } } return 0; } }
               if (!l2$184) { { $r26 = true; break r$26; } }
               return _(p$182, [ l1$183[0], l2$184[0] ]) || _(exists2$181, [ p$182, l1$183[1], l2$184[1] ]);
             }
           }
           if ($r26) return __(oc$Pervasives$[0], [ "List.exists2" ]);
         });
    var mem$189 =
      _f(function (x$190, param$371) {
           if (param$371) return caml_compare(param$371[0], x$190) === 0 || _(mem$189, [ x$190, param$371[1] ]);
           return 0;
         });
    var memq$193 =
      _f(function (x$194, param$370) {
           if (param$370) return param$370[0] === x$194 || _(memq$193, [ x$194, param$370[1] ]);
           return 0;
         });
    var assoc$197 =
      _f(function (x$198, param$368) {
           if (param$368) {
             {
               var match$369 = param$368[0];
               if (caml_compare(match$369[0], x$198) === 0) return match$369[1];
               return __(assoc$197, [ x$198, param$368[1] ]);
             }
           }
           throw $(Not_found$20g);
         });
    var assq$202 =
      _f(function (x$203, param$366) {
           if (param$366) {
             {
               var match$367 = param$366[0];
               if (match$367[0] === x$203) return match$367[1];
               return __(assq$202, [ x$203, param$366[1] ]);
             }
           }
           throw $(Not_found$20g);
         });
    var mem_assoc$207 =
      _f(function (x$208, param$364) {
           if (param$364) return caml_compare(param$364[0][0], x$208) === 0 || _(mem_assoc$207, [ x$208, param$364[1] ]);
           return 0;
         });
    var mem_assq$212 =
      _f(function (x$213, param$362) {
           if (param$362) return param$362[0][0] === x$213 || _(mem_assq$212, [ x$213, param$362[1] ]);
           return 0;
         });
    var remove_assoc$217 =
      _f(function (x$218, param$361) {
           if (param$361) {
             {
               var l$222 = param$361[1];
               var pair$221 = param$361[0];
               if (caml_compare(pair$221[0], x$218) === 0) return l$222;
               return $(pair$221, _(remove_assoc$217, [ x$218, l$222 ]));
             }
           }
           return 0;
         });
    var remove_assq$223 =
      _f(function (x$224, param$360) {
           if (param$360) {
             {
               var l$228 = param$360[1];
               var pair$227 = param$360[0];
               if (pair$227[0] === x$224) return l$228;
               return $(pair$227, _(remove_assq$223, [ x$224, l$228 ]));
             }
           }
           return 0;
         });
    var find$229 =
      _f(function (p$230, param$359) {
           if (param$359) {
             { var x$231 = param$359[0]; if (_(p$230, [ x$231 ])) return x$231; return __(find$229, [ p$230, param$359[1] ]); }
           }
           throw $(Not_found$20g);
         });
    var find_all$233 =
      _f(function (p$234) {
           var find$235 =
             _f(function (accu$236, param$358) {
                  if (param$358) {
                    {
                      var l$238 = param$358[1];
                      var x$237 = param$358[0];
                      if (_(p$234, [ x$237 ])) return __(find$235, [ $(x$237, accu$236), l$238 ]);
                      return __(find$235, [ accu$236, l$238 ]);
                    }
                  }
                  return __(rev$84, [ accu$236 ]);
                });
           return __(find$235, [ 0 ]);
         });
    var partition$240 =
      _f(function (p$241, l$242) {
           var part$243 =
             _f(function (yes$244, no$245, param$357) {
                  if (param$357) {
                    {
                      var l$247 = param$357[1];
                      var x$246 = param$357[0];
                      if (_(p$241, [ x$246 ])) return __(part$243, [ $(x$246, yes$244), no$245, l$247 ]);
                      return __(part$243, [ yes$244, $(x$246, no$245), l$247 ]);
                    }
                  }
                  return $(_(rev$84, [ yes$244 ]), _(rev$84, [ no$245 ]));
                });
           return __(part$243, [ 0, 0, l$242 ]);
         });
    var split$248 =
      _f(function (param$354) {
           if (param$354) {
             {
               var match$356 = param$354[0];
               var match$355 = _(split$248, [ param$354[1] ]);
               return $($(match$356[0], match$355[0]), $(match$356[1], match$355[1]));
             }
           }
           return $(0, 0);
         });
    var combine$254 =
      _f(function (l1$255, l2$256) {
           var $r21 = false;
           r$21: {
             {
               if (!l1$255) { { if (l2$256) { { $r21 = true; break r$21; } } return 0; } }
               if (!l2$256) { { $r21 = true; break r$21; } }
               return $($(l1$255[0], l2$256[0]), _(combine$254, [ l1$255[1], l2$256[1] ]));
             }
           }
           if ($r21) return __(oc$Pervasives$[0], [ "List.combine" ]);
         });
    var merge$261 =
      _f(function (cmp$262, l1$263, l2$264) {
           if (!l1$263) return l2$264;
           if (l2$264) {
             {
               var h2$269 = l2$264[0];
               var h1$267 = l1$263[0];
               if (_(cmp$262, [ h1$267, h2$269 ]) <= 0) return $(h1$267, _(merge$261, [ cmp$262, l1$263[1], l2$264 ]));
               return $(h2$269, _(merge$261, [ cmp$262, l1$263, l2$264[1] ]));
             }
           }
           return l1$263;
         });
    var chop$271 =
      _f(function (k$272, l$273) {
           if (k$272 === 0) return l$273;
           if (l$273) return __(chop$271, [ k$272 - 1, l$273[1] ]);
           throw $(Assert_failure$26g, $("ocaml/stdlib/list.ml", 213, 11));
         });
    var stable_sort$276 =
      _f(function (cmp$277, l$278) {
           var rev_merge$279 =
             _f(function (l1$280, l2$281, accu$282) {
                  if (!l1$280) return __(rev_append$79, [ l2$281, accu$282 ]);
                  if (l2$281) {
                    {
                      var h2$287 = l2$281[0];
                      var h1$285 = l1$280[0];
                      if (_(cmp$277, [ h1$285, h2$287 ]) <= 0)
                        return __(rev_merge$279, [ l1$280[1], l2$281, $(h1$285, accu$282) ]);
                      return __(rev_merge$279, [ l1$280, l2$281[1], $(h2$287, accu$282) ]);
                    }
                  }
                  return __(rev_append$79, [ l1$280, accu$282 ]);
                });
           var rev_merge_rev$289 =
             _f(function (l1$290, l2$291, accu$292) {
                  if (!l1$290) return __(rev_append$79, [ l2$291, accu$292 ]);
                  if (l2$291) {
                    {
                      var h2$297 = l2$291[0];
                      var h1$295 = l1$290[0];
                      if (_(cmp$277, [ h1$295, h2$297 ]) > 0)
                        return __(rev_merge_rev$289, [ l1$290[1], l2$291, $(h1$295, accu$292) ]);
                      return __(rev_merge_rev$289, [ l1$290, l2$291[1], $(h2$297, accu$292) ]);
                    }
                  }
                  return __(rev_append$79, [ l1$290, accu$292 ]);
                });
           var sort$299 =
             _f(function (n$301, l$302) {
                  var $r9 = false;
                  r$9: {
                    {
                      if (!(n$301 !== 2)) {
                        {
                          if (!l$302) { { $r9 = true; break r$9; } }
                          var match$334 = l$302[1];
                          if (!match$334) { { $r9 = true; break r$9; } }
                          var x2$304 = match$334[0];
                          var x1$303 = l$302[0];
                          if (_(cmp$277, [ x1$303, x2$304 ]) <= 0) return $(x1$303, $(x2$304, 0));
                          return $(x2$304, $(x1$303, 0));
                        }
                      }
                      if (n$301 !== 3) { { $r9 = true; break r$9; } }
                      if (!l$302) { { $r9 = true; break r$9; } }
                      var match$336 = l$302[1];
                      if (!match$336) { { $r9 = true; break r$9; } }
                      var match$337 = match$336[1];
                      if (!match$337) { { $r9 = true; break r$9; } }
                      var x3$307 = match$337[0];
                      var x2$306 = match$336[0];
                      var x1$305 = l$302[0];
                      if (!(_(cmp$277, [ x1$305, x2$306 ]) <= 0)) {
                        {
                          if (_(cmp$277, [ x1$305, x3$307 ]) <= 0) return $(x2$306, $(x1$305, $(x3$307, 0)));
                          if (_(cmp$277, [ x2$306, x3$307 ]) <= 0) return $(x2$306, $(x3$307, $(x1$305, 0)));
                          return $(x3$307, $(x2$306, $(x1$305, 0)));
                        }
                      }
                      if (_(cmp$277, [ x2$306, x3$307 ]) <= 0) return $(x1$305, $(x2$306, $(x3$307, 0)));
                      if (_(cmp$277, [ x1$305, x3$307 ]) <= 0) return $(x1$305, $(x3$307, $(x2$306, 0)));
                      return $(x3$307, $(x1$305, $(x2$306, 0)));
                    }
                  }
                  if ($r9) {
                    {
                      var n1$310 = n$301 >>> 1;
                      var n2$311 = n$301 - n1$310;
                      var l2$312 = _(chop$271, [ n1$310, l$302 ]);
                      var s1$313 = _(rev_sort$300, [ n1$310, l$302 ]);
                      var s2$314 = _(rev_sort$300, [ n2$311, l2$312 ]);
                      return __(rev_merge_rev$289, [ s1$313, s2$314, 0 ]);
                    }
                  }
                });
           var rev_sort$300 =
             _f(function (n$315, l$316) {
                  var $r15 = false;
                  r$15: {
                    {
                      if (!(n$315 !== 2)) {
                        {
                          if (!l$316) { { $r15 = true; break r$15; } }
                          var match$341 = l$316[1];
                          if (!match$341) { { $r15 = true; break r$15; } }
                          var x2$318 = match$341[0];
                          var x1$317 = l$316[0];
                          if (_(cmp$277, [ x1$317, x2$318 ]) > 0) return $(x1$317, $(x2$318, 0));
                          return $(x2$318, $(x1$317, 0));
                        }
                      }
                      if (n$315 !== 3) { { $r15 = true; break r$15; } }
                      if (!l$316) { { $r15 = true; break r$15; } }
                      var match$343 = l$316[1];
                      if (!match$343) { { $r15 = true; break r$15; } }
                      var match$344 = match$343[1];
                      if (!match$344) { { $r15 = true; break r$15; } }
                      var x3$321 = match$344[0];
                      var x2$320 = match$343[0];
                      var x1$319 = l$316[0];
                      if (!(_(cmp$277, [ x1$319, x2$320 ]) > 0)) {
                        {
                          if (_(cmp$277, [ x1$319, x3$321 ]) > 0) return $(x2$320, $(x1$319, $(x3$321, 0)));
                          if (_(cmp$277, [ x2$320, x3$321 ]) > 0) return $(x2$320, $(x3$321, $(x1$319, 0)));
                          return $(x3$321, $(x2$320, $(x1$319, 0)));
                        }
                      }
                      if (_(cmp$277, [ x2$320, x3$321 ]) > 0) return $(x1$319, $(x2$320, $(x3$321, 0)));
                      if (_(cmp$277, [ x1$319, x3$321 ]) > 0) return $(x1$319, $(x3$321, $(x2$320, 0)));
                      return $(x3$321, $(x1$319, $(x2$320, 0)));
                    }
                  }
                  if ($r15) {
                    {
                      var n1$324 = n$315 >>> 1;
                      var n2$325 = n$315 - n1$324;
                      var l2$326 = _(chop$271, [ n1$324, l$316 ]);
                      var s1$327 = _(sort$299, [ n1$324, l$316 ]);
                      var s2$328 = _(sort$299, [ n2$325, l2$326 ]);
                      return __(rev_merge$279, [ s1$327, s2$328, 0 ]);
                    }
                  }
                });
           var len$329 = _(length$62, [ l$278 ]);
           if (len$329 < 2) return l$278;
           return __(sort$299, [ len$329, l$278 ]);
         });
    return $(length$62, hd$64, tl$67, nth$70, rev$84, append$78, rev_append$79, flatten$86, flatten$86, iter$102, map$90,
             rev_map$95, fold_left$106, fold_right$112, iter2$139, map2$118, rev_map2$127, fold_left2$147, fold_right2$156,
             for_all$165, exists$169, for_all2$173, exists2$181, mem$189, memq$193, find$229, find_all$233, find_all$233,
             partition$240, assoc$197, assq$202, mem_assoc$207, mem_assq$212, remove_assoc$217, remove_assq$223, split$248,
             combine$254, stable_sort$276, stable_sort$276, stable_sort$276, merge$261);
  }();
var oc$Sys$ =
  function () {
    var match$118 = caml_sys_get_argv(0);
    var match$117 = caml_sys_get_config(0);
    var word_size$63 = match$117[1];
    var max_array_length$64 = (1 << word_size$63 - 10) - 1;
    var max_string_length$65 = (word_size$63 / 8 >> 0) * max_array_length$64 - 1;
    var interactive$76 = $(0);
    var set_signal$85 = _f(function (sig_num$86, sig_beh$87) { caml_install_signal_handler(sig_num$86, sig_beh$87); return 0; });
    var sigabrt$88 = -1;
    var sigalrm$89 = -2;
    var sigfpe$90 = -3;
    var sighup$91 = -4;
    var sigill$92 = -5;
    var sigint$93 = -6;
    var sigkill$94 = -7;
    var sigpipe$95 = -8;
    var sigquit$96 = -9;
    var sigsegv$97 = -10;
    var sigterm$98 = -11;
    var sigusr1$99 = -12;
    var sigusr2$100 = -13;
    var sigchld$101 = -14;
    var sigcont$102 = -15;
    var sigstop$103 = -16;
    var sigtstp$104 = -17;
    var sigttin$105 = -18;
    var sigttou$106 = -19;
    var sigvtalrm$107 = -20;
    var sigprof$108 = -21;
    var Break$109 = $("Sys.Break");
    var catch_break$110 =
      _f(function (on$111) {
           if (on$111) return __(set_signal$85, [ sigint$93, $(_f(function (param$116) { throw $(Break$109); })) ]);
           return __(set_signal$85, [ sigint$93, 0 ]);
         });
    var ocaml_version$112 = "3.11.2";
    return $(match$118[1], match$118[0], interactive$76, match$117[0], word_size$63, max_string_length$65, max_array_length$64,
             set_signal$85, sigabrt$88, sigalrm$89, sigfpe$90, sighup$91, sigill$92, sigint$93, sigkill$94, sigpipe$95, sigquit$96,
             sigsegv$97, sigterm$98, sigusr1$99, sigusr2$100, sigchld$101, sigcont$102, sigstop$103, sigtstp$104, sigttin$105,
             sigttou$106, sigvtalrm$107, sigprof$108, Break$109, catch_break$110, ocaml_version$112);
  }();
var oc$Hashtbl$ =
  function () {
    var hash$59 = _f(function (x$60) { return caml_hash_univ_param(10, 100, x$60); });
    var create$79 =
      _f(function (initial_size$80) {
           var s$81 = _(oc$Pervasives$[3], [ _(oc$Pervasives$[4], [ 1, initial_size$80 ]), oc$Sys$[6] ]);
           return $(0, caml_make_vect(s$81, 0));
         });
    var clear$82 =
      _f(function (h$83) {
           var i$84;
           for (i$84 = 0; i$84 <= (h$83[1]).length - 1; i$84++) { (function (i$84) { oc$$asets(h$83[1], i$84, 0); }(i$84)); }
           return h$83[0] = 0;
         });
    var copy$85 = _f(function (h$86) { return $(h$86[0], _(oc$Array$[6], [ h$86[1] ])); });
    var length$87 = _f(function (h$88) { return h$88[0]; });
    var resize$89 =
      _f(function (hashfun$90, tbl$91) {
           var odata$92 = tbl$91[1];
           var osize$93 = odata$92.length;
           var nsize$94 = _(oc$Pervasives$[3], [ 2 * osize$93 + 1, oc$Sys$[6] ]);
           if (nsize$94 !== osize$93) {
             {
               var ndata$95 = caml_make_vect(nsize$94, 0);
               var insert_bucket$96 =
                 _f(function (param$330) {
                      if (param$330) {
                        {
                          var key$97 = param$330[0];
                          _(insert_bucket$96, [ param$330[2] ]);
                          var nidx$100 = _(hashfun$90, [ key$97 ]) % nsize$94;
                          return oc$$asets(ndata$95, nidx$100, $(key$97, param$330[1], oc$$arefs(ndata$95, nidx$100)));
                        }
                      }
                      return 0;
                    });
               var i$101;
               for (i$101 = 0; i$101 <= osize$93 - 1; i$101++) {
                 (function (i$101) { _(insert_bucket$96, [ oc$$arefs(odata$92, i$101) ]); }(i$101));
               }
               return tbl$91[1] = ndata$95;
             }
           }
           return 0;
         });
    var add$102 =
      _f(function (h$103, key$104, info$105) {
           var i$106 = _(hash$59, [ key$104 ]) % (h$103[1]).length;
           var bucket$107 = $(key$104, info$105, oc$$arefs(h$103[1], i$106));
           oc$$asets(h$103[1], i$106, bucket$107);
           h$103[0] = 1 + h$103[0];
           if (h$103[0] > (h$103[1]).length << 1) return __(resize$89, [ hash$59, h$103 ]);
           return 0;
         });
    var remove$108 =
      _f(function (h$109, key$110) {
           var remove_bucket$111 =
             _f(function (param$329) {
                  if (param$329) {
                    {
                      var next$114 = param$329[2];
                      var k$112 = param$329[0];
                      if (caml_compare(k$112, key$110) === 0) { { h$109[0] = -1 + h$109[0]; return next$114; } }
                      return $(k$112, param$329[1], _(remove_bucket$111, [ next$114 ]));
                    }
                  }
                  return 0;
                });
           var i$115 = _(hash$59, [ key$110 ]) % (h$109[1]).length;
           return oc$$asets(h$109[1], i$115, _(remove_bucket$111, [ oc$$arefs(h$109[1], i$115) ]));
         });
    var find_rec$116 =
      _f(function (key$117, param$328) {
           if (!param$328) throw $(Not_found$20g);
           if (caml_compare(key$117, param$328[0]) === 0) return param$328[1];
           return __(find_rec$116, [ key$117, param$328[2] ]);
         });
    var find$121 =
      _f(function (h$122, key$123) {
           var match$327 = oc$$arefs(h$122[1], _(hash$59, [ key$123 ]) % (h$122[1]).length);
           if (!match$327) throw $(Not_found$20g);
           if (caml_compare(key$123, match$327[0]) === 0) return match$327[1];
           var rest1$126 = match$327[2];
           if (!rest1$126) throw $(Not_found$20g);
           if (caml_compare(key$123, rest1$126[0]) === 0) return rest1$126[1];
           var rest2$129 = rest1$126[2];
           if (!rest2$129) throw $(Not_found$20g);
           if (caml_compare(key$123, rest2$129[0]) === 0) return rest2$129[1];
           return __(find_rec$116, [ key$123, rest2$129[2] ]);
         });
    var find_all$133 =
      _f(function (h$134, key$135) {
           var find_in_bucket$136 =
             _f(function (param$326) {
                  if (param$326) {
                    {
                      var rest$139 = param$326[2];
                      if (caml_compare(param$326[0], key$135) === 0) return $(param$326[1], _(find_in_bucket$136, [ rest$139 ]));
                      return __(find_in_bucket$136, [ rest$139 ]);
                    }
                  }
                  return 0;
                });
           return __(find_in_bucket$136, [ oc$$arefs(h$134[1], _(hash$59, [ key$135 ]) % (h$134[1]).length) ]);
         });
    var replace$140 =
      _f(function (h$141, key$142, info$143) {
           var replace_bucket$144 =
             _f(function (param$325) {
                  if (param$325) {
                    {
                      var next$147 = param$325[2];
                      var k$145 = param$325[0];
                      if (caml_compare(k$145, key$142) === 0) return $(k$145, info$143, next$147);
                      return $(k$145, param$325[1], _(replace_bucket$144, [ next$147 ]));
                    }
                  }
                  throw $(Not_found$20g);
                });
           var i$148 = _(hash$59, [ key$142 ]) % (h$141[1]).length;
           var l$149 = oc$$arefs(h$141[1], i$148);
           try {
             return oc$$asets(h$141[1], i$148, _(replace_bucket$144, [ l$149 ]));
           }
           catch (exn$324) {
             if (exn$324[0] === Not_found$20g) {
               {
                 oc$$asets(h$141[1], i$148, $(key$142, info$143, l$149));
                 h$141[0] = 1 + h$141[0];
                 if (h$141[0] > (h$141[1]).length << 1) return __(resize$89, [ hash$59, h$141 ]);
                 return 0;
               }
             }
             throw exn$324;
           }
         });
    var mem$150 =
      _f(function (h$151, key$152) {
           var mem_in_bucket$153 =
             _f(function (param$323) {
                  if (param$323) return caml_compare(param$323[0], key$152) === 0 || _(mem_in_bucket$153, [ param$323[2] ]);
                  return 0;
                });
           return __(mem_in_bucket$153, [ oc$$arefs(h$151[1], _(hash$59, [ key$152 ]) % (h$151[1]).length) ]);
         });
    var iter$157 =
      _f(function (f$158, h$159) {
           var do_bucket$160 =
             _f(function (param$322) {
                  if (param$322) { { _(f$158, [ param$322[0], param$322[1] ]); return __(do_bucket$160, [ param$322[2] ]); } }
                  return 0;
                });
           var d$164 = h$159[1];
           var i$165;
           for (i$165 = 0; i$165 <= d$164.length - 1; i$165++) {
             (function (i$165) { _(do_bucket$160, [ oc$$arefs(d$164, i$165) ]); }(i$165));
           }
         });
    var fold$166 =
      _f(function (f$167, h$168, init$169) {
           var do_bucket$170 =
             _f(function (b$171, accu$172) {
                  if (b$171) return __(do_bucket$170, [ b$171[2], _(f$167, [ b$171[0], b$171[1], accu$172 ]) ]);
                  return accu$172;
                });
           var d$176 = h$168[1];
           var accu$177 = init$169;
           var i$178;
           for (i$178 = 0; i$178 <= d$176.length - 1; i$178++) {
             (function (i$178) { accu$177 = _(do_bucket$170, [ oc$$arefs(d$176, i$178), accu$177 ]); }(i$178));
           }
           return accu$177;
         });
    var Make$279 =
      _f(function (H$198) {
           var safehash$205 = _f(function (key$206) { return _(H$198[1], [ key$206 ]) & oc$Pervasives$[6]; });
           var add$207 =
             _f(function (h$208, key$209, info$210) {
                  var i$211 = _(safehash$205, [ key$209 ]) % (h$208[1]).length;
                  var bucket$212 = $(key$209, info$210, oc$$arefs(h$208[1], i$211));
                  oc$$asets(h$208[1], i$211, bucket$212);
                  h$208[0] = 1 + h$208[0];
                  if (h$208[0] > (h$208[1]).length << 1) return __(resize$89, [ safehash$205, h$208 ]);
                  return 0;
                });
           var remove$213 =
             _f(function (h$214, key$215) {
                  var remove_bucket$216 =
                    _f(function (param$321) {
                         if (param$321) {
                           {
                             var next$219 = param$321[2];
                             var k$217 = param$321[0];
                             if (_(H$198[0], [ k$217, key$215 ])) { { h$214[0] = -1 + h$214[0]; return next$219; } }
                             return $(k$217, param$321[1], _(remove_bucket$216, [ next$219 ]));
                           }
                         }
                         return 0;
                       });
                  var i$220 = _(safehash$205, [ key$215 ]) % (h$214[1]).length;
                  return oc$$asets(h$214[1], i$220, _(remove_bucket$216, [ oc$$arefs(h$214[1], i$220) ]));
                });
           var find_rec$221 =
             _f(function (key$222, param$320) {
                  if (!param$320) throw $(Not_found$20g);
                  if (_(H$198[0], [ key$222, param$320[0] ])) return param$320[1];
                  return __(find_rec$221, [ key$222, param$320[2] ]);
                });
           var find$226 =
             _f(function (h$227, key$228) {
                  var match$319 = oc$$arefs(h$227[1], _(safehash$205, [ key$228 ]) % (h$227[1]).length);
                  if (match$319) {
                    {
                      var rest1$231 = match$319[2];
                      if (_(H$198[0], [ key$228, match$319[0] ])) return match$319[1];
                      if (rest1$231) {
                        {
                          var rest2$234 = rest1$231[2];
                          if (_(H$198[0], [ key$228, rest1$231[0] ])) return rest1$231[1];
                          if (!rest2$234) throw $(Not_found$20g);
                          if (_(H$198[0], [ key$228, rest2$234[0] ])) return rest2$234[1];
                          return __(find_rec$221, [ key$228, rest2$234[2] ]);
                        }
                      }
                      throw $(Not_found$20g);
                    }
                  }
                  throw $(Not_found$20g);
                });
           var find_all$238 =
             _f(function (h$239, key$240) {
                  var find_in_bucket$241 =
                    _f(function (param$318) {
                         if (param$318) {
                           {
                             var rest$244 = param$318[2];
                             if (_(H$198[0], [ param$318[0], key$240 ]))
                               return $(param$318[1], _(find_in_bucket$241, [ rest$244 ]));
                             return __(find_in_bucket$241, [ rest$244 ]);
                           }
                         }
                         return 0;
                       });
                  return __(find_in_bucket$241, [ oc$$arefs(h$239[1], _(safehash$205, [ key$240 ]) % (h$239[1]).length) ]);
                });
           var replace$245 =
             _f(function (h$246, key$247, info$248) {
                  var replace_bucket$249 =
                    _f(function (param$317) {
                         if (param$317) {
                           {
                             var next$252 = param$317[2];
                             var k$250 = param$317[0];
                             if (_(H$198[0], [ k$250, key$247 ])) return $(k$250, info$248, next$252);
                             return $(k$250, param$317[1], _(replace_bucket$249, [ next$252 ]));
                           }
                         }
                         throw $(Not_found$20g);
                       });
                  var i$253 = _(safehash$205, [ key$247 ]) % (h$246[1]).length;
                  var l$254 = oc$$arefs(h$246[1], i$253);
                  try {
                    return oc$$asets(h$246[1], i$253, _(replace_bucket$249, [ l$254 ]));
                  }
                  catch (exn$316) {
                    if (exn$316[0] === Not_found$20g) {
                      {
                        oc$$asets(h$246[1], i$253, $(key$247, info$248, l$254));
                        h$246[0] = 1 + h$246[0];
                        if (h$246[0] > (h$246[1]).length << 1) return __(resize$89, [ safehash$205, h$246 ]);
                        return 0;
                      }
                    }
                    throw exn$316;
                  }
                });
           var mem$255 =
             _f(function (h$256, key$257) {
                  var mem_in_bucket$258 =
                    _f(function (param$315) {
                         if (param$315) return _(H$198[0], [ param$315[0], key$257 ]) || _(mem_in_bucket$258, [ param$315[2] ]);
                         return 0;
                       });
                  return __(mem_in_bucket$258, [ oc$$arefs(h$256[1], _(safehash$205, [ key$257 ]) % (h$256[1]).length) ]);
                });
           return $(create$79, clear$82, copy$85, add$207, remove$213, find$226, find_all$238, replace$245, mem$255, iter$157,
                    fold$166, length$87);
         });
    return $(create$79, clear$82, add$102, copy$85, find$121, find_all$133, mem$150, remove$108, replace$140, iter$157, fold$166,
             length$87, Make$279, hash$59);
  }();
var oc$Int64$ =
  function () {
    var zero$78 = "0";
    var one$79 = "1";
    var minus_one$80 = "-1";
    var succ$81 = _f(function (n$82) { return n$82 + "1"; });
    var pred$83 = _f(function (n$84) { return n$84 - "1"; });
    var abs$85 = _f(function (n$86) { if (n$86 >= "0") return n$86; return -n$86; });
    var min_int$87 = "-9223372036854775808";
    var max_int$88 = "9223372036854775807";
    var lognot$89 = _f(function (n$90) { return n$90 ^ "-1"; });
    var to_string$92 = _f(function (n$93) { return caml_format_int("%d", n$93); });
    var compare$98 = _f(function (x$99, y$100) { return caml_int64_compare(x$99, y$100); });
    return $(zero$78, one$79, minus_one$80, succ$81, pred$83, abs$85, max_int$88, min_int$87, lognot$89, to_string$92, compare$98);
  }();
var oc$Stack$ =
  function () {
    var Empty$62 = $("Stack.Empty");
    var create$63 = _f(function (param$90) { return $(0); });
    var clear$64 = _f(function (s$65) { return s$65[0] = 0; });
    var copy$66 = _f(function (s$67) { return $(s$67[0]); });
    var push$68 = _f(function (x$69, s$70) { return s$70[0] = $(x$69, s$70[0]); });
    var pop$71 =
      _f(function (s$72) {
           var match$88 = s$72[0];
           if (match$88) { { s$72[0] = match$88[1]; return match$88[0]; } }
           throw $(Empty$62);
         });
    var top$75 = _f(function (s$76) { var match$86 = s$76[0]; if (match$86) return match$86[0]; throw $(Empty$62); });
    var is_empty$78 = _f(function (s$79) { return s$79[0] === 0; });
    var length$80 = _f(function (s$81) { return __(oc$List$[0], [ s$81[0] ]); });
    var iter$82 = _f(function (f$83, s$84) { return __(oc$List$[9], [ f$83, s$84[0] ]); });
    return $(Empty$62, create$63, push$68, pop$71, top$75, clear$64, copy$66, is_empty$78, length$80, iter$82);
  }();
var oc$Queue$ =
  function () {
    var Empty$58 = $("Queue.Empty");
    var create$75 = _f(function (param$136) { return $(0, 0); });
    var clear$76 = _f(function (q$77) { q$77[0] = 0; return q$77[1] = 0; });
    var add$78 =
      _f(function (x$79, q$80) {
           q$80[0] = q$80[0] + 1;
           if (q$80[0] === 1) { { var cell$81 = $(x$79, cell$81); cell$81[1] = cell$81; return q$80[1] = cell$81; } }
           var tail$82 = q$80[1];
           var head$83 = tail$82[1];
           var cell$84 = $(x$79, head$83);
           tail$82[1] = cell$84;
           return q$80[1] = cell$84;
         });
    var peek$86 = _f(function (q$87) { if (q$87[0] === 0) throw $(Empty$58); return q$87[1][1][0]; });
    var take$89 =
      _f(function (q$90) {
           if (q$90[0] === 0) throw $(Empty$58); else;
           q$90[0] = q$90[0] - 1;
           var tail$91 = q$90[1];
           var head$92 = tail$91[1];
           if (head$92 === tail$91) q$90[1] = 0; else tail$91[1] = head$92[1];
           return head$92[0];
         });
    var copy$94 =
      _f(function (q$95) {
           if (q$95[0] === 0) return __(create$75, [ 0 ]);
           var tail$96 = q$95[1];
           var tail$27$97 = $(tail$96[0], tail$27$97);
           tail$27$97[1] = tail$27$97;
           var copy$98 =
             _f(function (cell$99) {
                  if (cell$99 === tail$96) return tail$27$97;
                  return $(cell$99[0], _(copy$98, [ cell$99[1] ]));
                });
           tail$27$97[1] = _(copy$98, [ tail$96[1] ]);
           return $(q$95[0], tail$27$97);
         });
    var is_empty$100 = _f(function (q$101) { return q$101[0] === 0; });
    var length$102 = _f(function (q$103) { return q$103[0]; });
    var iter$104 =
      _f(function (f$105, q$106) {
           if (q$106[0] > 0) {
             {
               var tail$107 = q$106[1];
               var iter$108 =
                 _f(function (cell$109) {
                      _(f$105, [ cell$109[0] ]);
                      if (cell$109 !== tail$107) return __(iter$108, [ cell$109[1] ]);
                      return 0;
                    });
               return __(iter$108, [ tail$107[1] ]);
             }
           }
           return 0;
         });
    var fold$110 =
      _f(function (f$111, accu$112, q$113) {
           if (q$113[0] === 0) return accu$112;
           var tail$114 = q$113[1];
           var fold$115 =
             _f(function (accu$116, cell$117) {
                  var accu$118 = _(f$111, [ accu$116, cell$117[0] ]);
                  if (cell$117 === tail$114) return accu$118;
                  return __(fold$115, [ accu$118, cell$117[1] ]);
                });
           return __(fold$115, [ accu$112, tail$114[1] ]);
         });
    var transfer$119 =
      _f(function (q1$120, q2$121) {
           var length1$122 = q1$120[0];
           if (length1$122 > 0) {
             {
               var tail1$123 = q1$120[1];
               _(clear$76, [ q1$120 ]);
               if (q2$121[0] > 0) {
                 {
                   var tail2$124 = q2$121[1];
                   var head1$125 = tail1$123[1];
                   var head2$126 = tail2$124[1];
                   tail1$123[1] = head2$126;
                   tail2$124[1] = head1$125;
                 }
               }
               else;
               q2$121[0] = q2$121[0] + length1$122;
               return q2$121[1] = tail1$123;
             }
           }
           return 0;
         });
    return $(Empty$58, create$75, add$78, add$78, take$89, take$89, peek$86, peek$86, clear$76, copy$94, is_empty$100, length$102,
             iter$104, fold$110, transfer$119);
  }();
var oc$Random$ =
  function () {
    var init$74 = _f(function (prim$124) { return 0; });
    var full_init$75 = _f(function (prim$123) { return 0; });
    var self_init$76 = _f(function (prim$122) { return 0; });
    var bits$77 = _f(function (param$121) { return Math.floor(Math.random() * 1073741824); });
    var int$78 = _f(function (b$79) { return Math.floor(Math.random() * b$79); });
    var int32$80 = _f(function (b$81) { return Math.floor(Math.random() * b$81); });
    var nativeint$82 = _f(function (b$83) { return Math.floor(Math.random() * b$83); });
    var int64$84 = _f(function (param$120) { return oc$Int64$[0]; });
    var float$85 = _f(function (b$86) { return Math.random() * b$86; });
    var bool$87 = _f(function (param$119) { return Math.random() < 0.5; });
    var State$104 =
      function () {
        var make$89 = _f(function (prim$118) { return 0; });
        var make_self_init$90 = _f(function (prim$117) { return 0; });
        var copy$91 = _f(function (prim$116) { return 0; });
        var bits$92 = _f(function (param$115) { return __(bits$77, [ 0 ]); });
        var int$93 = _f(function (param$114, b$94) { return __(int$78, [ b$94 ]); });
        var int32$95 = _f(function (param$113, b$96) { return __(int32$80, [ b$96 ]); });
        var nativeint$97 = _f(function (param$112, b$98) { return __(nativeint$82, [ b$98 ]); });
        var int64$99 = _f(function (param$111, b$100) { return __(int64$84, [ b$100 ]); });
        var float$101 = _f(function (param$110, b$102) { return __(float$85, [ b$102 ]); });
        var bool$103 = _f(function (param$109) { return __(bool$87, [ 0 ]); });
        return $(make$89, make_self_init$90, copy$91, bits$92, int$93, int32$95, nativeint$97, int64$99, float$101, bool$103);
      }();
    var get_state$105 = _f(function (prim$108) { return 0; });
    var set_state$106 = _f(function (prim$107) { return 0; });
    return $(init$74, full_init$75, self_init$76, bits$77, int$78, int32$80, nativeint$82, int64$84, float$85, bool$87, State$104,
             get_state$105, set_state$106);
  }();
var oc$Froc_dlist$ =
  function () {
    var empty$71 = _f(function (param$91) { var t$72 = $(0, t$72, t$72); t$72[1] = t$72; t$72[2] = t$72; return t$72; });
    var add_after$73 =
      _f(function (t$74, d$75) { var n$76 = $(d$75, t$74, t$74[2]); t$74[2][1] = n$76; t$74[2] = n$76; return n$76; });
    var remove$77 = _f(function (t$78) { t$78[2][1] = t$78[1]; t$78[1][2] = t$78[2]; t$78[2] = t$78; return t$78[1] = t$78; });
    var iter$79 =
      _f(function (f$80, d$81) {
           var loop$82 =
             _f(function (t$83) {
                  if (!(t$83 === d$81)) { { var next$84 = t$83[2]; _(f$80, [ t$83[0] ]); return __(loop$82, [ next$84 ]); } }
                  return 0;
                });
           return __(loop$82, [ d$81[2] ]);
         });
    var clear$85 = _f(function (d$86) { d$86[2] = d$86; return d$86[1] = d$86; });
    return $(empty$71, add_after$73, remove$77, iter$79, clear$85);
  }();
var oc$Froc_hashtbl$ =
  function () {
    var total_eq$84 =
      _f(function (v1$85, v2$86) { try { return caml_compare(v1$85, v2$86) === 0; } catch (exn$174) { return 0; } });
    var create$87 =
      _f(function ($2Aopt$2A$88, $2Aopt$2A$91, $2Aopt$2A$111, param$172) {
           var size$89 = $2Aopt$2A$88 ? $2Aopt$2A$88[0] : 17;
           var hash$92 = $2Aopt$2A$91 ? $2Aopt$2A$91[0] : oc$Hashtbl$[13];
           var eq$112 = $2Aopt$2A$111 ? $2Aopt$2A$111[0] : total_eq$84;
           var s$114 = _(oc$Pervasives$[3], [ _(oc$Pervasives$[4], [ 1, size$89 ]), oc$Sys$[6] ]);
           return $(hash$92, eq$112, 0, caml_make_vect(s$114, 0));
         });
    var resize$115 =
      _f(function (tbl$116) {
           var odata$117 = tbl$116[3];
           var osize$118 = odata$117.length;
           var nsize$119 = _(oc$Pervasives$[3], [ 2 * osize$118 + 1, oc$Sys$[6] ]);
           if (nsize$119 !== osize$118) {
             {
               var ndata$120 = caml_make_vect(nsize$119, 0);
               var insert_bucket$121 =
                 _f(function (param$171) {
                      if (param$171) {
                        {
                          var key$122 = param$171[0];
                          _(insert_bucket$121, [ param$171[2] ]);
                          var nidx$125 = _(tbl$116[0], [ key$122 ]) % nsize$119;
                          return oc$$asets(ndata$120, nidx$125, $(key$122, param$171[1], oc$$arefs(ndata$120, nidx$125)));
                        }
                      }
                      return 0;
                    });
               var i$126;
               for (i$126 = 0; i$126 <= osize$118 - 1; i$126++) {
                 (function (i$126) { _(insert_bucket$121, [ oc$$arefs(odata$117, i$126) ]); }(i$126));
               }
               return tbl$116[3] = ndata$120;
             }
           }
           return 0;
         });
    var add$127 =
      _f(function (h$128, key$129, info$130) {
           var i$131 = _(h$128[0], [ key$129 ]) % (h$128[3]).length;
           var bucket$132 = $(key$129, info$130, oc$$arefs(h$128[3], i$131));
           oc$$asets(h$128[3], i$131, bucket$132);
           h$128[2] = 1 + h$128[2];
           if (h$128[2] > (h$128[3]).length << 1) return __(resize$115, [ h$128 ]);
           return 0;
         });
    var remove$133 =
      _f(function (h$134, key$135, p$136) {
           var remove_bucket$137 =
             _f(function (param$170) {
                  if (param$170) {
                    {
                      var next$140 = param$170[2];
                      var i$139 = param$170[1];
                      var k$138 = param$170[0];
                      if (_(h$134[1], [ k$138, key$135 ]) && _(p$136, [ i$139 ])) {
                        { h$134[2] = -1 + h$134[2]; return next$140; }
                      }
                      return $(k$138, i$139, _(remove_bucket$137, [ next$140 ]));
                    }
                  }
                  return 0;
                });
           var i$141 = _(h$134[0], [ key$135 ]) % (h$134[3]).length;
           return oc$$asets(h$134[3], i$141, _(remove_bucket$137, [ oc$$arefs(h$134[3], i$141) ]));
         });
    var find_rec$142 =
      _f(function (h$143, key$144, p$145, param$169) {
           if (param$169) {
             {
               var d$147 = param$169[1];
               if (_(h$143[1], [ key$144, param$169[0] ]) && _(p$145, [ d$147 ])) return d$147;
               return __(find_rec$142, [ h$143, key$144, p$145, param$169[2] ]);
             }
           }
           throw $(Not_found$20g);
         });
    var find$149 =
      _f(function (h$150, key$151, p$152) {
           var match$168 = oc$$arefs(h$150[3], _(h$150[0], [ key$151 ]) % (h$150[3]).length);
           if (match$168) {
             {
               var rest1$155 = match$168[2];
               var d1$154 = match$168[1];
               if (_(h$150[1], [ key$151, match$168[0] ]) && _(p$152, [ d1$154 ])) return d1$154;
               if (rest1$155) {
                 {
                   var rest2$158 = rest1$155[2];
                   var d2$157 = rest1$155[1];
                   if (_(h$150[1], [ key$151, rest1$155[0] ]) && _(p$152, [ d2$157 ])) return d2$157;
                   if (rest2$158) {
                     {
                       var d3$160 = rest2$158[1];
                       if (_(h$150[1], [ key$151, rest2$158[0] ]) && _(p$152, [ d3$160 ])) return d3$160;
                       return __(find_rec$142, [ h$150, key$151, p$152, rest2$158[2] ]);
                     }
                   }
                   throw $(Not_found$20g);
                 }
               }
               throw $(Not_found$20g);
             }
           }
           throw $(Not_found$20g);
         });
    return $(create$87, add$127, find$149, remove$133);
  }();
var oc$Froc_timestamp$ =
  function () {
    var debug$58 = $(_f(function (prim$160) { return 0; }));
    var set_debug$59 = _f(function (f$60) { return debug$58[0] = f$60; });
    var is_spliced_out$72 = _f(function (t$73) { return t$73[1]; });
    var check$74 = _f(function (t$75) { if (t$75[1]) throw $(Invalid_argument$18g, "spliced out timestamp"); return 0; });
    var empty$76 =
      _f(function (param$157) {
           var h$77 = $(0, 0, t$78, h$77, 0);
           var t$78 = $(oc$Pervasives$[6], 0, t$78, h$77, 0);
           h$77[2] = t$78;
           h$77[3] = h$77;
           t$78[2] = t$78;
           t$78[3] = h$77;
           return h$77;
         });
    var timeline$79 = $(_(empty$76, [ 0 ]));
    var now$80 = $(timeline$79[0]);
    var get_now$81 = _f(function (param$156) { return now$80[0]; });
    var set_now$82 = _f(function (t$83) { return now$80[0] = t$83; });
    var init$84 =
      _f(function (param$155) {
           var loop$85 =
             _f(function (t$86) {
                  if (t$86 !== t$86[2]) {
                    {
                      _(oc$List$[9], [ _f(function (c$87) { return __(c$87, [ 0 ]); }), t$86[4] ]);
                      return __(loop$85, [ t$86[2] ]);
                    }
                  }
                  return 0;
                });
           _(loop$85, [ timeline$79[0] ]);
           timeline$79[0] = _(empty$76, [ 0 ]);
           return now$80[0] = timeline$79[0];
         });
    var tau_factor$88 = 1.41421;
    var renumber$89 =
      _f(function (t$90) {
           var find_range$91 =
             _f(function (lo$92, hi$93, mask$94, tau$95, count$96) {
                  var lo_id$97 = lo$92[0] & _(oc$Pervasives$[8], [ mask$94 ]);
                  var hi_id$98 = lo_id$97 | mask$94;
                  var lo_loop$99 =
                    _f(function (lo$100, count$101) {
                         var lo_prev$102 = lo$100[3];
                         if (lo_prev$102[0] < lo_id$97 || lo_prev$102[3] === lo_prev$102) return $(lo$100, count$101);
                         return __(lo_loop$99, [ lo_prev$102, count$101 + 1 ]);
                       });
                  var hi_loop$103 =
                    _f(function (hi$104, count$105) {
                         var hi_next$106 = hi$104[2];
                         if (hi_next$106[0] > hi_id$98 || hi_next$106[2] === hi_next$106) return $(hi$104, count$105);
                         return __(hi_loop$103, [ hi_next$106, count$105 + 1 ]);
                       });
                  var match$154 = _(lo_loop$99, [ lo$92, count$96 ]);
                  var lo$107 = match$154[0];
                  var match$153 = _(hi_loop$103, [ hi$93, match$154[1] ]);
                  var count$110 = match$153[1];
                  var hi$109 = match$153[0];
                  var size$111 = mask$94 + 1;
                  var density$112 = count$110 / size$111;
                  if (density$112 < tau$95) return $(lo$107, hi$109, lo_id$97, count$110, size$111);
                  var mask$113 = mask$94 * 2 + 1;
                  if (mask$113 === oc$Pervasives$[6]) _(oc$Pervasives$[1], [ "out of timestamps" ]); else;
                  return __(find_range$91, [ lo$107, hi$109, mask$113, tau$95 / tau_factor$88, count$110 ]);
                });
           var match$152 = _(find_range$91, [ t$90, t$90, 1, 1. / tau_factor$88, 1 ]);
           var incr$119 = match$152[4] / match$152[3] >> 0;
           var ren_loop$120 =
             _f(function (t$121, id$122) {
                  t$121[0] = id$122;
                  if (t$121 !== match$152[1]) return __(ren_loop$120, [ t$121[2], id$122 + incr$119 ]);
                  return 0;
                });
           return __(ren_loop$120, [ match$152[0], match$152[2] ]);
         });
    var tick$123 =
      _f(function (param$150) {
           var t$124 = now$80[0];
           _(check$74, [ t$124 ]);
           var next_id$125 = t$124[2][0];
           var id$126 =
             function () {
               var incr$127 = Math.sqrt(next_id$125 - t$124[0]) >> 0;
               var id$128 = t$124[0] + incr$127;
               if (id$128 === next_id$125) return t$124[0];
               return id$128;
             }();
           var t$27$129 = $(id$126, 0, t$124[2], t$124, 0);
           t$124[2][3] = t$27$129;
           t$124[2] = t$27$129;
           if (id$126 === t$124[0]) _(renumber$89, [ t$124 ]); else;
           now$80[0] = t$27$129;
           return t$27$129;
         });
    var add_cleanup$130 =
      _f(function (t$131, cleanup$132) { _(check$74, [ t$131 ]); return t$131[4] = $(cleanup$132, t$131[4]); });
    var splice_out$133 =
      _f(function (t1$134, t2$135) {
           _(check$74, [ t1$134 ]);
           _(check$74, [ t2$135 ]);
           if (t1$134[0] >= t2$135[0]) throw $(Invalid_argument$18g, "t1 >= t2"); else;
           var loop$136 =
             _f(function (t$137) {
                  if (t$137 === t2$135) return 0;
                  _(oc$List$[9], [ _f(function (c$138) { return __(c$138, [ 0 ]); }), t$137[4] ]);
                  t$137[4] = 0;
                  t$137[1] = 1;
                  return __(loop$136, [ t$137[2] ]);
                });
           _(loop$136, [ t1$134[2] ]);
           t1$134[2] = t2$135;
           return t2$135[3] = t1$134;
         });
    var compare$139 =
      _f(function (t1$140, t2$141) {
           _(check$74, [ t1$140 ]);
           _(check$74, [ t2$141 ]);
           return caml_int_compare(t1$140[0], t2$141[0]);
         });
    var eq$142 = _f(function (t1$143, t2$144) { _(check$74, [ t1$143 ]); _(check$74, [ t2$144 ]); return t1$143 === t2$144; });
    return $(init$84, tick$123, get_now$81, set_now$82, add_cleanup$130, splice_out$133, is_spliced_out$72, compare$139, eq$142,
             set_debug$59);
  }();
var oc$Froc_ddg$ =
  function () {
    var Dlist$74 = oc$Froc_dlist$;
    var TS$75 = oc$Froc_timestamp$;
    var debug$76 = $(_f(function (prim$1137) { return 0; }));
    var set_debug$77 = _f(function (f$78) { debug$76[0] = f$78; return __(TS$75[9], [ f$78 ]); });
    var handle_exn$79 = $(_f(function (prim$1136) { throw prim$1136; }));
    var set_exn_handler$80 = _f(function (h$81) { return handle_exn$79[0] = h$81; });
    var total_eq$115 =
      _f(function (v1$116, v2$117) { try { return caml_compare(v1$116, v2$117) === 0; } catch (exn$1135) { return 0; } });
    var hash$118 =
      _f(function (t$119) {
           var match$1133 = t$119;
           switch ($t(match$1133)) { case 0: return match$1133[0]; case 1: return match$1133[0][0]; default: return null; }
         });
    var Unset$122 = $("Froc_ddg.Unset");
    var next_id$123 =
      function () {
        var next_id$124 = $(1);
        return _f(function (param$1132) { var id$125 = next_id$124[0]; next_id$124[0]++; return id$125; });
      }();
    var unset$126 = $1($(Unset$122));
    var make_changeable$127 =
      _f(function ($2Aopt$2A$128, $2Aopt$2A$131, param$1130) {
           var eq$129 = $2Aopt$2A$128 ? $2Aopt$2A$128[0] : total_eq$115;
           var result$132 = $2Aopt$2A$131 ? $2Aopt$2A$131[0] : unset$126;
           var c$134 = $(_(next_id$123, [ 0 ]), eq$129, result$132, _(Dlist$74[0], [ 0 ]));
           return $($1(c$134), c$134);
         });
    var make_constant$135 = _f(function (result$136) { return $(_(next_id$123, [ 0 ]), result$136); });
    var changeable$137 = _f(function (eq$138, v$139) { return __(make_changeable$127, [ eq$138, $($(v$139)), 0 ]); });
    var return$140 = _f(function (v$141) { return __(make_constant$135, [ $(v$141) ]); });
    var fail$142 = _f(function (e$143) { return __(make_constant$135, [ $1(e$143) ]); });
    var is_constant$144 =
      _f(function (t$145) { var match$1127 = t$145; switch ($t(match$1127)) { case 0: return 1; default: return 0; } });
    var clear$146 = _f(function (u$147) { var c$148 = u$147; return c$148[2] = unset$126; });
    var write_result$149 =
      _f(function (u$150, r$151) {
           var c$152 = u$150;
           var eq$153 =
             function () {
               var match$1125 = c$152[2];
               var $r246 = false;
               r$246:
                 switch ($t(match$1125))
                 {
                 case 0:
                   switch ($t(r$151))
                   {
                   case 0: return _(c$152[1], [ match$1125[0], r$151[0] ]);
                   default: $r246 = true; break r$246;
                   }
                   break;
                 case 1:
                   switch ($t(r$151)) { case 1: return match$1125[0] === r$151[0]; default: $r246 = true; break r$246; }
                   break;
                 default: return null;
                 }
               if ($r246) return 0;
             }();
           if (!eq$153) {
             { c$152[2] = r$151; return __(Dlist$74[3], [ _f(function (f$158) { return __(f$158, [ r$151 ]); }), c$152[3] ]); }
           }
           return 0;
         });
    var write_result_no_eq$159 =
      _f(function (u$160, r$161) {
           var c$162 = u$160;
           c$162[2] = r$161;
           return __(Dlist$74[3], [ _f(function (f$163) { return __(f$163, [ r$161 ]); }), c$162[3] ]);
         });
    var write$164 = _f(function (u$165, v$166) { return __(write_result$149, [ u$165, $(v$166) ]); });
    var write_exn$167 = _f(function (u$168, e$169) { return __(write_result$149, [ u$168, $1(e$169) ]); });
    var read_result$170 =
      _f(function (t$171) {
           var match$1123 = t$171;
           switch ($t(match$1123)) { case 0: return match$1123[1]; case 1: return match$1123[0][2]; default: return null; }
         });
    var read$174 =
      _f(function (t$175) {
           var match$1122 = _(read_result$170, [ t$175 ]);
           switch ($t(match$1122)) { case 0: return match$1122[0]; case 1: throw match$1122[0]; default: return null; }
         });
    var make_cancel$179 = _f(function (f$180) { return f$180; });
    var no_cancel$181 = _f(function (prim$1121) { return 0; });
    var cancel$182 = _f(function (c$183) { return __(c$183, [ 0 ]); });
    var add_dep_cancel$184 =
      _f(function (ts$185, t$186, dep$187) {
           var cancel$188 =
             function () {
               var match$1118 = t$186;
               switch ($t(match$1118))
               {
               case 0: return no_cancel$181;
               case 1:
                 var dl$190 = _(Dlist$74[1], [ match$1118[0][3], dep$187 ]);
                 return _(make_cancel$179, [ _f(function (param$1117) { return __(Dlist$74[2], [ dl$190 ]); }) ]);
               default: return null;
               }
             }();
           _(TS$75[4], [ ts$185, cancel$188 ]);
           return cancel$188;
         });
    var add_dep$191 =
      _f(function (ts$192, t$193, dep$194) { var match$1116 = _(add_dep_cancel$184, [ ts$192, t$193, dep$194 ]); return 0; });
    var PQ$263 =
      function () {
        var make$207 = _f(function (param$1114) { return $($(), 0); });
        var is_empty$208 = _f(function (t$209) { return t$209[1] === 0; });
        var size$210 = _f(function (t$211) { return t$211[1]; });
        var compare_down$212 =
          _f(function (h$213, i$214, i$27$215) {
               var t1$216 = h$213[0][i$214][1];
               var t2$217 = h$213[0][i$27$215][1];
               var match$1112 = _(TS$75[6], [ t1$216 ]);
               var match$1113 = _(TS$75[6], [ t2$217 ]);
               if (!(match$1112 !== 0)) { { if (match$1113 !== 0) return 1; return __(TS$75[7], [ t1$216, t2$217 ]); } }
               if (match$1113 !== 0) return 0;
               return -1;
             });
        var swap$218 =
          _f(function (h$219, i$220, i$27$221) {
               var t$222 = h$219[0][i$220];
               h$219[0][i$220] = h$219[0][i$27$221];
               return h$219[0][i$27$221] = t$222;
             });
        var rem_last$223 = _f(function (h$224) { var l$225 = h$224[1] - 1; h$224[1] = l$225; return h$224[0][l$225] = 0; });
        var down$226 =
          _f(function (h$227, i$228) {
               var last$229 = _(size$210, [ h$227 ]) - 1;
               var start$230 = 2 * i$228;
               var l$231 = start$230 + 1;
               var r$232 = start$230 + 2;
               if (l$231 > last$229) return 0;
               var child$233 = r$232 > last$229 ? l$231 : _(compare_down$212, [ h$227, l$231, r$232 ]) < 0 ? l$231 : r$232;
               if (_(compare_down$212, [ h$227, i$228, child$233 ]) > 0) {
                 { _(swap$218, [ h$227, i$228, child$233 ]); return __(down$226, [ h$227, child$233 ]); }
               }
               return 0;
             });
        var up$234 =
          _f(function (h$235, i$236) {
               var aux$237 =
                 _f(function (h$238, i$239, last_spliced_out$240) {
                      if (!(i$239 === 0)) {
                        {
                          var p$241 = (i$239 - 1) / 2 >> 0;
                          var t1$242 = h$238[0][i$239][1];
                          var t2$243 = h$238[0][p$241][1];
                          var match$1110 = _(TS$75[6], [ t1$242 ]);
                          var match$1111 = _(TS$75[6], [ t2$243 ]);
                          if (match$1110 !== 0) throw $(Assert_failure$26g, $("froc_ddg.ml", 209, 21));
                          if (match$1111 !== 0) {
                            { _(swap$218, [ h$238, i$239, p$241 ]); return __(aux$237, [ h$238, p$241, 1 ]); }
                          }
                          if (_(TS$75[7], [ t1$242, t2$243 ]) < 0) {
                            { _(swap$218, [ h$238, i$239, p$241 ]); return __(aux$237, [ h$238, p$241, 0 ]); }
                          }
                          if (last_spliced_out$240) return __(down$226, [ h$238, i$239 ]);
                          return 0;
                        }
                      }
                      if (last_spliced_out$240) return __(down$226, [ h$238, 0 ]);
                      return 0;
                    });
               return __(aux$237, [ h$235, i$236, 0 ]);
             });
        var grow$244 = _f(function (h$245) { var len$246 = 2 * h$245[1] + 1; return (h$245[0]).length = len$246; });
        var add$247 =
          _f(function (h$248, n$249) {
               if (h$248[1] === (h$248[0]).length) _(grow$244, [ h$248 ]); else;
               h$248[0][h$248[1]] = n$249;
               h$248[1] = h$248[1] + 1;
               return __(up$234, [ h$248, _(size$210, [ h$248 ]) - 1 ]);
             });
        var remove_min$250 =
          _f(function (h$251) {
               var s$252 = _(size$210, [ h$251 ]);
               if (s$252 === 0) return 0;
               if (s$252 > 1) {
                 { h$251[0][0] = h$251[0][s$252 - 1]; _(rem_last$223, [ h$251 ]); return __(down$226, [ h$251, 0 ]); }
               }
               return __(rem_last$223, [ h$251 ]);
             });
        var find_min$253 = _f(function (h$254) { if (_(is_empty$208, [ h$254 ])) throw $(Not_found$20g); return h$254[0][0]; });
        return $(make$207, is_empty$208, add$247, find_min$253, remove_min$250);
      }();
    var pq$264 = $(_(PQ$263[0], [ 0 ]));
    var init$265 = _f(function (param$1109) { _(TS$75[0], [ 0 ]); return pq$264[0] = _(PQ$263[0], [ 0 ]); });
    var enqueue$266 = _f(function (e$267) { return __(PQ$263[2], [ pq$264[0], e$267 ]); });
    var add_reader_cancel$268 =
      _f(function (t$269, read$270) {
           var start$271 = _(TS$75[1], [ 0 ]);
           _(read$270, [ 0 ]);
           var r$272 = $(read$270, start$271, _(TS$75[1], [ 0 ]));
           var dep$273 = _f(function (param$1107) { return __(enqueue$266, [ r$272 ]); });
           return __(add_dep_cancel$184, [ start$271, t$269, dep$273 ]);
         });
    var add_reader$274 =
      _f(function (t$275, read$276) { var match$1106 = _(add_reader_cancel$268, [ t$275, read$276 ]); return 0; });
    var connect_cancel$277 =
      _f(function (u$278, t$27$279) {
           _(write_result$149, [ u$278, _(read_result$170, [ t$27$279 ]) ]);
           return __(add_dep_cancel$184, [ _(TS$75[1], [ 0 ]), t$27$279, _(write_result_no_eq$159, [ u$278 ]) ]);
         });
    var connect$280 =
      _f(function (u$281, t$27$282) {
           _(write_result$149, [ u$281, _(read_result$170, [ t$27$282 ]) ]);
           return __(add_dep$191, [ _(TS$75[1], [ 0 ]), t$27$282, _(write_result_no_eq$159, [ u$281 ]) ]);
         });
    var notify_result_cancel$283 =
      _f(function ($2Aopt$2A$284, t$287, f$288) {
           var current$285 = $2Aopt$2A$284 ? $2Aopt$2A$284[0] : 1;
           if (current$285)
             return __(add_reader_cancel$268,
                       [
                         t$287,
                         _f(function (param$1105) {
                              try {
                                return _(f$288, [ _(read_result$170, [ t$287 ]) ]);
                              }
                              catch (e$289) {
                                return __(handle_exn$79[0], [ e$289 ]);
                              }
                            })
                       ]);
           var notify$290 = $(0);
           return __(add_reader_cancel$268,
                     [
                       t$287,
                       _f(function (param$1104) {
                            if (!notify$290[0]) return notify$290[0] = 1;
                            try {
                              return _(f$288, [ _(read_result$170, [ t$287 ]) ]);
                            }
                            catch (e$291) {
                              return __(handle_exn$79[0], [ e$291 ]);
                            }
                          })
                     ]);
         });
    var notify_result$292 =
      _f(function (current$293, t$294, f$295) {
           var match$1103 = _(notify_result_cancel$283, [ current$293, t$294, f$295 ]);
           return 0;
         });
    var notify_cancel$296 =
      _f(function (current$297, t$298, f$299) {
           return __(notify_result_cancel$283,
                     [
                       current$297,
                       t$298,
                       _f(function (param$1101) {
                            switch ($t(param$1101))
                            {
                            case 0: return __(f$299, [ param$1101[0] ]);
                            case 1: return 0;
                            default: return null;
                            }
                          })
                     ]);
         });
    var notify$301 =
      _f(function (current$302, t$303, f$304) {
           return __(notify_result$292,
                     [
                       current$302,
                       t$303,
                       _f(function (param$1099) {
                            switch ($t(param$1099))
                            {
                            case 0: return __(f$304, [ param$1099[0] ]);
                            case 1: return 0;
                            default: return null;
                            }
                          })
                     ]);
         });
    var cleanup$306 = _f(function (f$307) { return __(TS$75[4], [ _(TS$75[1], [ 0 ]), f$307 ]); });
    var bind_gen$309 =
      _f(function (eq$310, return$311, assign$312, f$313, t$314) {
           var match$1096 = t$314;
           switch ($t(match$1096))
           {
           case 0:
             var match$1098 = match$1096[1];
             switch ($t(match$1098))
             {
             case 0:
               try { return _(return$311, [ _(f$313, [ match$1098[0] ]) ]); } catch (e$317) { return __(fail$142, [ e$317 ]); }
               break;
             case 1: return __(fail$142, [ match$1098[0] ]);
             default: return null;
             }
             break;
           default:
             var match$1095 = _(make_changeable$127, [ eq$310, 0, 0 ]);
             var ru$319 = match$1095[1];
             _(add_reader$274,
               [
                 t$314,
                 _f(function (param$1093) {
                      var match$1094 = _(read_result$170, [ t$314 ]);
                      switch ($t(match$1094))
                      {
                      case 0:
                        try {
                          return _(assign$312, [ ru$319, _(f$313, [ match$1094[0] ]) ]);
                        }
                        catch (e$322) {
                          return __(write_exn$167, [ ru$319, e$322 ]);
                        }
                        break;
                      case 1: return __(write_exn$167, [ ru$319, match$1094[0] ]);
                      default: return null;
                      }
                    })
               ]);
             return match$1095[0];
           }
         });
    var bind$323 =
      _f(function (eq$324, t$325, f$326) {
           return __(bind_gen$309, [ eq$324, _f(function (prim$1092) { return prim$1092; }), connect$280, f$326, t$325 ]);
         });
    var $3E$3E$3D$327 = _f(function (t$328, f$329) { return __(bind$323, [ 0, t$328, f$329 ]); });
    var lift$330 = _f(function (eq$331, f$332) { return __(bind_gen$309, [ eq$331, return$140, write$164, f$332 ]); });
    var blift$333 = _f(function (eq$334, t$335, f$336) { return __(lift$330, [ eq$334, f$336, t$335 ]); });
    var try_bind_gen$337 =
      _f(function (eq$338, return$339, assign$340, f$341, succ$342, err$343) {
           var t$344 = function () { try { return _(f$341, [ 0 ]); } catch (e$345) { return _(fail$142, [ e$345 ]); } }();
           var match$1089 = t$344;
           switch ($t(match$1089))
           {
           case 0:
             var match$1091 = match$1089[1];
             switch ($t(match$1091))
             {
             case 0:
               try { return _(return$339, [ _(succ$342, [ match$1091[0] ]) ]); } catch (e$349) { return __(fail$142, [ e$349 ]); }
               break;
             case 1:
               try { return _(return$339, [ _(err$343, [ match$1091[0] ]) ]); } catch (e$348) { return __(fail$142, [ e$348 ]); }
               break;
             default: return null;
             }
             break;
           default:
             var match$1088 = _(make_changeable$127, [ eq$338, 0, 0 ]);
             var ru$351 = match$1088[1];
             _(add_reader$274,
               [
                 t$344,
                 _f(function (param$1086) {
                      try {
                        return _(assign$340,
                                 [
                                   ru$351,
                                   function () {
                                     var match$1087 = _(read_result$170, [ t$344 ]);
                                     switch ($t(match$1087))
                                     {
                                     case 0: return _(succ$342, [ match$1087[0] ]);
                                     case 1: return _(err$343, [ match$1087[0] ]);
                                     default: return null;
                                     }
                                   }()
                                 ]);
                      }
                      catch (e$354) {
                        return __(write_exn$167, [ ru$351, e$354 ]);
                      }
                    })
               ]);
             return match$1088[0];
           }
         });
    var try_bind$355 =
      _f(function (eq$356, f$357, succ$358, err$359) {
           return __(try_bind_gen$337,
                     [ eq$356, _f(function (prim$1085) { return prim$1085; }), connect$280, f$357, succ$358, err$359 ]);
         });
    var try_bind_lift$360 =
      _f(function (eq$361, f$362, succ$363, err$364) {
           return __(try_bind_gen$337, [ eq$361, return$140, write$164, f$362, succ$363, err$364 ]);
         });
    var catch_gen$365 =
      _f(function (eq$366, return$367, assign$368, f$369, err$370) {
           var t$371 = function () { try { return _(f$369, [ 0 ]); } catch (e$372) { return _(fail$142, [ e$372 ]); } }();
           var match$1081 = t$371;
           switch ($t(match$1081))
           {
           case 0:
             var match$1083 = match$1081[1];
             switch ($t(match$1083))
             {
             case 0: return t$371;
             case 1:
               try { return _(return$367, [ _(err$370, [ match$1083[0] ]) ]); } catch (e$374) { return __(fail$142, [ e$374 ]); }
               break;
             default: return null;
             }
             break;
           default:
             var match$1080 = _(make_changeable$127, [ eq$366, 0, 0 ]);
             var ru$376 = match$1080[1];
             _(add_reader$274,
               [
                 t$371,
                 _f(function (param$1078) {
                      var r$377 = _(read_result$170, [ t$371 ]);
                      switch ($t(r$377))
                      {
                      case 0: return __(write_result$149, [ ru$376, r$377 ]);
                      case 1:
                        try {
                          return _(assign$368, [ ru$376, _(err$370, [ r$377[0] ]) ]);
                        }
                        catch (e$379) {
                          return __(write_exn$167, [ ru$376, e$379 ]);
                        }
                        break;
                      default: return null;
                      }
                    })
               ]);
             return match$1080[0];
           }
         });
    var catch$380 =
      _f(function (eq$381, f$382, err$383) {
           return __(catch_gen$365, [ eq$381, _f(function (prim$1077) { return prim$1077; }), connect$280, f$382, err$383 ]);
         });
    var catch_lift$384 =
      _f(function (eq$385, f$386, err$387) { return __(catch_gen$365, [ eq$385, return$140, write$164, f$386, err$387 ]); });
    var finish$388 = _(oc$Stack$[1], [ 0 ]);
    var prop$389 =
      _f(function (until$390, param$1076) {
           if (!_(PQ$263[1], [ pq$264[0] ])) {
             {
               var r$391 = _(PQ$263[3], [ pq$264[0] ]);
               if (_(TS$75[6], [ r$391[1] ])) { { _(PQ$263[4], [ pq$264[0] ]); return __(prop$389, [ until$390, 0 ]); } }
               var $r155 = false;
               r$155: {
                 {
                   if (!until$390) { { $r155 = true; break r$155; } }
                   if (!(_(TS$75[7], [ r$391[1], until$390[0] ]) === 1)) { { $r155 = true; break r$155; } }
                   return 0;
                 }
               }
               if ($r155) {
                 {
                   _(PQ$263[4], [ pq$264[0] ]);
                   _(TS$75[3], [ r$391[1] ]);
                   _(oc$Stack$[2], [ r$391[2], finish$388 ]);
                   _(r$391[0], [ 0 ]);
                   _(oc$Stack$[3], [ finish$388 ]);
                   _(TS$75[5], [ _(TS$75[2], [ 0 ]), r$391[2] ]);
                   return __(prop$389, [ until$390, 0 ]);
                 }
               }
             }
           }
           return 0;
         });
    var propagate$393 =
      _f(function (param$1075) { var now$27$394 = _(TS$75[2], [ 0 ]); _(prop$389, [ 0, 0 ]); return __(TS$75[3], [ now$27$394 ]); });
    var memo$405 =
      _f(function (size$406, hash$407, eq$408, param$1071) {
           var h$409 = _(oc$Froc_hashtbl$[0], [ size$406, hash$407, eq$408, 0 ]);
           return _f(function (f$410, k$411) {
                       var result$412 =
                         function () {
                           try {
                             if (_(oc$Stack$[7], [ finish$388 ])) throw $(Not_found$20g); else;
                             var ok$413 =
                               _f(function (m$414) {
                                    return _(TS$75[7], [ _(TS$75[2], [ 0 ]), m$414[1] ]) === -1 &&
                                             _(TS$75[7], [ m$414[2], _(oc$Stack$[4], [ finish$388 ]) ]) === -1;
                                  });
                             var m$415 = _(oc$Froc_hashtbl$[2], [ h$409, k$411, ok$413 ]);
                             _(TS$75[5], [ _(TS$75[2], [ 0 ]), m$415[1] ]);
                             _(prop$389, [ $(m$415[2]), 0 ]);
                             _(TS$75[3], [ m$415[2] ]);
                             return m$415[0];
                           }
                           catch (exn$1072) {
                             if (exn$1072[0] === Not_found$20g) {
                               {
                                 var start$416 = _(TS$75[1], [ 0 ]);
                                 var result$417 =
                                   function () { try { return $(_(f$410, [ k$411 ])); } catch (e$418) { return $1(e$418); } }();
                                 var finish$419 = _(TS$75[1], [ 0 ]);
                                 var m$420 = $(result$417, start$416, finish$419);
                                 _(oc$Froc_hashtbl$[1], [ h$409, k$411, m$420 ]);
                                 var cancel$421 =
                                   _f(function (param$1073) {
                                        return __(oc$Froc_hashtbl$[3],
                                                  [ h$409, k$411, _f(function (m$27$422) { return m$27$422 === m$420; }) ]);
                                      });
                                 _(TS$75[4], [ finish$419, cancel$421 ]);
                                 return result$417;
                               }
                             }
                             throw exn$1072;
                           }
                         }();
                       switch ($t(result$412)) { case 0: return result$412[0]; case 1: throw result$412[0]; default: return null; }
                     });
         });
    var add_reader2$425 =
      _f(function (t1$426, t2$427, read$428) {
           var start$429 = _(TS$75[1], [ 0 ]);
           _(read$428, [ 0 ]);
           var r$430 = $(read$428, start$429, _(TS$75[1], [ 0 ]));
           var dep$431 = _f(function (param$1069) { return __(enqueue$266, [ r$430 ]); });
           _(add_dep$191, [ start$429, t1$426, dep$431 ]);
           return __(add_dep$191, [ start$429, t2$427, dep$431 ]);
         });
    var bind2_gen$432 =
      _f(function (eq$433, return$434, assign$435, f$436, t1$437, t2$438) {
           var match$1061 = t1$437;
           var match$1062 = t2$438;
           var $r132_0 = null;
           var $r132 = false;
           r$132: {
             {
               var $r133 = false;
               r$133: {
                 {
                   var $r134 = false;
                   r$134:
                     switch ($t(match$1061))
                     {
                     case 0:
                       var match$1064 = match$1061[1];
                       switch ($t(match$1064))
                       {
                       case 0:
                         switch ($t(match$1062))
                         {
                         case 0:
                           var match$1066 = match$1062[1];
                           switch ($t(match$1066))
                           {
                           case 0:
                             try {
                               return _(return$434, [ _(f$436, [ match$1064[0], match$1066[0] ]) ]);
                             }
                             catch (e$443) {
                               return __(fail$142, [ e$443 ]);
                             }
                             break;
                           default: $r134 = true; break r$134;
                           }
                           break;
                         default: $r133 = true; break r$133;
                         }
                         break;
                       case 1: $r132_0 = match$1064[0]; $r132 = true; break r$132;
                       default: return null;
                       }
                       break;
                     default: $r134 = true; break r$134;
                     }
                   if ($r134)
                     switch ($t(match$1062))
                     {
                     case 0:
                       var match$1068 = match$1062[1];
                       switch ($t(match$1068))
                       {
                       case 1: $r132_0 = match$1068[0]; $r132 = true; break r$132;
                       default: $r133 = true; break r$133;
                       }
                       break;
                     default: $r133 = true; break r$133;
                     }
                 }
               }
               if ($r133) {
                 {
                   var match$1058 = _(make_changeable$127, [ eq$433, 0, 0 ]);
                   var ru$445 = match$1058[1];
                   _(add_reader2$425,
                     [
                       t1$437,
                       t2$438,
                       _f(function (param$1053) {
                            var match$1056 = _(read_result$170, [ t1$437 ]);
                            var match$1057 = _(read_result$170, [ t2$438 ]);
                            var $r129_0 = null;
                            var $r129 = false;
                            r$129:
                              switch ($t(match$1056))
                              {
                              case 0:
                                switch ($t(match$1057))
                                {
                                case 0:
                                  try {
                                    return _(assign$435, [ ru$445, _(f$436, [ match$1056[0], match$1057[0] ]) ]);
                                  }
                                  catch (e$450) {
                                    return __(write_exn$167, [ ru$445, e$450 ]);
                                  }
                                  break;
                                default: $r129_0 = match$1057[0]; $r129 = true; break r$129;
                                }
                                break;
                              case 1: $r129_0 = match$1056[0]; $r129 = true; break r$129;
                              default: return null;
                              }
                            if ($r129) { { var e$446 = $r129_0; return __(write_exn$167, [ ru$445, e$446 ]); } }
                          })
                     ]);
                   return match$1058[0];
                 }
               }
             }
           }
           if ($r132) { { var e$439 = $r132_0; return __(fail$142, [ e$439 ]); } }
         });
    var bind2$451 =
      _f(function (eq$452, t1$453, t2$454, f$455) {
           return __(bind2_gen$432, [ eq$452, _f(function (prim$1052) { return prim$1052; }), connect$280, f$455, t1$453, t2$454 ]);
         });
    var lift2$456 = _f(function (eq$457, f$458) { return __(bind2_gen$432, [ eq$457, return$140, write$164, f$458 ]); });
    var blift2$459 = _f(function (eq$460, t1$461, t2$462, f$463) { return __(lift2$456, [ eq$460, f$463, t1$461, t2$462 ]); });
    var add_reader3$464 =
      _f(function (t1$465, t2$466, t3$467, read$468) {
           var start$469 = _(TS$75[1], [ 0 ]);
           _(read$468, [ 0 ]);
           var r$470 = $(read$468, start$469, _(TS$75[1], [ 0 ]));
           var dep$471 = _f(function (param$1050) { return __(enqueue$266, [ r$470 ]); });
           _(add_dep$191, [ start$469, t1$465, dep$471 ]);
           _(add_dep$191, [ start$469, t2$466, dep$471 ]);
           return __(add_dep$191, [ start$469, t3$467, dep$471 ]);
         });
    var bind3_gen$472 =
      _f(function (eq$473, return$474, assign$475, f$476, t1$477, t2$478, t3$479) {
           var match$1037 = t1$477;
           var match$1038 = t2$478;
           var match$1039 = t3$479;
           var $r115_0 = null;
           var $r115 = false;
           r$115: {
             {
               var $r116 = false;
               r$116: {
                 {
                   var $r117 = false;
                   r$117: {
                     {
                       var $r118 = false;
                       r$118:
                         switch ($t(match$1037))
                         {
                         case 0:
                           var match$1041 = match$1037[1];
                           switch ($t(match$1041))
                           {
                           case 0:
                             switch ($t(match$1038))
                             {
                             case 0:
                               var match$1043 = match$1038[1];
                               switch ($t(match$1043))
                               {
                               case 0:
                                 switch ($t(match$1039))
                                 {
                                 case 0:
                                   var match$1045 = match$1039[1];
                                   switch ($t(match$1045))
                                   {
                                   case 0:
                                     try {
                                       return _(return$474, [ _(f$476, [ match$1041[0], match$1043[0], match$1045[0] ]) ]);
                                     }
                                     catch (e$486) {
                                       return __(fail$142, [ e$486 ]);
                                     }
                                     break;
                                   default: $r117 = true; break r$117;
                                   }
                                   break;
                                 default: $r116 = true; break r$116;
                                 }
                                 break;
                               default: $r118 = true; break r$118;
                               }
                               break;
                             default: $r117 = true; break r$117;
                             }
                             break;
                           case 1: $r115_0 = match$1041[0]; $r115 = true; break r$115;
                           default: return null;
                           }
                           break;
                         default: $r118 = true; break r$118;
                         }
                       if ($r118)
                         switch ($t(match$1038))
                         {
                         case 0:
                           var match$1047 = match$1038[1];
                           switch ($t(match$1047))
                           {
                           case 1: $r115_0 = match$1047[0]; $r115 = true; break r$115;
                           default: $r117 = true; break r$117;
                           }
                           break;
                         default: $r117 = true; break r$117;
                         }
                     }
                   }
                   if ($r117)
                     switch ($t(match$1039))
                     {
                     case 0:
                       var match$1049 = match$1039[1];
                       switch ($t(match$1049))
                       {
                       case 1: $r115_0 = match$1049[0]; $r115 = true; break r$115;
                       default: $r116 = true; break r$116;
                       }
                       break;
                     default: $r116 = true; break r$116;
                     }
                 }
               }
               if ($r116) {
                 {
                   var match$1033 = _(make_changeable$127, [ eq$473, 0, 0 ]);
                   var ru$488 = match$1033[1];
                   _(add_reader3$464,
                     [
                       t1$477,
                       t2$478,
                       t3$479,
                       _f(function (param$1026) {
                            var match$1030 = _(read_result$170, [ t1$477 ]);
                            var match$1031 = _(read_result$170, [ t2$478 ]);
                            var match$1032 = _(read_result$170, [ t3$479 ]);
                            var $r111_0 = null;
                            var $r111 = false;
                            r$111:
                              switch ($t(match$1030))
                              {
                              case 0:
                                switch ($t(match$1031))
                                {
                                case 0:
                                  switch ($t(match$1032))
                                  {
                                  case 0:
                                    try {
                                      return _(assign$475, [ ru$488, _(f$476, [ match$1030[0], match$1031[0], match$1032[0] ]) ]);
                                    }
                                    catch (e$495) {
                                      return __(write_exn$167, [ ru$488, e$495 ]);
                                    }
                                    break;
                                  default: $r111_0 = match$1032[0]; $r111 = true; break r$111;
                                  }
                                  break;
                                default: $r111_0 = match$1031[0]; $r111 = true; break r$111;
                                }
                                break;
                              case 1: $r111_0 = match$1030[0]; $r111 = true; break r$111;
                              default: return null;
                              }
                            if ($r111) { { var e$489 = $r111_0; return __(write_exn$167, [ ru$488, e$489 ]); } }
                          })
                     ]);
                   return match$1033[0];
                 }
               }
             }
           }
           if ($r115) { { var e$480 = $r115_0; return __(fail$142, [ e$480 ]); } }
         });
    var bind3$496 =
      _f(function (eq$497, t1$498, t2$499, t3$500, f$501) {
           return __(bind3_gen$472,
                     [ eq$497, _f(function (prim$1025) { return prim$1025; }), connect$280, f$501, t1$498, t2$499, t3$500 ]);
         });
    var lift3$502 = _f(function (eq$503, f$504) { return __(bind3_gen$472, [ eq$503, return$140, write$164, f$504 ]); });
    var blift3$505 =
      _f(function (eq$506, t1$507, t2$508, t3$509, f$510) { return __(lift3$502, [ eq$506, f$510, t1$507, t2$508, t3$509 ]); });
    var add_reader4$511 =
      _f(function (t1$512, t2$513, t3$514, t4$515, read$516) {
           var start$517 = _(TS$75[1], [ 0 ]);
           _(read$516, [ 0 ]);
           var r$518 = $(read$516, start$517, _(TS$75[1], [ 0 ]));
           var dep$519 = _f(function (param$1023) { return __(enqueue$266, [ r$518 ]); });
           _(add_dep$191, [ start$517, t1$512, dep$519 ]);
           _(add_dep$191, [ start$517, t2$513, dep$519 ]);
           _(add_dep$191, [ start$517, t3$514, dep$519 ]);
           return __(add_dep$191, [ start$517, t4$515, dep$519 ]);
         });
    var bind4_gen$520 =
      _f(function (eq$521, return$522, assign$523, f$524, t1$525, t2$526, t3$527, t4$528) {
           var match$1005 = t1$525;
           var match$1006 = t2$526;
           var match$1007 = t3$527;
           var match$1008 = t4$528;
           var $r96_0 = null;
           var $r96 = false;
           r$96: {
             {
               var $r97 = false;
               r$97: {
                 {
                   var $r98 = false;
                   r$98: {
                     {
                       var $r99 = false;
                       r$99: {
                         {
                           var $r100 = false;
                           r$100:
                             switch ($t(match$1005))
                             {
                             case 0:
                               var match$1010 = match$1005[1];
                               switch ($t(match$1010))
                               {
                               case 0:
                                 switch ($t(match$1006))
                                 {
                                 case 0:
                                   var match$1012 = match$1006[1];
                                   switch ($t(match$1012))
                                   {
                                   case 0:
                                     switch ($t(match$1007))
                                     {
                                     case 0:
                                       var match$1014 = match$1007[1];
                                       switch ($t(match$1014))
                                       {
                                       case 0:
                                         switch ($t(match$1008))
                                         {
                                         case 0:
                                           var match$1016 = match$1008[1];
                                           switch ($t(match$1016))
                                           {
                                           case 0:
                                             try {
                                               return _(return$522,
                                                        [
                                                          _(f$524, [ match$1010[0], match$1012[0], match$1014[0], match$1016[0] ])
                                                        ]);
                                             }
                                             catch (e$537) {
                                               return __(fail$142, [ e$537 ]);
                                             }
                                             break;
                                           default: $r98 = true; break r$98;
                                           }
                                           break;
                                         default: $r97 = true; break r$97;
                                         }
                                         break;
                                       default: $r99 = true; break r$99;
                                       }
                                       break;
                                     default: $r98 = true; break r$98;
                                     }
                                     break;
                                   default: $r100 = true; break r$100;
                                   }
                                   break;
                                 default: $r99 = true; break r$99;
                                 }
                                 break;
                               case 1: $r96_0 = match$1010[0]; $r96 = true; break r$96;
                               default: return null;
                               }
                               break;
                             default: $r100 = true; break r$100;
                             }
                           if ($r100)
                             switch ($t(match$1006))
                             {
                             case 0:
                               var match$1018 = match$1006[1];
                               switch ($t(match$1018))
                               {
                               case 1: $r96_0 = match$1018[0]; $r96 = true; break r$96;
                               default: $r99 = true; break r$99;
                               }
                               break;
                             default: $r99 = true; break r$99;
                             }
                         }
                       }
                       if ($r99)
                         switch ($t(match$1007))
                         {
                         case 0:
                           var match$1020 = match$1007[1];
                           switch ($t(match$1020))
                           {
                           case 1: $r96_0 = match$1020[0]; $r96 = true; break r$96;
                           default: $r98 = true; break r$98;
                           }
                           break;
                         default: $r98 = true; break r$98;
                         }
                     }
                   }
                   if ($r98)
                     switch ($t(match$1008))
                     {
                     case 0:
                       var match$1022 = match$1008[1];
                       switch ($t(match$1022))
                       {
                       case 1: $r96_0 = match$1022[0]; $r96 = true; break r$96;
                       default: $r97 = true; break r$97;
                       }
                       break;
                     default: $r97 = true; break r$97;
                     }
                 }
               }
               if ($r97) {
                 {
                   var match$1000 = _(make_changeable$127, [ eq$521, 0, 0 ]);
                   var ru$539 = match$1000[1];
                   _(add_reader4$511,
                     [
                       t1$525,
                       t2$526,
                       t3$527,
                       t4$528,
                       _f(function (param$991) {
                            var match$996 = _(read_result$170, [ t1$525 ]);
                            var match$997 = _(read_result$170, [ t2$526 ]);
                            var match$998 = _(read_result$170, [ t3$527 ]);
                            var match$999 = _(read_result$170, [ t4$528 ]);
                            var $r91_0 = null;
                            var $r91 = false;
                            r$91:
                              switch ($t(match$996))
                              {
                              case 0:
                                switch ($t(match$997))
                                {
                                case 0:
                                  switch ($t(match$998))
                                  {
                                  case 0:
                                    switch ($t(match$999))
                                    {
                                    case 0:
                                      try {
                                        return _(assign$523,
                                                 [ ru$539, _(f$524, [ match$996[0], match$997[0], match$998[0], match$999[0] ]) ]);
                                      }
                                      catch (e$548) {
                                        return __(write_exn$167, [ ru$539, e$548 ]);
                                      }
                                      break;
                                    default: $r91_0 = match$999[0]; $r91 = true; break r$91;
                                    }
                                    break;
                                  default: $r91_0 = match$998[0]; $r91 = true; break r$91;
                                  }
                                  break;
                                default: $r91_0 = match$997[0]; $r91 = true; break r$91;
                                }
                                break;
                              case 1: $r91_0 = match$996[0]; $r91 = true; break r$91;
                              default: return null;
                              }
                            if ($r91) { { var e$540 = $r91_0; return __(write_exn$167, [ ru$539, e$540 ]); } }
                          })
                     ]);
                   return match$1000[0];
                 }
               }
             }
           }
           if ($r96) { { var e$529 = $r96_0; return __(fail$142, [ e$529 ]); } }
         });
    var bind4$549 =
      _f(function (eq$550, t1$551, t2$552, t3$553, t4$554, f$555) {
           return __(bind4_gen$520,
                     [ eq$550, _f(function (prim$990) { return prim$990; }), connect$280, f$555, t1$551, t2$552, t3$553, t4$554 ]);
         });
    var lift4$556 = _f(function (eq$557, f$558) { return __(bind4_gen$520, [ eq$557, return$140, write$164, f$558 ]); });
    var blift4$559 =
      _f(function (eq$560, t1$561, t2$562, t3$563, t4$564, f$565) {
           return __(lift4$556, [ eq$560, f$565, t1$561, t2$562, t3$563, t4$564 ]);
         });
    var add_reader5$566 =
      _f(function (t1$567, t2$568, t3$569, t4$570, t5$571, read$572) {
           var start$573 = _(TS$75[1], [ 0 ]);
           _(read$572, [ 0 ]);
           var r$574 = $(read$572, start$573, _(TS$75[1], [ 0 ]));
           var dep$575 = _f(function (param$988) { return __(enqueue$266, [ r$574 ]); });
           _(add_dep$191, [ start$573, t1$567, dep$575 ]);
           _(add_dep$191, [ start$573, t2$568, dep$575 ]);
           _(add_dep$191, [ start$573, t3$569, dep$575 ]);
           _(add_dep$191, [ start$573, t4$570, dep$575 ]);
           return __(add_dep$191, [ start$573, t5$571, dep$575 ]);
         });
    var bind5_gen$576 =
      _f(function (eq$577, return$578, assign$579, f$580, t1$581, t2$582, t3$583, t4$584, t5$585) {
           var match$965 = t1$581;
           var match$966 = t2$582;
           var match$967 = t3$583;
           var match$968 = t4$584;
           var match$969 = t5$585;
           var $r75_0 = null;
           var $r75 = false;
           r$75: {
             {
               var $r76 = false;
               r$76: {
                 {
                   var $r77 = false;
                   r$77: {
                     {
                       var $r78 = false;
                       r$78: {
                         {
                           var $r79 = false;
                           r$79: {
                             {
                               var $r80 = false;
                               r$80:
                                 switch ($t(match$965))
                                 {
                                 case 0:
                                   var match$971 = match$965[1];
                                   switch ($t(match$971))
                                   {
                                   case 0:
                                     switch ($t(match$966))
                                     {
                                     case 0:
                                       var match$973 = match$966[1];
                                       switch ($t(match$973))
                                       {
                                       case 0:
                                         switch ($t(match$967))
                                         {
                                         case 0:
                                           var match$975 = match$967[1];
                                           switch ($t(match$975))
                                           {
                                           case 0:
                                             switch ($t(match$968))
                                             {
                                             case 0:
                                               var match$977 = match$968[1];
                                               switch ($t(match$977))
                                               {
                                               case 0:
                                                 switch ($t(match$969))
                                                 {
                                                 case 0:
                                                   var match$979 = match$969[1];
                                                   switch ($t(match$979))
                                                   {
                                                   case 0:
                                                     try {
                                                       return _(return$578,
                                                                [
                                                                  _(f$580,
                                                                    [
                                                                    match$971[0],
                                                                    match$973[0],
                                                                    match$975[0],
                                                                    match$977[0],
                                                                    match$979[0]
                                                                    ])
                                                                ]);
                                                     }
                                                     catch (e$596) {
                                                       return __(fail$142, [ e$596 ]);
                                                     }
                                                     break;
                                                   default: $r77 = true; break r$77;
                                                   }
                                                   break;
                                                 default: $r76 = true; break r$76;
                                                 }
                                                 break;
                                               default: $r78 = true; break r$78;
                                               }
                                               break;
                                             default: $r77 = true; break r$77;
                                             }
                                             break;
                                           default: $r79 = true; break r$79;
                                           }
                                           break;
                                         default: $r78 = true; break r$78;
                                         }
                                         break;
                                       default: $r80 = true; break r$80;
                                       }
                                       break;
                                     default: $r79 = true; break r$79;
                                     }
                                     break;
                                   case 1: $r75_0 = match$971[0]; $r75 = true; break r$75;
                                   default: return null;
                                   }
                                   break;
                                 default: $r80 = true; break r$80;
                                 }
                               if ($r80)
                                 switch ($t(match$966))
                                 {
                                 case 0:
                                   var match$981 = match$966[1];
                                   switch ($t(match$981))
                                   {
                                   case 1: $r75_0 = match$981[0]; $r75 = true; break r$75;
                                   default: $r79 = true; break r$79;
                                   }
                                   break;
                                 default: $r79 = true; break r$79;
                                 }
                             }
                           }
                           if ($r79)
                             switch ($t(match$967))
                             {
                             case 0:
                               var match$983 = match$967[1];
                               switch ($t(match$983))
                               {
                               case 1: $r75_0 = match$983[0]; $r75 = true; break r$75;
                               default: $r78 = true; break r$78;
                               }
                               break;
                             default: $r78 = true; break r$78;
                             }
                         }
                       }
                       if ($r78)
                         switch ($t(match$968))
                         {
                         case 0:
                           var match$985 = match$968[1];
                           switch ($t(match$985))
                           {
                           case 1: $r75_0 = match$985[0]; $r75 = true; break r$75;
                           default: $r77 = true; break r$77;
                           }
                           break;
                         default: $r77 = true; break r$77;
                         }
                     }
                   }
                   if ($r77)
                     switch ($t(match$969))
                     {
                     case 0:
                       var match$987 = match$969[1];
                       switch ($t(match$987))
                       {
                       case 1: $r75_0 = match$987[0]; $r75 = true; break r$75;
                       default: $r76 = true; break r$76;
                       }
                       break;
                     default: $r76 = true; break r$76;
                     }
                 }
               }
               if ($r76) {
                 {
                   var match$959 = _(make_changeable$127, [ eq$577, 0, 0 ]);
                   var ru$598 = match$959[1];
                   _(add_reader5$566,
                     [
                       t1$581,
                       t2$582,
                       t3$583,
                       t4$584,
                       t5$585,
                       _f(function (param$948) {
                            var match$954 = _(read_result$170, [ t1$581 ]);
                            var match$955 = _(read_result$170, [ t2$582 ]);
                            var match$956 = _(read_result$170, [ t3$583 ]);
                            var match$957 = _(read_result$170, [ t4$584 ]);
                            var match$958 = _(read_result$170, [ t5$585 ]);
                            var $r69_0 = null;
                            var $r69 = false;
                            r$69:
                              switch ($t(match$954))
                              {
                              case 0:
                                switch ($t(match$955))
                                {
                                case 0:
                                  switch ($t(match$956))
                                  {
                                  case 0:
                                    switch ($t(match$957))
                                    {
                                    case 0:
                                      switch ($t(match$958))
                                      {
                                      case 0:
                                        try {
                                          return _(assign$579,
                                                   [
                                                     ru$598,
                                                     _(f$580,
                                                       [ match$954[0], match$955[0], match$956[0], match$957[0], match$958[0] ])
                                                   ]);
                                        }
                                        catch (e$609) {
                                          return __(write_exn$167, [ ru$598, e$609 ]);
                                        }
                                        break;
                                      default: $r69_0 = match$958[0]; $r69 = true; break r$69;
                                      }
                                      break;
                                    default: $r69_0 = match$957[0]; $r69 = true; break r$69;
                                    }
                                    break;
                                  default: $r69_0 = match$956[0]; $r69 = true; break r$69;
                                  }
                                  break;
                                default: $r69_0 = match$955[0]; $r69 = true; break r$69;
                                }
                                break;
                              case 1: $r69_0 = match$954[0]; $r69 = true; break r$69;
                              default: return null;
                              }
                            if ($r69) { { var e$599 = $r69_0; return __(write_exn$167, [ ru$598, e$599 ]); } }
                          })
                     ]);
                   return match$959[0];
                 }
               }
             }
           }
           if ($r75) { { var e$586 = $r75_0; return __(fail$142, [ e$586 ]); } }
         });
    var bind5$610 =
      _f(function (eq$611, t1$612, t2$613, t3$614, t4$615, t5$616, f$617) {
           return __(bind5_gen$576,
                     [
                       eq$611,
                       _f(function (prim$947) { return prim$947; }),
                       connect$280,
                       f$617,
                       t1$612,
                       t2$613,
                       t3$614,
                       t4$615,
                       t5$616
                     ]);
         });
    var lift5$618 = _f(function (eq$619, f$620) { return __(bind5_gen$576, [ eq$619, return$140, write$164, f$620 ]); });
    var blift5$621 =
      _f(function (eq$622, t1$623, t2$624, t3$625, t4$626, t5$627, f$628) {
           return __(lift5$618, [ eq$622, f$628, t1$623, t2$624, t3$625, t4$626, t5$627 ]);
         });
    var add_reader6$629 =
      _f(function (t1$630, t2$631, t3$632, t4$633, t5$634, t6$635, read$636) {
           var start$637 = _(TS$75[1], [ 0 ]);
           _(read$636, [ 0 ]);
           var r$638 = $(read$636, start$637, _(TS$75[1], [ 0 ]));
           var dep$639 = _f(function (param$945) { return __(enqueue$266, [ r$638 ]); });
           _(add_dep$191, [ start$637, t1$630, dep$639 ]);
           _(add_dep$191, [ start$637, t2$631, dep$639 ]);
           _(add_dep$191, [ start$637, t3$632, dep$639 ]);
           _(add_dep$191, [ start$637, t4$633, dep$639 ]);
           _(add_dep$191, [ start$637, t5$634, dep$639 ]);
           return __(add_dep$191, [ start$637, t6$635, dep$639 ]);
         });
    var bind6_gen$640 =
      _f(function (eq$641, return$642, assign$643, f$644, t1$645, t2$646, t3$647, t4$648, t5$649, t6$650) {
           var match$917 = t1$645;
           var match$918 = t2$646;
           var match$919 = t3$647;
           var match$920 = t4$648;
           var match$921 = t5$649;
           var match$922 = t6$650;
           var $r52_0 = null;
           var $r52 = false;
           r$52: {
             {
               var $r53 = false;
               r$53: {
                 {
                   var $r54 = false;
                   r$54: {
                     {
                       var $r55 = false;
                       r$55: {
                         {
                           var $r56 = false;
                           r$56: {
                             {
                               var $r57 = false;
                               r$57: {
                                 {
                                   var $r58 = false;
                                   r$58:
                                     switch ($t(match$917))
                                     {
                                     case 0:
                                       var match$924 = match$917[1];
                                       switch ($t(match$924))
                                       {
                                       case 0:
                                         switch ($t(match$918))
                                         {
                                         case 0:
                                           var match$926 = match$918[1];
                                           switch ($t(match$926))
                                           {
                                           case 0:
                                             switch ($t(match$919))
                                             {
                                             case 0:
                                               var match$928 = match$919[1];
                                               switch ($t(match$928))
                                               {
                                               case 0:
                                                 switch ($t(match$920))
                                                 {
                                                 case 0:
                                                   var match$930 = match$920[1];
                                                   switch ($t(match$930))
                                                   {
                                                   case 0:
                                                     switch ($t(match$921))
                                                     {
                                                     case 0:
                                                       var match$932 = match$921[1];
                                                       switch ($t(match$932))
                                                       {
                                                       case 0:
                                                         switch ($t(match$922))
                                                         {
                                                         case 0:
                                                           var match$934 = match$922[1];
                                                           switch ($t(match$934))
                                                           {
                                                           case 0:
                                                             try {
                                                               return _
                                                                    (return$642,
                                                                    [
                                                                    _
                                                                    (f$644,
                                                                    [
                                                                    match$924[0],
                                                                    match$926[0],
                                                                    match$928[0],
                                                                    match$930[0],
                                                                    match$932[0],
                                                                    match$934[0]
                                                                    ])
                                                                    ]);
                                                             }
                                                             catch (e$663) {
                                                               return __(fail$142, [ e$663 ]);
                                                             }
                                                             break;
                                                           default: $r54 = true; break r$54;
                                                           }
                                                           break;
                                                         default: $r53 = true; break r$53;
                                                         }
                                                         break;
                                                       default: $r55 = true; break r$55;
                                                       }
                                                       break;
                                                     default: $r54 = true; break r$54;
                                                     }
                                                     break;
                                                   default: $r56 = true; break r$56;
                                                   }
                                                   break;
                                                 default: $r55 = true; break r$55;
                                                 }
                                                 break;
                                               default: $r57 = true; break r$57;
                                               }
                                               break;
                                             default: $r56 = true; break r$56;
                                             }
                                             break;
                                           default: $r58 = true; break r$58;
                                           }
                                           break;
                                         default: $r57 = true; break r$57;
                                         }
                                         break;
                                       case 1: $r52_0 = match$924[0]; $r52 = true; break r$52;
                                       default: return null;
                                       }
                                       break;
                                     default: $r58 = true; break r$58;
                                     }
                                   if ($r58)
                                     switch ($t(match$918))
                                     {
                                     case 0:
                                       var match$936 = match$918[1];
                                       switch ($t(match$936))
                                       {
                                       case 1: $r52_0 = match$936[0]; $r52 = true; break r$52;
                                       default: $r57 = true; break r$57;
                                       }
                                       break;
                                     default: $r57 = true; break r$57;
                                     }
                                 }
                               }
                               if ($r57)
                                 switch ($t(match$919))
                                 {
                                 case 0:
                                   var match$938 = match$919[1];
                                   switch ($t(match$938))
                                   {
                                   case 1: $r52_0 = match$938[0]; $r52 = true; break r$52;
                                   default: $r56 = true; break r$56;
                                   }
                                   break;
                                 default: $r56 = true; break r$56;
                                 }
                             }
                           }
                           if ($r56)
                             switch ($t(match$920))
                             {
                             case 0:
                               var match$940 = match$920[1];
                               switch ($t(match$940))
                               {
                               case 1: $r52_0 = match$940[0]; $r52 = true; break r$52;
                               default: $r55 = true; break r$55;
                               }
                               break;
                             default: $r55 = true; break r$55;
                             }
                         }
                       }
                       if ($r55)
                         switch ($t(match$921))
                         {
                         case 0:
                           var match$942 = match$921[1];
                           switch ($t(match$942))
                           {
                           case 1: $r52_0 = match$942[0]; $r52 = true; break r$52;
                           default: $r54 = true; break r$54;
                           }
                           break;
                         default: $r54 = true; break r$54;
                         }
                     }
                   }
                   if ($r54)
                     switch ($t(match$922))
                     {
                     case 0:
                       var match$944 = match$922[1];
                       switch ($t(match$944))
                       {
                       case 1: $r52_0 = match$944[0]; $r52 = true; break r$52;
                       default: $r53 = true; break r$53;
                       }
                       break;
                     default: $r53 = true; break r$53;
                     }
                 }
               }
               if ($r53) {
                 {
                   var match$910 = _(make_changeable$127, [ eq$641, 0, 0 ]);
                   var ru$665 = match$910[1];
                   _(add_reader6$629,
                     [
                       t1$645,
                       t2$646,
                       t3$647,
                       t4$648,
                       t5$649,
                       t6$650,
                       _f(function (param$897) {
                            var match$904 = _(read_result$170, [ t1$645 ]);
                            var match$905 = _(read_result$170, [ t2$646 ]);
                            var match$906 = _(read_result$170, [ t3$647 ]);
                            var match$907 = _(read_result$170, [ t4$648 ]);
                            var match$908 = _(read_result$170, [ t5$649 ]);
                            var match$909 = _(read_result$170, [ t6$650 ]);
                            var $r45_0 = null;
                            var $r45 = false;
                            r$45:
                              switch ($t(match$904))
                              {
                              case 0:
                                switch ($t(match$905))
                                {
                                case 0:
                                  switch ($t(match$906))
                                  {
                                  case 0:
                                    switch ($t(match$907))
                                    {
                                    case 0:
                                      switch ($t(match$908))
                                      {
                                      case 0:
                                        switch ($t(match$909))
                                        {
                                        case 0:
                                          try {
                                            return _(assign$643,
                                                     [
                                                       ru$665,
                                                       _(f$644,
                                                         [
                                                           match$904[0],
                                                           match$905[0],
                                                           match$906[0],
                                                           match$907[0],
                                                           match$908[0],
                                                           match$909[0]
                                                         ])
                                                     ]);
                                          }
                                          catch (e$678) {
                                            return __(write_exn$167, [ ru$665, e$678 ]);
                                          }
                                          break;
                                        default: $r45_0 = match$909[0]; $r45 = true; break r$45;
                                        }
                                        break;
                                      default: $r45_0 = match$908[0]; $r45 = true; break r$45;
                                      }
                                      break;
                                    default: $r45_0 = match$907[0]; $r45 = true; break r$45;
                                    }
                                    break;
                                  default: $r45_0 = match$906[0]; $r45 = true; break r$45;
                                  }
                                  break;
                                default: $r45_0 = match$905[0]; $r45 = true; break r$45;
                                }
                                break;
                              case 1: $r45_0 = match$904[0]; $r45 = true; break r$45;
                              default: return null;
                              }
                            if ($r45) { { var e$666 = $r45_0; return __(write_exn$167, [ ru$665, e$666 ]); } }
                          })
                     ]);
                   return match$910[0];
                 }
               }
             }
           }
           if ($r52) { { var e$651 = $r52_0; return __(fail$142, [ e$651 ]); } }
         });
    var bind6$679 =
      _f(function (eq$680, t1$681, t2$682, t3$683, t4$684, t5$685, t6$686, f$687) {
           return __(bind6_gen$640,
                     [
                       eq$680,
                       _f(function (prim$896) { return prim$896; }),
                       connect$280,
                       f$687,
                       t1$681,
                       t2$682,
                       t3$683,
                       t4$684,
                       t5$685,
                       t6$686
                     ]);
         });
    var lift6$688 = _f(function (eq$689, f$690) { return __(bind6_gen$640, [ eq$689, return$140, write$164, f$690 ]); });
    var blift6$691 =
      _f(function (eq$692, t1$693, t2$694, t3$695, t4$696, t5$697, t6$698, f$699) {
           return __(lift6$688, [ eq$692, f$699, t1$693, t2$694, t3$695, t4$696, t5$697, t6$698 ]);
         });
    var add_reader7$700 =
      _f(function (t1$701, t2$702, t3$703, t4$704, t5$705, t6$706, t7$707, read$708) {
           var start$709 = _(TS$75[1], [ 0 ]);
           _(read$708, [ 0 ]);
           var r$710 = $(read$708, start$709, _(TS$75[1], [ 0 ]));
           var dep$711 = _f(function (param$894) { return __(enqueue$266, [ r$710 ]); });
           _(add_dep$191, [ start$709, t1$701, dep$711 ]);
           _(add_dep$191, [ start$709, t2$702, dep$711 ]);
           _(add_dep$191, [ start$709, t3$703, dep$711 ]);
           _(add_dep$191, [ start$709, t4$704, dep$711 ]);
           _(add_dep$191, [ start$709, t5$705, dep$711 ]);
           _(add_dep$191, [ start$709, t6$706, dep$711 ]);
           return __(add_dep$191, [ start$709, t7$707, dep$711 ]);
         });
    var bind7_gen$712 =
      _f(function (eq$713, return$714, assign$715, f$716, t1$717, t2$718, t3$719, t4$720, t5$721, t6$722, t7$723) {
           var match$861 = t1$717;
           var match$862 = t2$718;
           var match$863 = t3$719;
           var match$864 = t4$720;
           var match$865 = t5$721;
           var match$866 = t6$722;
           var match$867 = t7$723;
           var $r27_0 = null;
           var $r27 = false;
           r$27: {
             {
               var $r28 = false;
               r$28: {
                 {
                   var $r29 = false;
                   r$29: {
                     {
                       var $r30 = false;
                       r$30: {
                         {
                           var $r31 = false;
                           r$31: {
                             {
                               var $r32 = false;
                               r$32: {
                                 {
                                   var $r33 = false;
                                   r$33: {
                                     {
                                       var $r34 = false;
                                       r$34:
                                         switch ($t(match$861))
                                         {
                                         case 0:
                                           var match$869 = match$861[1];
                                           switch ($t(match$869))
                                           {
                                           case 0:
                                             switch ($t(match$862))
                                             {
                                             case 0:
                                               var match$871 = match$862[1];
                                               switch ($t(match$871))
                                               {
                                               case 0:
                                                 switch ($t(match$863))
                                                 {
                                                 case 0:
                                                   var match$873 = match$863[1];
                                                   switch ($t(match$873))
                                                   {
                                                   case 0:
                                                     switch ($t(match$864))
                                                     {
                                                     case 0:
                                                       var match$875 = match$864[1];
                                                       switch ($t(match$875))
                                                       {
                                                       case 0:
                                                         switch ($t(match$865))
                                                         {
                                                         case 0:
                                                           var match$877 = match$865[1];
                                                           switch ($t(match$877))
                                                           {
                                                           case 0:
                                                             switch (
                                                             $t(match$866))
                                                             {
                                                             case 0:
                                                               var match$879 = match$866[1];
                                                               switch (
                                                               $t(match$879))
                                                               {
                                                               case 0:
                                                                 switch (
                                                                 $t(match$867))
                                                                 {
                                                                 case 0:
                                                                   var match$881 = match$867[1];
                                                                   switch (
                                                                   $t(match$881))
                                                                   {
                                                                   case 0:
                                                                    try {
                                                                    return _
                                                                    (return$714,
                                                                    [
                                                                    _
                                                                    (f$716,
                                                                    [
                                                                    match$869[0],
                                                                    match$871[0],
                                                                    match$873[0],
                                                                    match$875[0],
                                                                    match$877[0],
                                                                    match$879[0],
                                                                    match$881[0]
                                                                    ])
                                                                    ]);
                                                                    }
                                                                    catch (e$738) {
                                                                    return __(fail$142, [ e$738 ]);
                                                                    }
                                                                    break;
                                                                   default: $r29 = true; break r$29;
                                                                   }
                                                                   break;
                                                                 default: $r28 = true; break r$28;
                                                                 }
                                                                 break;
                                                               default: $r30 = true; break r$30;
                                                               }
                                                               break;
                                                             default: $r29 = true; break r$29;
                                                             }
                                                             break;
                                                           default: $r31 = true; break r$31;
                                                           }
                                                           break;
                                                         default: $r30 = true; break r$30;
                                                         }
                                                         break;
                                                       default: $r32 = true; break r$32;
                                                       }
                                                       break;
                                                     default: $r31 = true; break r$31;
                                                     }
                                                     break;
                                                   default: $r33 = true; break r$33;
                                                   }
                                                   break;
                                                 default: $r32 = true; break r$32;
                                                 }
                                                 break;
                                               default: $r34 = true; break r$34;
                                               }
                                               break;
                                             default: $r33 = true; break r$33;
                                             }
                                             break;
                                           case 1: $r27_0 = match$869[0]; $r27 = true; break r$27;
                                           default: return null;
                                           }
                                           break;
                                         default: $r34 = true; break r$34;
                                         }
                                       if ($r34)
                                         switch ($t(match$862))
                                         {
                                         case 0:
                                           var match$883 = match$862[1];
                                           switch ($t(match$883))
                                           {
                                           case 1: $r27_0 = match$883[0]; $r27 = true; break r$27;
                                           default: $r33 = true; break r$33;
                                           }
                                           break;
                                         default: $r33 = true; break r$33;
                                         }
                                     }
                                   }
                                   if ($r33)
                                     switch ($t(match$863))
                                     {
                                     case 0:
                                       var match$885 = match$863[1];
                                       switch ($t(match$885))
                                       {
                                       case 1: $r27_0 = match$885[0]; $r27 = true; break r$27;
                                       default: $r32 = true; break r$32;
                                       }
                                       break;
                                     default: $r32 = true; break r$32;
                                     }
                                 }
                               }
                               if ($r32)
                                 switch ($t(match$864))
                                 {
                                 case 0:
                                   var match$887 = match$864[1];
                                   switch ($t(match$887))
                                   {
                                   case 1: $r27_0 = match$887[0]; $r27 = true; break r$27;
                                   default: $r31 = true; break r$31;
                                   }
                                   break;
                                 default: $r31 = true; break r$31;
                                 }
                             }
                           }
                           if ($r31)
                             switch ($t(match$865))
                             {
                             case 0:
                               var match$889 = match$865[1];
                               switch ($t(match$889))
                               {
                               case 1: $r27_0 = match$889[0]; $r27 = true; break r$27;
                               default: $r30 = true; break r$30;
                               }
                               break;
                             default: $r30 = true; break r$30;
                             }
                         }
                       }
                       if ($r30)
                         switch ($t(match$866))
                         {
                         case 0:
                           var match$891 = match$866[1];
                           switch ($t(match$891))
                           {
                           case 1: $r27_0 = match$891[0]; $r27 = true; break r$27;
                           default: $r29 = true; break r$29;
                           }
                           break;
                         default: $r29 = true; break r$29;
                         }
                     }
                   }
                   if ($r29)
                     switch ($t(match$867))
                     {
                     case 0:
                       var match$893 = match$867[1];
                       switch ($t(match$893))
                       {
                       case 1: $r27_0 = match$893[0]; $r27 = true; break r$27;
                       default: $r28 = true; break r$28;
                       }
                       break;
                     default: $r28 = true; break r$28;
                     }
                 }
               }
               if ($r28) {
                 {
                   var match$853 = _(make_changeable$127, [ eq$713, 0, 0 ]);
                   var ru$740 = match$853[1];
                   _(add_reader7$700,
                     [
                       t1$717,
                       t2$718,
                       t3$719,
                       t4$720,
                       t5$721,
                       t6$722,
                       t7$723,
                       _f(function (param$838) {
                            var match$846 = _(read_result$170, [ t1$717 ]);
                            var match$847 = _(read_result$170, [ t2$718 ]);
                            var match$848 = _(read_result$170, [ t3$719 ]);
                            var match$849 = _(read_result$170, [ t4$720 ]);
                            var match$850 = _(read_result$170, [ t5$721 ]);
                            var match$851 = _(read_result$170, [ t6$722 ]);
                            var match$852 = _(read_result$170, [ t7$723 ]);
                            var $r19_0 = null;
                            var $r19 = false;
                            r$19:
                              switch ($t(match$846))
                              {
                              case 0:
                                switch ($t(match$847))
                                {
                                case 0:
                                  switch ($t(match$848))
                                  {
                                  case 0:
                                    switch ($t(match$849))
                                    {
                                    case 0:
                                      switch ($t(match$850))
                                      {
                                      case 0:
                                        switch ($t(match$851))
                                        {
                                        case 0:
                                          switch ($t(match$852))
                                          {
                                          case 0:
                                            try {
                                              return _(assign$715,
                                                       [
                                                         ru$740,
                                                         _(f$716,
                                                           [
                                                             match$846[0],
                                                             match$847[0],
                                                             match$848[0],
                                                             match$849[0],
                                                             match$850[0],
                                                             match$851[0],
                                                             match$852[0]
                                                           ])
                                                       ]);
                                            }
                                            catch (e$755) {
                                              return __(write_exn$167, [ ru$740, e$755 ]);
                                            }
                                            break;
                                          default: $r19_0 = match$852[0]; $r19 = true; break r$19;
                                          }
                                          break;
                                        default: $r19_0 = match$851[0]; $r19 = true; break r$19;
                                        }
                                        break;
                                      default: $r19_0 = match$850[0]; $r19 = true; break r$19;
                                      }
                                      break;
                                    default: $r19_0 = match$849[0]; $r19 = true; break r$19;
                                    }
                                    break;
                                  default: $r19_0 = match$848[0]; $r19 = true; break r$19;
                                  }
                                  break;
                                default: $r19_0 = match$847[0]; $r19 = true; break r$19;
                                }
                                break;
                              case 1: $r19_0 = match$846[0]; $r19 = true; break r$19;
                              default: return null;
                              }
                            if ($r19) { { var e$741 = $r19_0; return __(write_exn$167, [ ru$740, e$741 ]); } }
                          })
                     ]);
                   return match$853[0];
                 }
               }
             }
           }
           if ($r27) { { var e$724 = $r27_0; return __(fail$142, [ e$724 ]); } }
         });
    var bind7$756 =
      _f(function (eq$757, t1$758, t2$759, t3$760, t4$761, t5$762, t6$763, t7$764, f$765) {
           return __(bind7_gen$712,
                     [
                       eq$757,
                       _f(function (prim$837) { return prim$837; }),
                       connect$280,
                       f$765,
                       t1$758,
                       t2$759,
                       t3$760,
                       t4$761,
                       t5$762,
                       t6$763,
                       t7$764
                     ]);
         });
    var lift7$766 = _f(function (eq$767, f$768) { return __(bind7_gen$712, [ eq$767, return$140, write$164, f$768 ]); });
    var blift7$769 =
      _f(function (eq$770, t1$771, t2$772, t3$773, t4$774, t5$775, t6$776, t7$777, f$778) {
           return __(lift7$766, [ eq$770, f$778, t1$771, t2$772, t3$773, t4$774, t5$775, t6$776, t7$777 ]);
         });
    var add_readerN$779 =
      _f(function (ts$780, read$781) {
           var start$782 = _(TS$75[1], [ 0 ]);
           _(read$781, [ 0 ]);
           var r$783 = $(read$781, start$782, _(TS$75[1], [ 0 ]));
           var dep$784 = _f(function (param$835) { return __(enqueue$266, [ r$783 ]); });
           return __(oc$List$[9], [ _f(function (t$785) { return __(add_dep$191, [ start$782, t$785, dep$784 ]); }), ts$780 ]);
         });
    var bindN_gen$786 =
      _f(function (eq$787, return$788, assign$789, f$790, ts$791) {
           var loop$792 =
             _f(function (vs$793, param$829) {
                  if (param$829) {
                    {
                      var match$832 = param$829[0];
                      switch ($t(match$832))
                      {
                      case 0:
                        var match$834 = match$832[1];
                        switch ($t(match$834))
                        {
                        case 0: return __(loop$792, [ $(match$834[0], vs$793), param$829[1] ]);
                        case 1: return __(fail$142, [ match$834[0] ]);
                        default: return null;
                        }
                        break;
                      default:
                        var match$831 = _(make_changeable$127, [ eq$787, 0, 0 ]);
                        var ru$800 = match$831[1];
                        _(add_readerN$779,
                          [
                            ts$791,
                            _f(function (param$830) {
                                 try {
                                   var vs$801 = _(oc$List$[10], [ read$174, ts$791 ]);
                                   return _(assign$789, [ ru$800, _(f$790, [ vs$801 ]) ]);
                                 }
                                 catch (e$802) {
                                   return __(write_exn$167, [ ru$800, e$802 ]);
                                 }
                               })
                          ]);
                        return match$831[0];
                      }
                    }
                  }
                  try {
                    return _(return$788, [ _(f$790, [ _(oc$List$[4], [ vs$793 ]) ]) ]);
                  }
                  catch (e$796) {
                    return __(fail$142, [ e$796 ]);
                  }
                });
           return __(loop$792, [ 0, ts$791 ]);
         });
    var bindN$803 =
      _f(function (eq$804, ts$805, f$806) {
           return __(bindN_gen$786, [ eq$804, _f(function (prim$828) { return prim$828; }), connect$280, f$806, ts$805 ]);
         });
    var liftN$807 = _f(function (eq$808, f$809) { return __(bindN_gen$786, [ eq$808, return$140, write$164, f$809 ]); });
    var bliftN$810 = _f(function (eq$811, ts$812, f$813) { return __(liftN$807, [ eq$811, f$813, ts$812 ]); });
    return $(Unset$122, make_cancel$179, no_cancel$181, cancel$182, changeable$137, return$140, fail$142, is_constant$144,
             bind$323, $3E$3E$3D$327, lift$330, blift$333, add_reader$274, add_reader_cancel$268, catch$380, try_bind$355,
             catch_lift$384, try_bind_lift$360, read$174, read_result$170, write$164, write_exn$167, write_result$149, clear$146,
             notify$301, notify_cancel$296, notify_result$292, notify_result_cancel$283, connect$280, connect_cancel$277,
             cleanup$306, make_changeable$127, make_constant$135, hash$118, init$265, propagate$393, set_exn_handler$80,
             set_debug$77, memo$405, bind2$451, lift2$456, blift2$459, add_reader2$425, bind3$496, lift3$502, blift3$505,
             add_reader3$464, bind4$549, lift4$556, blift4$559, add_reader4$511, bind5$610, lift5$618, blift5$621, add_reader5$566,
             bind6$679, lift6$688, blift6$691, add_reader6$629, bind7$756, lift7$766, blift7$769, add_reader7$700, bindN$803,
             liftN$807, bliftN$810, add_readerN$779);
  }();
var oc$Froc$ =
  function () {
    var include$302 = oc$Froc_ddg$;
    var Unset$60 = include$302[0];
    var no_cancel$63 = include$302[2];
    var cancel$64 = include$302[3];
    var is_constant$69 = include$302[7];
    var bind$70 = include$302[8];
    var read_result$81 = include$302[19];
    var write_result$84 = include$302[22];
    var notify$86 = include$302[24];
    var notify_cancel$87 = include$302[25];
    var notify_result$88 = include$302[26];
    var notify_result_cancel$89 = include$302[27];
    var connect$90 = include$302[28];
    var make_changeable$93 = include$302[31];
    var make_constant$94 = include$302[32];
    var hash$95 = include$302[33];
    var debug$131 = $(_f(function (prim$335) { return 0; }));
    var set_debug$132 = _f(function (f$133) { debug$131[0] = f$133; return __(include$302[37], [ f$133 ]); });
    var q$136 = _(oc$Queue$[1], [ 0 ]);
    var temps$137 = $(0);
    var running$138 = $(0);
    var init$139 =
      _f(function (param$334) {
           _(include$302[34], [ 0 ]);
           _(oc$Queue$[8], [ q$136 ]);
           temps$137[0] = 0;
           return running$138[0] = 0;
         });
    var run_queue$140 =
      _f(function (param$333) {
           if (!running$138[0]) {
             {
               running$138[0] = 1;
               try {
                 while (!_(oc$Queue$[10], [ q$136 ])) _(oc$Queue$[4], [ q$136, 0 ]);
                 return running$138[0] = 0;
               }
               catch (e$141) {
                 running$138[0] = 0;
                 throw e$141;
               }
             }
           }
           return 0;
         });
    var with_run_queue$142 =
      _f(function (f$143) {
           var running$27$144 = running$138[0];
           running$138[0] = 1;
           _(f$143, [ 0 ]);
           running$138[0] = running$27$144;
           return __(run_queue$140, [ 0 ]);
         });
    var write_temp_result$145 =
      _f(function (u$146, r$147) {
           temps$137[0] = $(_f(function (param$332) { return __(include$302[23], [ u$146 ]); }), temps$137[0]);
           return __(write_result$84, [ u$146, r$147 ]);
         });
    var send_result$148 =
      _f(function (s$149, r$150) {
           var match$331 = temps$137[0];
           if (match$331) return __(oc$Pervasives$[1], [ "already in update loop" ]);
           return __(with_run_queue$142,
                     [
                       _f(function (param$330) {
                            _(write_temp_result$145, [ s$149, r$150 ]);
                            _(include$302[35], [ 0 ]);
                            _(oc$List$[9], [ _f(function (f$151) { return __(f$151, [ 0 ]); }), temps$137[0] ]);
                            return temps$137[0] = 0;
                          })
                     ]);
         });
    var send$152 = _f(function (s$153, v$154) { return __(send_result$148, [ s$153, $(v$154) ]); });
    var send_exn$155 = _f(function (s$156, e$157) { return __(send_result$148, [ s$156, $1(e$157) ]); });
    var send_result_deferred$158 =
      _f(function (u$159, r$160) {
           _(oc$Queue$[2], [ _f(function (param$329) { return __(send_result$148, [ u$159, r$160 ]); }), q$136 ]);
           return __(run_queue$140, [ 0 ]);
         });
    var send_deferred$161 = _f(function (u$162, v$163) { return __(send_result_deferred$158, [ u$162, $(v$163) ]); });
    var send_exn_deferred$164 = _f(function (u$165, e$166) { return __(send_result_deferred$158, [ u$165, $1(e$166) ]); });
    var never_eq$167 = _f(function (param$327, param$328) { return 0; });
    var make_event$168 = _f(function (param$326) { return __(make_changeable$93, [ $(never_eq$167), 0, 0 ]); });
    var never$169 = _(make_constant$94, [ $1($(Unset$60)) ]);
    var notify_result_e_cancel$171 = _f(function (t$172, f$173) { return __(notify_result_cancel$89, [ $(0), t$172, f$173 ]); });
    var notify_result_e$174 = _f(function (t$175, f$176) { return __(notify_result$88, [ $(0), t$175, f$176 ]); });
    var notify_e_cancel$177 = _f(function (t$178, f$179) { return __(notify_cancel$87, [ $(0), t$178, f$179 ]); });
    var notify_e$180 = _f(function (t$181, f$182) { return __(notify$86, [ $(0), t$181, f$182 ]); });
    var next$184 =
      _f(function (t$185) {
           if (_(is_constant$69, [ t$185 ])) return never$169;
           var match$325 = _(make_event$168, [ 0 ]);
           var c$188 = $(no_cancel$63);
           c$188[0] =
             _(notify_result_e_cancel$171,
               [
                 t$185,
                 _f(function (r$189) {
                      _(cancel$64, [ c$188[0] ]);
                      c$188[0] = no_cancel$63;
                      return __(write_temp_result$145, [ match$325[1], r$189 ]);
                    })
               ]);
           return match$325[0];
         });
    var merge$190 =
      _f(function (ts$191) {
           if (_(oc$List$[19], [ is_constant$69, ts$191 ])) return never$169;
           var match$324 = _(make_event$168, [ 0 ]);
           var notify$194 = $(0);
           _(include$302[66],
             [
               ts$191,
               _f(function (param$321) {
                    if (!notify$194[0]) return notify$194[0] = 1;
                    var loop$195 =
                      _f(function (param$322) {
                           if (param$322) {
                             {
                               var r$198 = _(read_result$81, [ param$322[0] ]);
                               switch ($t(r$198))
                               {
                               case 1: if (r$198[0][0] === Unset$60) return __(loop$195, [ param$322[1] ]); return r$198;
                               default: return r$198;
                               }
                             }
                           }
                           throw $(Assert_failure$26g, $("froc.ml", 124, 18));
                         });
                    return __(write_temp_result$145, [ match$324[1], _(loop$195, [ ts$191 ]) ]);
                  })
             ]);
           return match$324[0];
         });
    var map$199 =
      _f(function (f$200, t$201) {
           if (_(is_constant$69, [ t$201 ])) return never$169;
           var match$320 = _(make_event$168, [ 0 ]);
           _(notify_result_e$174,
             [
               t$201,
               _f(function (r$204) {
                    var r$205 =
                      function () {
                        switch ($t(r$204))
                        {
                        case 0: try { return $(_(f$200, [ r$204[0] ])); } catch (e$208) { return $1(e$208); } break;
                        case 1: return $1(r$204[0]);
                        default: return null;
                        }
                      }();
                    return __(write_temp_result$145, [ match$320[1], r$205 ]);
                  })
             ]);
           return match$320[0];
         });
    var filter$209 =
      _f(function (p$210, t$211) {
           if (_(is_constant$69, [ t$211 ])) return never$169;
           var match$319 = _(make_event$168, [ 0 ]);
           _(notify_result_e$174,
             [
               t$211,
               _f(function (r$214) {
                    var r$215 =
                      function () {
                        switch ($t(r$214))
                        {
                        case 0:
                          var v$216 = r$214[0];
                          try { if (_(p$210, [ v$216 ])) return $($(v$216)); return 0; } catch (e$217) { return $($1(e$217)); }
                          break;
                        case 1: return $(r$214);
                        default: return null;
                        }
                      }();
                    if (r$215) return __(write_temp_result$145, [ match$319[1], r$215[0] ]);
                    return 0;
                  })
             ]);
           return match$319[0];
         });
    var collect$219 =
      _f(function (f$220, init$221, t$222) {
           if (_(is_constant$69, [ t$222 ])) return never$169;
           var match$317 = _(make_event$168, [ 0 ]);
           var st$225 = $($(init$221));
           _(notify_result_e$174,
             [
               t$222,
               _f(function (r$226) {
                    var r$227 =
                      function () {
                        var match$314 = st$225[0];
                        switch ($t(match$314))
                        {
                        case 0:
                          switch ($t(r$226))
                          {
                          case 0:
                            try { return $($(_(f$220, [ match$314[0], r$226[0] ]))); } catch (e$231) { return $($1(e$231)); }
                            break;
                          default: return $($1(r$226[0]));
                          }
                          break;
                        case 1: return 0;
                        default: return null;
                        }
                      }();
                    if (r$227) {
                      { var r$232 = r$227[0]; st$225[0] = r$232; return __(write_temp_result$145, [ match$317[1], r$232 ]); }
                    }
                    return 0;
                  })
             ]);
           return match$317[0];
         });
    var join_e$233 =
      _f(function (ee$234) {
           if (_(is_constant$69, [ ee$234 ])) return never$169;
           var match$313 = _(make_event$168, [ 0 ]);
           var ru$236 = match$313[1];
           _(notify_result_e$174,
             [
               ee$234,
               _f(function (param$312) {
                    switch ($t(param$312))
                    {
                    case 0: return __(notify_result_e$174, [ param$312[0], _(write_temp_result$145, [ ru$236 ]) ]);
                    case 1: return __(write_temp_result$145, [ ru$236, $1(param$312[0]) ]);
                    default: return null;
                    }
                  })
             ]);
           return match$313[0];
         });
    var fix_e$239 =
      _f(function (ef$240) {
           var match$311 = _(make_event$168, [ 0 ]);
           var e$243 = _(ef$240, [ match$311[0] ]);
           _(notify_result_e$174, [ e$243, _(send_result_deferred$158, [ match$311[1] ]) ]);
           return e$243;
         });
    var join_b$252 =
      _f(function (eq$253, bb$254) { return __(bind$70, [ eq$253, bb$254, _f(function (b$255) { return b$255; }) ]); });
    var fix_b$256 =
      _f(function (eq$257, bf$258) {
           var match$310 = _(make_changeable$93, [ eq$257, 0, 0 ]);
           var b$261 = _(bf$258, [ match$310[0] ]);
           _(notify_result$88,
             [
               0,
               b$261,
               _f(function (r$262) {
                    _(oc$Queue$[2], [ _f(function (param$309) { return __(write_result$84, [ match$310[1], r$262 ]); }), q$136 ]);
                    return __(run_queue$140, [ 0 ]);
                  })
             ]);
           return b$261;
         });
    var switch$263 =
      _f(function (eq$264, b$265, e$266) {
           if (_(is_constant$69, [ e$266 ])) return b$265;
           var match$308 = _(make_changeable$93, [ eq$264, 0, 0 ]);
           var bu$268 = match$308[1];
           _(notify_result$88,
             [
               0,
               e$266,
               _f(function (param$307) {
                    switch ($t(param$307))
                    {
                    case 0: return __(connect$90, [ bu$268, param$307[0] ]);
                    case 1:
                      var e$270 = param$307[0];
                      if (e$270[0] === Unset$60) return __(connect$90, [ bu$268, b$265 ]);
                      return __(include$302[21], [ bu$268, e$270 ]);
                    default: return null;
                    }
                  })
             ]);
           return match$308[0];
         });
    var until$271 = _f(function (eq$272, b$273, e$274) { return __(switch$263, [ eq$272, b$273, _(next$184, [ e$274 ]) ]); });
    var hold_result$275 =
      _f(function (eq$276, init$277, e$278) {
           if (_(is_constant$69, [ e$278 ])) return __(make_constant$94, [ init$277 ]);
           var match$306 = _(make_changeable$93, [ eq$276, $(init$277), 0 ]);
           _(notify_result_e$174, [ e$278, _(write_result$84, [ match$306[1] ]) ]);
           return match$306[0];
         });
    var hold$281 = _f(function (eq$282, init$283, e$284) { return __(hold_result$275, [ eq$282, $(init$283), e$284 ]); });
    var changes$285 =
      _f(function (b$286) {
           if (_(is_constant$69, [ b$286 ])) return never$169;
           var match$305 = _(make_event$168, [ 0 ]);
           _(notify_result$88, [ $(0), b$286, _(write_temp_result$145, [ match$305[1] ]) ]);
           return match$305[0];
         });
    var when_true$289 =
      _f(function (b$290) {
           return __(map$199,
                     [
                       _f(function (b$291) { return 0; }),
                       _(filter$209, [ _f(function (b$292) { return b$292; }), _(changes$285, [ b$290 ]) ])
                     ]);
         });
    var count$293 =
      _f(function (t$294) {
           return __(hold$281, [ 0, 0, _(collect$219, [ _f(function (n$295, param$304) { return n$295 + 1; }), 0, t$294 ]) ]);
         });
    var make_cell$296 =
      _f(function (v$297) {
           var match$303 = _(make_event$168, [ 0 ]);
           return $(_(hold$281, [ 0, v$297, match$303[0] ]), _(send_deferred$161, [ match$303[1] ]));
         });
    return $(include$302[5], include$302[6], bind$70, include$302[9], 
             include$302[11], include$302[10], include$302[18], read_result$81, 
             include$302[14], include$302[16], include$302[15], include$302[17], join_b$252, fix_b$256, notify$86,
             notify_cancel$87, notify_result$88, notify_result_cancel$89, hash$95, make_event$168, never$169, notify_e$180,
             notify_e_cancel$177, notify_result_e$174, notify_result_e_cancel$171, send$152, send_exn$155, send_result$148,
             send_deferred$161, send_exn_deferred$164, send_result_deferred$158, next$184, merge$190, map$199, filter$209,
             collect$219, join_e$233, fix_e$239, hash$95, switch$263, until$271, hold$281, hold_result$275, changes$285,
             when_true$289, count$293, make_cell$296, init$139, no_cancel$63, cancel$64, 
             include$302[30], include$302[38], include$302[36], set_debug$132, 
             include$302[39], include$302[41], include$302[40], include$302[43], 
             include$302[45], include$302[44], include$302[47], include$302[49], 
             include$302[48], include$302[51], include$302[53], include$302[52], 
             include$302[55], include$302[57], include$302[56], include$302[59], 
             include$302[61], include$302[60], include$302[63], include$302[65], 
             include$302[64]);
  }();
var oc$Ocamljs$ =
  function () {
    var option_of_nullable$74 = _f(function (x$75) { if (x$75 === null) return 0; return $(x$75); });
    var nullable_of_option$76 = _f(function (x$77) { if (x$77) return x$77[0]; return null; });
    var is_null$79 = _f(function (a$80) { return caml_equal(a$80, null); });
    var Inline$262 = function () { var Jslib_ast$256 = $(); var _loc$261 = 0; return $(Jslib_ast$256, _loc$261); }();
    return $(option_of_nullable$74, nullable_of_option$76, is_null$79, Inline$262);
  }();
var oc$Javascript$ =
  function () {
    var typeof$78 = _f(function (o$79) { return typeof o$79; });
    var true_$80 = true;
    var false_$81 = false;
    var new_Date$119 = _f(function (param$147) { return new Date(); });
    var Js_string$144 = $();
    var Math$146 = function () { var pi$145 = Math.PI; return $(pi$145); }();
    return $(typeof$78, true_$80, false_$81, new_Date$119, Js_string$144, Math$146);
  }();
var oc$Dom$ = function () { var window$723 = window; var document$724 = document; return $(window$723, document$724); }();
var oc$Froc_dom$ =
  function () {
    var $7C$3E$58 = _f(function (x$59, f$60) { return __(f$60, [ x$59 ]); });
    var ticks_b$63 =
      _f(function (msb$64) {
           var match$201 = _(oc$Froc$[19], [ 0 ]);
           var id$67 = $(0);
           var clear$68 =
             _f(function (param$199) {
                  var match$200 = id$67[0];
                  if (match$200) {
                    {
                      (function () { var v$210 = oc$Dom$[0]; return _m(v$210.clearInterval, v$210, [ match$200[0] ]); }());
                      return id$67[0] = 0;
                    }
                  }
                  return 0;
                });
           var set_interval$70 =
             _f(function (r$71) {
                  _(clear$68, [ 0 ]);
                  switch ($t(r$71))
                  {
                  case 0:
                    return id$67[0] =
                             $(function () {
                                 var v$209 = oc$Dom$[0];
                                 return _m(v$209.setInterval, v$209,
                                           [ _f(function (param$197) { return __(oc$Froc$[25], [ match$201[1], 0 ]); }), r$71[0] ]);
                               }());
                  case 1: return 0;
                  default: return null;
                  }
                });
           _(oc$Froc$[50], [ clear$68 ]);
           _(oc$Froc$[16], [ 0, msb$64, set_interval$70 ]);
           return match$201[0];
         });
    var ticks$73 =
      _f(function (ms$74) {
           var match$196 = _(oc$Froc$[19], [ 0 ]);
           var id$77 =
             function () {
               var v$208 = oc$Dom$[0];
               return _m(v$208.setInterval, v$208,
                         [ _f(function (param$195) { return __(oc$Froc$[25], [ match$196[1], 0 ]); }), ms$74 ]);
             }();
           _(oc$Froc$[50],
             [
               _f(function (param$194) {
                    return function () { var v$207 = oc$Dom$[0]; return __m(v$207.clearInterval, v$207, [ id$77 ]); }();
                  })
             ]);
           return match$196[0];
         });
    var send_delayed_event$87 =
      _f(function (e$88, de$89) {
           var send$90 =
             _f(function (de$91) {
                  if (!(de$91[1] === de$91)) {
                    {
                      _(oc$Froc$[30], [ e$88, de$91[0] ]);
                      var de_next$92 = de$91[1];
                      de$91[1] = de$91;
                      return __(send$90, [ de_next$92 ]);
                    }
                  }
                  return 0;
                });
           return __(send$90, [ de$89 ]);
         });
    var delay_eb$93 =
      _f(function (t$94, msb$95) {
           var match$193 = _(oc$Froc$[19], [ 0 ]);
           var s$97 = match$193[1];
           var de$98 = $($1($(oc$Pervasives$[2])), de$98);
           de$98[1] = de$98;
           var de_next$99 = $(de$98);
           _(oc$Froc$[23],
             [
               t$94,
               _f(function (r$100) {
                    var r$101 = _(oc$Froc$[7], [ msb$95 ]);
                    switch ($t(r$101))
                    {
                    case 0:
                      var de$103 = $(r$100, de_next$99[0]);
                      de_next$99[0] = de$103;
                      (function () {
                         var v$206 = oc$Dom$[0];
                         return _m(v$206.setTimeout, v$206,
                                   [ _f(function (param$189) { return __(send_delayed_event$87, [ s$97, de$103 ]); }), r$101[0] ]);
                       }());
                      return 0;
                    case 1: de_next$99[0] = $(r$101, de_next$99[0]); return __(send_delayed_event$87, [ s$97, de_next$99[0] ]);
                    default: return null;
                    }
                  })
             ]);
           return match$193[0];
         });
    var delay_e$104 = _f(function (t$105, ms$106) { return __(delay_eb$93, [ t$105, _(oc$Froc$[0], [ ms$106 ]) ]); });
    var delay_bb$107 =
      _f(function (t$108, msb$109) {
           return __($7C$3E$58,
                     [
                       _($7C$3E$58,
                         [
                           _($7C$3E$58, [ t$108, oc$Froc$[43] ]),
                           _f(function (e$110) { return __(delay_eb$93, [ e$110, msb$109 ]); })
                         ]),
                       _(oc$Froc$[42], [ 0, _(oc$Froc$[7], [ t$108 ]) ])
                     ]);
         });
    var delay_b$111 = _f(function (t$112, ms$113) { return __(delay_bb$107, [ t$112, _(oc$Froc$[0], [ ms$113 ]) ]); });
    var mouse_e$114 =
      _f(function (param$185) {
           var match$187 = _(oc$Froc$[19], [ 0 ]);
           var f$117 = _f(function (me$118) { return __(oc$Froc$[25], [ match$187[1], $(me$118.clientX, me$118.clientY) ]); });
           (function () { var v$205 = oc$Dom$[1]; return _m(v$205.addEventListener, v$205, [ "mousemove", f$117, 0 ]); }());
           _(oc$Froc$[50],
             [
               _f(function (param$186) {
                    return function () {
                             var v$204 = oc$Dom$[1];
                             return __m(v$204.addEventListener, v$204, [ "mousemove", f$117, 0 ]);
                           }();
                  })
             ]);
           return match$187[0];
         });
    var mouse_b$119 = _f(function (param$184) { return __(oc$Froc$[41], [ 0, $(0, 0), _(mouse_e$114, [ 0 ]) ]); });
    var attach_innerHTML$120 =
      _f(function (elem$121, b$122) {
           var e$123 = _(oc$Froc$[43], [ b$122 ]);
           return __(oc$Froc$[21], [ e$123, _f(function (s$124) { return elem$121.innerHTML = s$124; }) ]);
         });
    var input_value_e$125 =
      _f(function (input$126) {
           var match$183 = _(oc$Froc$[19], [ 0 ]);
           var f$129 = _f(function (param$182) { return __(oc$Froc$[25], [ match$183[1], input$126.value ]); });
           _m(input$126.addEventListener, input$126, [ "change", f$129, 0 ]);
           _(oc$Froc$[50],
             [ _f(function (param$181) { return __m(input$126.addEventListener, input$126, [ "change", f$129, 0 ]); }) ]);
           return match$183[0];
         });
    var input_value_b$130 =
      _f(function (input$131) { return __(oc$Froc$[41], [ 0, input$131.value, _(input_value_e$125, [ input$131 ]) ]); });
    var attach_input_value_e$132 =
      _f(function (i$133, e$134) { return __(oc$Froc$[21], [ e$134, _f(function (v$135) { return i$133.value = v$135; }) ]); });
    var attach_input_value_b$136 =
      _f(function (i$137, b$138) { return __(attach_input_value_e$132, [ i$137, _(oc$Froc$[43], [ b$138 ]) ]); });
    var attach_backgroundColor_e$139 =
      _f(function (el$140, e$141) {
           return __(oc$Froc$[21], [ e$141, _f(function (v$142) { return el$140.style.backgroundColor = v$142; }) ]);
         });
    var attach_backgroundColor_b$143 =
      _f(function (el$144, b$145) { return __(attach_backgroundColor_e$139, [ el$144, _(oc$Froc$[43], [ b$145 ]) ]); });
    var node_of_result$146 =
      _f(function (param$180) {
           switch ($t(param$180))
           {
           case 0: return param$180[0];
           case 1:
             var s$149 = function () { var v$203 = oc$Dom$[1]; return _m(v$203.createElement, v$203, [ "span" ]); }();
             var t$150 = function () { var v$202 = oc$Dom$[1]; return _m(v$202.createTextNode, v$202, [ "exception" ]); }();
             _m(s$149.appendChild, s$149, [ t$150 ]);
             return s$149;
           default: return null;
           }
         });
    var appendChild$151 =
      _f(function (n$152, nb$153) {
           var old$155 = $(0);
           var update$156 =
             _f(function (r$157) {
                  var c$158 = _(node_of_result$146, [ r$157 ]);
                  var match$179 = old$155[0];
                  if (match$179)
                    _m(n$152.replaceChild, n$152, [ c$158, match$179[0] ]);
                  else
                    _m(n$152.appendChild, n$152, [ c$158 ]);
                  return old$155[0] = $(c$158);
                });
           return __(oc$Froc$[16], [ 0, nb$153, update$156 ]);
         });
    var replaceNode$160 =
      _f(function (n$161, nb$162) {
           var p$164 = n$161.parentNode;
           var old$165 = $(n$161);
           var update$166 =
             _f(function (r$167) {
                  var c$168 = _(node_of_result$146, [ r$167 ]);
                  _m(p$164.replaceChild, p$164, [ c$168, old$165[0] ]);
                  return old$165[0] = c$168;
                });
           return __(oc$Froc$[16], [ 0, nb$162, update$166 ]);
         });
    var clicks$169 =
      _f(function (elem$170) {
           var match$178 = _(oc$Froc$[19], [ 0 ]);
           var f$173 =
             _f(function (ev$174) { _m(ev$174.preventDefault, ev$174, [  ]); return __(oc$Froc$[25], [ match$178[1], 0 ]); });
           _m(elem$170.addEventListener, elem$170, [ "click", f$173, 0 ]);
           _(oc$Froc$[50],
             [ _f(function (param$177) { return __m(elem$170.removeEventListener, elem$170, [ "click", f$173, 0 ]); }) ]);
           return match$178[0];
         });
    return $(ticks$73, ticks_b$63, delay_e$104, delay_eb$93, delay_b$111, delay_bb$107, mouse_e$114, mouse_b$119,
             attach_innerHTML$120, input_value_e$125, input_value_b$130, attach_input_value_e$132, attach_input_value_b$136,
             attach_backgroundColor_e$139, attach_backgroundColor_b$143, appendChild$151, replaceNode$160, clicks$169);
  }();
var oc$Follow$ =
  function () {
    var D$58 = oc$Dom$;
    var F$59 = oc$Froc$;
    var Fd$60 = oc$Froc_dom$;
    var onload$61 =
      _f(function (param$301) {
           var delay$62 = 300.;
           var body$63 = function () { var v$315 = D$58[1]; return _m(v$315.getElementById, v$315, [ "body" ]); }();
           var div$64 =
             _f(function (id$65, color$66, backgroundColor$67, position$68, padding$69, left$70, top$71, cs$72) {
                  var div$73 = function () { var v$314 = D$58[1]; return _m(v$314.createElement, v$314, [ "div" ]); }();
                  _m(div$73.setAttribute, div$73, [ "id", id$65 ]);
                  div$73.style.color = color$66;
                  div$73.style.backgroundColor = backgroundColor$67;
                  div$73.style.position = position$68;
                  div$73.style.padding = padding$69;
                  div$73.style.left = left$70;
                  div$73.style.top = top$71;
                  _(oc$List$[9], [ _f(function (c$74) { _m(div$73.appendChild, div$73, [ c$74 ]); return 0; }), cs$72 ]);
                  return div$73;
                });
           var mouse$75 = _(Fd$60[7], [ 0 ]);
           _(Fd$60[15],
             [
               body$63,
               _(F$59[4],
                 [
                   0,
                   mouse$75,
                   _f(function (param$308) {
                        return __(div$64,
                                  [
                                    "themouse",
                                    "#FFFFFF",
                                    "#000000",
                                    "absolute",
                                    "10px",
                                    _(oc$Pervasives$[19], [ param$308[0] ]),
                                    _(oc$Pervasives$[19], [ param$308[1] ]),
                                    $(function () {
                                        var v$313 = D$58[1];
                                        return _m(v$313.createTextNode, v$313, [ "the mouse!" ]);
                                      }(), 0)
                                  ]);
                      })
                 ])
             ]);
           var mouse_offset$78 =
             (function () { var v$312 = D$58[1]; return _m(v$312.getElementById, v$312, [ "themouse" ]); }()).offsetWidth;
           var tail_pos$79 =
             _(F$59[4],
               [
                 0,
                 _(Fd$60[4], [ mouse$75, delay$62 ]),
                 _f(function (param$307) { return $(param$307[0] + mouse_offset$78, param$307[1]); })
               ]);
           _(Fd$60[15],
             [
               body$63,
               _(F$59[4],
                 [
                   0,
                   tail_pos$79,
                   _f(function (param$306) {
                        return __(div$64,
                                  [
                                    "tail",
                                    "#FF0000",
                                    "#000000",
                                    "absolute",
                                    "10px",
                                    _(oc$Pervasives$[19], [ param$306[0] ]),
                                    _(oc$Pervasives$[19], [ param$306[1] ]),
                                    $(function () { var v$311 = D$58[1]; return _m(v$311.createTextNode, v$311, [ "its tail!" ]); }
                                      (), 0)
                                  ]);
                      })
                 ])
             ]);
           var wag_delay$84 = delay$62 * 1.5;
           var mouseandtail_offset$85 =
             mouse_offset$78 +
               (function () { var v$310 = D$58[1]; return _m(v$310.getElementById, v$310, [ "tail" ]); }()).offsetWidth;
           var wag_offset$86 =
             _(F$59[41],
               [
                 0,
                 0,
                 _(F$59[35],
                   [ _f(function (param$304, param$305) { return _(oc$Random$[4], [ 10 ]) - 5; }), 0, _(Fd$60[0], [ 100. ]) ])
               ]);
           var wag_pos$87 =
             _(F$59[55],
               [
                 0,
                 _(Fd$60[4], [ mouse$75, wag_delay$84 ]),
                 wag_offset$86,
                 _f(function (param$303, wag_offset$90) {
                      return $(param$303[0] + mouseandtail_offset$85, param$303[1] + wag_offset$90);
                    })
               ]);
           return __(Fd$60[15],
                     [
                       body$63,
                       _(F$59[4],
                         [
                           0,
                           wag_pos$87,
                           _f(function (param$302) {
                                return __(div$64,
                                          [
                                            "wagging",
                                            "#FFFF00",
                                            "#000000",
                                            "absolute",
                                            "10px",
                                            _(oc$Pervasives$[19], [ param$302[0] ]),
                                            _(oc$Pervasives$[19], [ param$302[1] ]),
                                            $(function () {
                                                var v$309 = D$58[1];
                                                return _m(v$309.createTextNode, v$309, [ "is happy!" ]);
                                              }(), 0)
                                          ]);
                              })
                         ])
                     ]);
         });
    (D$58[0]).onload = onload$61;
    return $(D$58, F$59, Fd$60, onload$61);
  }();
var oc$Std_exit$ = (_(oc$Pervasives$[80], [ 0 ]), $());
return caml_named_value;
})();
