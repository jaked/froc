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
var oc$Char$ =
  function () {
    var chr$60 = _f(function (n$61) { if (n$61 < 0 || n$61 > 255) return __(oc$Pervasives$[0], [ "Char.chr" ]); return n$61; });
    var escaped$66 =
      _f(function (c$67) {
           var $r7 = false;
           r$7: {
             {
               if (!(c$67 !== 39)) return "\\\'";
               if (!(c$67 !== 92)) return "\\\\";
               if (c$67 >= 14) { { $r7 = true; break r$7; } }
               switch (c$67)
               {
               case 0: $r7 = true; break r$7;
               case 1: $r7 = true; break r$7;
               case 2: $r7 = true; break r$7;
               case 3: $r7 = true; break r$7;
               case 4: $r7 = true; break r$7;
               case 5: $r7 = true; break r$7;
               case 6: $r7 = true; break r$7;
               case 7: $r7 = true; break r$7;
               case 8: return "\\b";
               case 9: return "\\t";
               case 10: return "\\n";
               case 11: $r7 = true; break r$7;
               case 12: $r7 = true; break r$7;
               case 13: return "\\r";
               default: return null;
               }
             }
           }
           if ($r7) {
             {
               if (caml_is_printable(c$67)) { { var s$68 = oc$$cms(1); oc$$ssetu(s$68, 0, c$67); return s$68; } }
               var n$69 = c$67;
               var s$70 = oc$$cms(4);
               oc$$ssetu(s$70, 0, 92);
               oc$$ssetu(s$70, 1, 48 + (n$69 / 100 >> 0));
               oc$$ssetu(s$70, 2, 48 + (n$69 / 10 >> 0) % 10);
               oc$$ssetu(s$70, 3, 48 + n$69 % 10);
               return s$70;
             }
           }
         });
    var lowercase$71 =
      _f(function (c$72) {
           if (c$72 >= 65 && c$72 <= 90 || (c$72 >= 192 && c$72 <= 214 || c$72 >= 216 && c$72 <= 222)) return c$72 + 32;
           return c$72;
         });
    var uppercase$73 =
      _f(function (c$74) {
           if (c$74 >= 97 && c$74 <= 122 || (c$74 >= 224 && c$74 <= 246 || c$74 >= 248 && c$74 <= 254)) return c$74 - 32;
           return c$74;
         });
    var compare$76 = _f(function (c1$77, c2$78) { return c1$77 - c2$78; });
    return $(chr$60, escaped$66, lowercase$71, uppercase$73, compare$76);
  }();
var oc$String$ =
  function () {
    var make$66 = _f(function (n$67, c$68) { var s$69 = oc$$cms(n$67); caml_fill_string(s$69, 0, n$67, c$68); return s$69; });
    var copy$70 =
      _f(function (s$71) {
           var len$72 = s$71.length;
           var r$73 = oc$$cms(len$72);
           caml_blit_string(s$71, 0, r$73, 0, len$72);
           return r$73;
         });
    var sub$74 =
      _f(function (s$75, ofs$76, len$77) {
           if (ofs$76 < 0 || (len$77 < 0 || ofs$76 > s$75.length - len$77)) return __(oc$Pervasives$[0], [ "String.sub" ]);
           var r$78 = oc$$cms(len$77);
           caml_blit_string(s$75, ofs$76, r$78, 0, len$77);
           return r$78;
         });
    var fill$79 =
      _f(function (s$80, ofs$81, len$82, c$83) {
           if (ofs$81 < 0 || (len$82 < 0 || ofs$81 > s$80.length - len$82)) return __(oc$Pervasives$[0], [ "String.fill" ]);
           return caml_fill_string(s$80, ofs$81, len$82, c$83);
         });
    var blit$84 =
      _f(function (s1$85, ofs1$86, s2$87, ofs2$88, len$89) {
           if (len$89 < 0 || (ofs1$86 < 0 || (ofs1$86 > s1$85.length - len$89 || (ofs2$88 < 0 || ofs2$88 > s2$87.length - len$89))))
             return __(oc$Pervasives$[0], [ "String.blit" ]);
           return caml_blit_string(s1$85, ofs1$86, s2$87, ofs2$88, len$89);
         });
    var iter$90 =
      _f(function (f$91, a$92) {
           var i$93;
           for (i$93 = 0; i$93 <= a$92.length - 1; i$93++) { (function (i$93) { _(f$91, [ oc$$srefu(a$92, i$93) ]); }(i$93)); }
         });
    var concat$94 =
      _f(function (sep$95, l$96) {
           if (l$96) {
             {
               var hd$97 = l$96[0];
               var num$99 = $(0);
               var len$100 = $(0);
               _(oc$List$[9], [ _f(function (s$101) { num$99[0]++; return len$100[0] = len$100[0] + s$101.length; }), l$96 ]);
               var r$102 = oc$$cms(len$100[0] + sep$95.length * (num$99[0] - 1));
               caml_blit_string(hd$97, 0, r$102, 0, hd$97.length);
               var pos$103 = $(hd$97.length);
               _(oc$List$[9],
                 [
                   _f(function (s$104) {
                        caml_blit_string(sep$95, 0, r$102, pos$103[0], sep$95.length);
                        pos$103[0] = pos$103[0] + sep$95.length;
                        caml_blit_string(s$104, 0, r$102, pos$103[0], s$104.length);
                        return pos$103[0] = pos$103[0] + s$104.length;
                      }),
                   l$96[1]
                 ]);
               return r$102;
             }
           }
           return "";
         });
    var escaped$108 =
      _f(function (s$109) {
           var n$110 = 0;
           var i$111;
           for (i$111 = 0; i$111 <= s$109.length - 1; i$111++) {
             (function (i$111) {
                n$110 =
                  n$110 +
                    function () {
                      var c$112 = oc$$srefu(s$109, i$111);
                      var $r26 = false;
                      r$26: {
                        {
                          var $r27 = false;
                          r$27: {
                            {
                              if (!(c$112 >= 14)) {
                                {
                                  if (!(c$112 >= 11)) {
                                    { if (!(c$112 >= 8)) { { $r27 = true; break r$27; } } $r26 = true; break r$26; }
                                  }
                                  if (!(c$112 >= 13)) { { $r27 = true; break r$27; } }
                                  $r26 = true;
                                  break r$26;
                                }
                              }
                              if (!(c$112 !== 34)) { { $r26 = true; break r$26; } }
                              if (!(c$112 !== 92)) { { $r26 = true; break r$26; } }
                              $r27 = true;
                              break r$27;
                            }
                          }
                          if ($r27) { { if (caml_is_printable(c$112)) return 1; return 4; } }
                        }
                      }
                      if ($r26) return 2;
                    }();
              }(i$111));
           }
           if (n$110 === s$109.length) return s$109;
           var s$27$113 = oc$$cms(n$110);
           n$110 = 0;
           var i$114;
           for (i$114 = 0; i$114 <= s$109.length - 1; i$114++) {
             (function (i$114) {
                var c$115 = oc$$srefu(s$109, i$114);
                var $r24 = false;
                r$24: {
                  {
                    var switcher$178 = -34 + c$115;
                    if (!(switcher$178 < 0 || switcher$178 > 58)) {
                      {
                        if (!(-1 + switcher$178 < 0 || -1 + switcher$178 > 56)) { { $r24 = true; break r$24; } }
                        oc$$ssetu(s$27$113, n$110, 92);
                        n$110 = 1 + n$110;
                        oc$$ssetu(s$27$113, n$110, c$115);
                      }
                    }
                    else {
                      {
                        if (switcher$178 >= -20) { { $r24 = true; break r$24; } }
                        var s$181 = 34 + switcher$178;
                        switch (s$181)
                        {
                        case 0: $r24 = true; break r$24;
                        case 1: $r24 = true; break r$24;
                        case 2: $r24 = true; break r$24;
                        case 3: $r24 = true; break r$24;
                        case 4: $r24 = true; break r$24;
                        case 5: $r24 = true; break r$24;
                        case 6: $r24 = true; break r$24;
                        case 7: $r24 = true; break r$24;
                        case 8: oc$$ssetu(s$27$113, n$110, 92); n$110 = 1 + n$110; oc$$ssetu(s$27$113, n$110, 98); break;
                        case 9: oc$$ssetu(s$27$113, n$110, 92); n$110 = 1 + n$110; oc$$ssetu(s$27$113, n$110, 116); break;
                        case 10: oc$$ssetu(s$27$113, n$110, 92); n$110 = 1 + n$110; oc$$ssetu(s$27$113, n$110, 110); break;
                        case 11: $r24 = true; break r$24;
                        case 12: $r24 = true; break r$24;
                        case 13: oc$$ssetu(s$27$113, n$110, 92); n$110 = 1 + n$110; oc$$ssetu(s$27$113, n$110, 114); break;
                        default: null;
                        }
                      }
                    }
                  }
                }
                if ($r24)
                  if (caml_is_printable(c$115))
                    oc$$ssetu(s$27$113, n$110, c$115);
                  else {
                    {
                      var a$117 = c$115;
                      oc$$ssetu(s$27$113, n$110, 92);
                      n$110 = 1 + n$110;
                      oc$$ssetu(s$27$113, n$110, 48 + (a$117 / 100 >> 0));
                      n$110 = 1 + n$110;
                      oc$$ssetu(s$27$113, n$110, 48 + (a$117 / 10 >> 0) % 10);
                      n$110 = 1 + n$110;
                      oc$$ssetu(s$27$113, n$110, 48 + a$117 % 10);
                    }
                  }
                n$110 = 1 + n$110;
              }(i$114));
           }
           return s$27$113;
         });
    var map$118 =
      _f(function (f$119, s$120) {
           var l$121 = s$120.length;
           if (l$121 === 0) return s$120;
           var r$122 = oc$$cms(l$121);
           var i$123;
           for (i$123 = 0; i$123 <= l$121 - 1; i$123++) {
             (function (i$123) { oc$$ssetu(r$122, i$123, _(f$119, [ oc$$srefu(s$120, i$123) ])); }(i$123));
           }
           return r$122;
         });
    var uppercase$124 = _f(function (s$125) { return __(map$118, [ oc$Char$[3], s$125 ]); });
    var lowercase$126 = _f(function (s$127) { return __(map$118, [ oc$Char$[2], s$127 ]); });
    var apply1$128 =
      _f(function (f$129, s$130) {
           if (s$130.length === 0) return s$130;
           var r$131 = _(copy$70, [ s$130 ]);
           oc$$ssetu(r$131, 0, _(f$129, [ oc$$srefu(s$130, 0) ]));
           return r$131;
         });
    var capitalize$132 = _f(function (s$133) { return __(apply1$128, [ oc$Char$[3], s$133 ]); });
    var uncapitalize$134 = _f(function (s$135) { return __(apply1$128, [ oc$Char$[2], s$135 ]); });
    var index_rec$136 =
      _f(function (s$137, lim$138, i$139, c$140) {
           if (i$139 >= lim$138) throw $(Not_found$20g);
           if (oc$$srefu(s$137, i$139) === c$140) return i$139;
           return __(index_rec$136, [ s$137, lim$138, i$139 + 1, c$140 ]);
         });
    var index$141 = _f(function (s$142, c$143) { return __(index_rec$136, [ s$142, s$142.length, 0, c$143 ]); });
    var index_from$144 =
      _f(function (s$145, i$146, c$147) {
           var l$148 = s$145.length;
           if (i$146 < 0 || i$146 > l$148) return __(oc$Pervasives$[0], [ "String.index_from" ]);
           return __(index_rec$136, [ s$145, l$148, i$146, c$147 ]);
         });
    var rindex_rec$149 =
      _f(function (s$150, i$151, c$152) {
           if (i$151 < 0) throw $(Not_found$20g);
           if (oc$$srefu(s$150, i$151) === c$152) return i$151;
           return __(rindex_rec$149, [ s$150, i$151 - 1, c$152 ]);
         });
    var rindex$153 = _f(function (s$154, c$155) { return __(rindex_rec$149, [ s$154, s$154.length - 1, c$155 ]); });
    var rindex_from$156 =
      _f(function (s$157, i$158, c$159) {
           if (i$158 < -1 || i$158 >= s$157.length) return __(oc$Pervasives$[0], [ "String.rindex_from" ]);
           return __(rindex_rec$149, [ s$157, i$158, c$159 ]);
         });
    var contains_from$160 =
      _f(function (s$161, i$162, c$163) {
           var l$164 = s$161.length;
           if (i$162 < 0 || i$162 > l$164) return __(oc$Pervasives$[0], [ "String.contains_from" ]);
           try {
             _(index_rec$136, [ s$161, l$164, i$162, c$163 ]);
             return 1;
           }
           catch (exn$177) {
             if (exn$177[0] === Not_found$20g) return 0;
             throw exn$177;
           }
         });
    var contains$165 = _f(function (s$166, c$167) { return __(contains_from$160, [ s$166, 0, c$167 ]); });
    var rcontains_from$168 =
      _f(function (s$169, i$170, c$171) {
           if (i$170 < 0 || i$170 >= s$169.length) return __(oc$Pervasives$[0], [ "String.rcontains_from" ]);
           try {
             _(rindex_rec$149, [ s$169, i$170, c$171 ]);
             return 1;
           }
           catch (exn$176) {
             if (exn$176[0] === Not_found$20g) return 0;
             throw exn$176;
           }
         });
    var compare$173 = _f(function (prim$175, prim$174) { return caml_compare(prim$175, prim$174); });
    return $(make$66, copy$70, sub$74, fill$79, blit$84, concat$94, iter$90, escaped$108, index$141, rindex$153, index_from$144,
             rindex_from$156, contains$165, contains_from$160, rcontains_from$168, uppercase$124, lowercase$126, capitalize$132,
             uncapitalize$134, compare$173);
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
var oc$Buffer$ =
  function () {
    var create$82 = _f(function (n$83) { return $(new Array(), 0, 0); });
    var contents$84 =
      _f(function (b$85) {
           var match$177 = b$85[1];
           if (match$177) return match$177[0];
           var s$87 = (b$85[0]).join("");
           b$85[1] = $(s$87);
           return s$87;
         });
    var sub$88 =
      _f(function (b$89, ofs$90, len$91) {
           if (ofs$90 < 0 || (len$91 < 0 || ofs$90 > b$89[2] - len$91)) _(oc$Pervasives$[0], [ "Buffer.sub" ]); else;
           var s$92 = _(contents$84, [ b$89 ]);
           return s$92.substring(ofs$90, ofs$90 + len$91);
         });
    var blit$93 =
      _f(function (src$94, srcoff$95, dst$96, dstoff$97, len$98) { return __(oc$Pervasives$[1], [ "unimplemented" ]); });
    var nth$99 =
      _f(function (b$100, ofs$101) {
           if (ofs$101 < 0 || ofs$101 >= b$100[2]) _(oc$Pervasives$[0], [ "Buffer.nth" ]); else;
           var s$102 = _(contents$84, [ b$100 ]);
           return s$102.charCodeAt(ofs$101);
         });
    var length$103 = _f(function (b$104) { return b$104[2]; });
    var clear$105 = _f(function (b$106) { b$106[2] = 0; (b$106[0]).length = 0; });
    var add_char$108 =
      _f(function (b$109, c$110) { b$109[1] = 0; b$109[2] = b$109[2] + 1; (b$109[0]).push(String.fromCharCode(c$110)); });
    var add_substring$111 =
      _f(function (b$112, s$113, offset$114, len$115) {
           if (offset$114 < 0 || (len$115 < 0 || offset$114 > s$113.length - len$115))
             _(oc$Pervasives$[0], [ "Buffer.add_substring" ]);
           else;
           b$112[1] = 0;
           b$112[2] = b$112[2] + len$115;
           (b$112[0]).push(s$113.substring(offset$114, offset$114 + len$115));
         });
    var add_string$116 = _f(function (b$117, s$118) { b$117[1] = 0; b$117[2] = b$117[2] + s$118.length; (b$117[0]).push(s$118); });
    var add_buffer$119 = _f(function (b$120, bs$121) { return __(add_string$116, [ b$120, _(contents$84, [ bs$121 ]) ]); });
    var add_channel$122 = _f(function (b$123, ic$124, len$125) { return __(oc$Pervasives$[1], [ "unsupported" ]); });
    var output_buffer$126 = _f(function (oc$127, b$128) { return __(oc$Pervasives$[1], [ "unsupported" ]); });
    var closing$129 =
      _f(function (param$176) {
           if (!(param$176 !== 40)) return 41;
           if (param$176 !== 123) throw $(Assert_failure$26g, $("buffer.ml", 119, 9));
           return 125;
         });
    var advance_to_closing$130 =
      _f(function (opening$131, closing$132, k$133, s$134, start$135) {
           var advance$136 =
             _f(function (k$137, i$138, lim$139) {
                  if (i$138 >= lim$139) throw $(Not_found$20g);
                  if (oc$$srefs(s$134, i$138) === opening$131) return __(advance$136, [ k$137 + 1, i$138 + 1, lim$139 ]);
                  if (!(oc$$srefs(s$134, i$138) === closing$132)) return __(advance$136, [ k$137, i$138 + 1, lim$139 ]);
                  if (k$137 === 0) return i$138;
                  return __(advance$136, [ k$137 - 1, i$138 + 1, lim$139 ]);
                });
           return __(advance$136, [ k$133, start$135, s$134.length ]);
         });
    var advance_to_non_alpha$140 =
      _f(function (s$141, start$142) {
           var advance$143 =
             _f(function (i$144, lim$145) {
                  if (i$144 >= lim$145) return lim$145;
                  var match$173 = oc$$srefs(s$141, i$144);
                  var $r15 = false;
                  r$15: {
                    {
                      if (!(match$173 < 95)) {
                        {
                          if (!(match$173 >= 123)) { { if (match$173 !== 96) { { $r15 = true; break r$15; } } return i$144; } }
                          if (match$173 >= 192) {
                            {
                              var s$179 = -192 + match$173;
                              switch (s$179)
                              {
                              case 0: $r15 = true; break r$15;
                              case 1: $r15 = true; break r$15;
                              case 2: $r15 = true; break r$15;
                              case 3: return i$144;
                              case 4: return i$144;
                              case 5: return i$144;
                              case 6: return i$144;
                              case 7: $r15 = true; break r$15;
                              case 8: $r15 = true; break r$15;
                              case 9: $r15 = true; break r$15;
                              case 10: $r15 = true; break r$15;
                              case 11: $r15 = true; break r$15;
                              case 12: return i$144;
                              case 13: return i$144;
                              case 14: $r15 = true; break r$15;
                              case 15: $r15 = true; break r$15;
                              case 16: return i$144;
                              case 17: return i$144;
                              case 18: return i$144;
                              case 19: return i$144;
                              case 20: $r15 = true; break r$15;
                              case 21: return i$144;
                              case 22: return i$144;
                              case 23: return i$144;
                              case 24: return i$144;
                              case 25: $r15 = true; break r$15;
                              case 26: return i$144;
                              case 27: $r15 = true; break r$15;
                              case 28: $r15 = true; break r$15;
                              case 29: return i$144;
                              case 30: return i$144;
                              case 31: return i$144;
                              case 32: $r15 = true; break r$15;
                              case 33: $r15 = true; break r$15;
                              case 34: $r15 = true; break r$15;
                              case 35: return i$144;
                              case 36: return i$144;
                              case 37: return i$144;
                              case 38: return i$144;
                              case 39: $r15 = true; break r$15;
                              case 40: $r15 = true; break r$15;
                              case 41: $r15 = true; break r$15;
                              case 42: $r15 = true; break r$15;
                              case 43: $r15 = true; break r$15;
                              case 44: return i$144;
                              case 45: return i$144;
                              case 46: $r15 = true; break r$15;
                              case 47: $r15 = true; break r$15;
                              case 48: return i$144;
                              case 49: return i$144;
                              case 50: return i$144;
                              case 51: return i$144;
                              case 52: $r15 = true; break r$15;
                              case 53: return i$144;
                              case 54: return i$144;
                              case 55: return i$144;
                              case 56: return i$144;
                              case 57: $r15 = true; break r$15;
                              case 58: return i$144;
                              case 59: $r15 = true; break r$15;
                              case 60: $r15 = true; break r$15;
                              case 61: return i$144;
                              case 62: return i$144;
                              case 63: return i$144;
                              default: return null;
                              }
                            }
                          }
                          return i$144;
                        }
                      }
                      if (!(match$173 >= 58)) { { if (match$173 >= 48) { { $r15 = true; break r$15; } } return i$144; } }
                      if (!(-65 + match$173 < 0 || -65 + match$173 > 25)) { { $r15 = true; break r$15; } }
                      return i$144;
                    }
                  }
                  if ($r15) return __(advance$143, [ i$144 + 1, lim$145 ]);
                });
           return __(advance$143, [ start$142, s$141.length ]);
         });
    var find_ident$146 =
      _f(function (s$147, start$148, lim$149) {
           if (start$148 >= lim$149) throw $(Not_found$20g);
           var c$150 = oc$$srefs(s$147, start$148);
           var $r12 = false;
           r$12: {
             {
               if (!(c$150 !== 40)) { { $r12 = true; break r$12; } }
               if (!(c$150 !== 123)) { { $r12 = true; break r$12; } }
               var stop$153 = _(advance_to_non_alpha$140, [ s$147, start$148 + 1 ]);
               return $(_(oc$String$[2], [ s$147, start$148, stop$153 - start$148 ]), stop$153);
             }
           }
           if ($r12) {
             {
               var new_start$151 = start$148 + 1;
               var stop$152 = _(advance_to_closing$130, [ c$150, _(closing$129, [ c$150 ]), 0, s$147, new_start$151 ]);
               return $(_(oc$String$[2], [ s$147, new_start$151, stop$152 - start$148 - 1 ]), stop$152 + 1);
             }
           }
         });
    var add_substitute$154 =
      _f(function (b$155, f$156, s$157) {
           var lim$158 = s$157.length;
           var subst$159 =
             _f(function (previous$160, i$161) {
                  if (i$161 < lim$158) {
                    {
                      var current$162 = oc$$srefs(s$157, i$161);
                      if (!(current$162 !== 36)) {
                        {
                          if (previous$160 === 92) {
                            { _(add_char$108, [ b$155, current$162 ]); return __(subst$159, [ 32, i$161 + 1 ]); }
                          }
                          var j$166 = i$161 + 1;
                          var match$172 = _(find_ident$146, [ s$157, j$166, lim$158 ]);
                          _(add_string$116, [ b$155, _(f$156, [ match$172[0] ]) ]);
                          return __(subst$159, [ 32, match$172[1] ]);
                        }
                      }
                      if (previous$160 === 92) {
                        {
                          _(add_char$108, [ b$155, 92 ]);
                          _(add_char$108, [ b$155, current$162 ]);
                          return __(subst$159, [ 32, i$161 + 1 ]);
                        }
                      }
                      if (current$162 !== 92) {
                        { _(add_char$108, [ b$155, current$162 ]); return __(subst$159, [ current$162, i$161 + 1 ]); }
                      }
                      return __(subst$159, [ current$162, i$161 + 1 ]);
                    }
                  }
                  if (previous$160 === 92) return __(add_char$108, [ b$155, previous$160 ]);
                  return 0;
                });
           return __(subst$159, [ 32, 0 ]);
         });
    return $(create$82, contents$84, sub$88, blit$93, nth$99, length$103, clear$105, clear$105, add_char$108, add_string$116,
             add_substring$111, add_substitute$154, add_buffer$119, add_channel$122, output_buffer$126);
  }();
var oc$Printf$ =
  function () {
    var Sformat$84 =
      function () {
        var index_of_int$65 =
          _f(function (i$66) {
               if (i$66 >= 0) return i$66;
               return __(oc$Pervasives$[1],
                         [ _(oc$Pervasives$[15], [ "Sformat.index_of_int: negative argument ", _(oc$Pervasives$[19], [ i$66 ]) ]) ]);
             });
        var add_int_index$68 = _f(function (i$69, idx$70) { return __(index_of_int$65, [ i$69 + idx$70 ]); });
        var succ_index$71 = _(add_int_index$68, [ 1 ]);
        var index_of_literal_position$72 = _f(function (p$73) { return __(index_of_int$65, [ -1 + p$73 ]); });
        var sub$78 = _f(function (fmt$79, idx$80, len$81) { return __(oc$String$[2], [ fmt$79, idx$80, len$81 ]); });
        var to_string$82 = _f(function (fmt$83) { return __(sub$78, [ fmt$83, 0, fmt$83.length ]); });
        return $(index_of_int$65, add_int_index$68, succ_index$71, index_of_literal_position$72, sub$78, to_string$82);
      }();
    var bad_conversion$85 =
      _f(function (sfmt$86, i$87, c$88) {
           return __(oc$Pervasives$[0],
                     [
                       _(oc$Pervasives$[15],
                         [
                           "Printf: bad conversion %",
                           _(oc$Pervasives$[15],
                             [
                               _(oc$String$[0], [ 1, c$88 ]),
                               _(oc$Pervasives$[15],
                                 [
                                   ", at char number ",
                                   _(oc$Pervasives$[15],
                                     [
                                       _(oc$Pervasives$[19], [ i$87 ]),
                                       _(oc$Pervasives$[15],
                                         [ " in format string ``", _(oc$Pervasives$[15], [ sfmt$86, "\'\'" ]) ])
                                     ])
                                 ])
                             ])
                         ])
                     ]);
         });
    var bad_conversion_format$89 =
      _f(function (fmt$90, i$91, c$92) { return __(bad_conversion$85, [ _(Sformat$84[5], [ fmt$90 ]), i$91, c$92 ]); });
    var incomplete_format$93 =
      _f(function (fmt$94) {
           return __(oc$Pervasives$[0],
                     [
                       _(oc$Pervasives$[15],
                         [
                           "Printf: premature end of format string ``",
                           _(oc$Pervasives$[15], [ _(Sformat$84[5], [ fmt$94 ]), "\'\'" ])
                         ])
                     ]);
         });
    var parse_string_conversion$95 =
      _f(function (sfmt$96) {
           var parse$97 =
             _f(function (neg$98, i$99) {
                  if (i$99 >= sfmt$96.length) return $(0, neg$98);
                  var match$503 = oc$$srefu(sfmt$96, i$99);
                  var $r162 = false;
                  r$162: {
                    {
                      if (!(match$503 >= 49)) {
                        { if (match$503 !== 45) { { $r162 = true; break r$162; } } return __(parse$97, [ 1, 1 + i$99 ]); }
                      }
                      if (match$503 >= 58) { { $r162 = true; break r$162; } }
                      return $(caml_int_of_string(_(oc$String$[2], [ sfmt$96, i$99, sfmt$96.length - i$99 - 1 ])), neg$98);
                    }
                  }
                  if ($r162) return __(parse$97, [ neg$98, 1 + i$99 ]);
                });
           try {
             return _(parse$97, [ 0, 1 ]);
           }
           catch (exn$501) {
             if (exn$501[0] === Failure$19g) return __(bad_conversion$85, [ sfmt$96, 0, 115 ]);
             throw exn$501;
           }
         });
    var pad_string$100 =
      _f(function (pad_char$101, p$102, neg$103, s$104, i$105, len$106) {
           if (p$102 === len$106 && i$105 === 0) return s$104;
           if (p$102 <= len$106) return __(oc$String$[2], [ s$104, i$105, len$106 ]);
           var res$107 = _(oc$String$[0], [ p$102, pad_char$101 ]);
           if (neg$103)
             _(oc$String$[4], [ s$104, i$105, res$107, 0, len$106 ]);
           else
             _(oc$String$[4], [ s$104, i$105, res$107, p$102 - len$106, len$106 ]);
           return res$107;
         });
    var format_string$108 =
      _f(function (sfmt$109, s$110) {
           var match$500 = _(parse_string_conversion$95, [ sfmt$109 ]);
           return __(pad_string$100, [ 32, match$500[0], match$500[1], s$110, 0, s$110.length ]);
         });
    var extract_format$113 =
      _f(function (fmt$114, start$115, stop$116, widths$117) {
           var skip_positional_spec$118 =
             _f(function (start$119) {
                  var match$498 = oc$$srefu(fmt$114, start$119);
                  if (-48 + match$498 < 0 || -48 + match$498 > 9) return start$119;
                  var skip_int_literal$120 =
                    _f(function (i$121) {
                         var match$497 = oc$$srefu(fmt$114, i$121);
                         if (!(match$497 >= 48)) { { if (match$497 !== 36) return start$119; return 1 + i$121; } }
                         if (match$497 >= 58) return start$119;
                         return __(skip_int_literal$120, [ 1 + i$121 ]);
                       });
                  return __(skip_int_literal$120, [ 1 + start$119 ]);
                });
           var start$122 = _(skip_positional_spec$118, [ 1 + start$115 ]);
           var b$123 = _(oc$Buffer$[0], [ stop$116 - start$122 + 10 ]);
           _(oc$Buffer$[8], [ b$123, 37 ]);
           var fill_format$124 =
             _f(function (i$125, widths$126) {
                  if (i$125 <= stop$116) {
                    {
                      var match$495 = oc$$srefu(fmt$114, i$125);
                      if (match$495 !== 42) {
                        { _(oc$Buffer$[8], [ b$123, match$495 ]); return __(fill_format$124, [ 1 + i$125, widths$126 ]); }
                      }
                      if (widths$126) {
                        {
                          _(oc$Buffer$[9], [ b$123, _(oc$Pervasives$[19], [ widths$126[0] ]) ]);
                          var i$130 = _(skip_positional_spec$118, [ 1 + i$125 ]);
                          return __(fill_format$124, [ i$130, widths$126[1] ]);
                        }
                      }
                      throw $(Assert_failure$26g, $("printf.ml", 163, 8));
                    }
                  }
                  return 0;
                });
           _(fill_format$124, [ start$122, _(oc$List$[4], [ widths$117 ]) ]);
           return __(oc$Buffer$[1], [ b$123 ]);
         });
    var extract_format_int$131 =
      _f(function (conv$132, fmt$133, start$134, stop$135, widths$136) {
           var sfmt$137 = _(extract_format$113, [ fmt$133, start$134, stop$135, widths$136 ]);
           var $r142 = false;
           r$142: {
             {
               if (!(conv$132 !== 78)) { { $r142 = true; break r$142; } }
               if (!(conv$132 !== 110)) { { $r142 = true; break r$142; } }
               return sfmt$137;
             }
           }
           if ($r142) { { oc$$ssets(sfmt$137, sfmt$137.length - 1, 117); return sfmt$137; } }
         });
    var extract_format_float$138 =
      _f(function (conv$139, fmt$140, start$141, stop$142, widths$143) {
           var sfmt$144 = _(extract_format$113, [ fmt$140, start$141, stop$142, widths$143 ]);
           if (conv$139 !== 70) return sfmt$144;
           oc$$ssets(sfmt$144, sfmt$144.length - 1, 103);
           return sfmt$144;
         });
    var sub_format$145 =
      _f(function (incomplete_format$146, bad_conversion_format$147, conv$148, fmt$149, i$150) {
           var len$151 = fmt$149.length;
           var sub_fmt$152 =
             _f(function (c$153, i$154) {
                  var close$155 = c$153 === 40 ? 41 : 125;
                  var sub$156 =
                    _f(function (j$158) {
                         if (j$158 >= len$151) return __(incomplete_format$146, [ fmt$149 ]);
                         var match$492 = oc$$srefs(fmt$149, j$158);
                         if (match$492 !== 37) return __(sub$156, [ 1 + j$158 ]);
                         return __(sub_sub$157, [ 1 + j$158 ]);
                       });
                  var sub_sub$157 =
                    _f(function (j$159) {
                         if (j$159 >= len$151) return __(incomplete_format$146, [ fmt$149 ]);
                         var c$160 = oc$$srefs(fmt$149, j$159);
                         var $r134 = false;
                         r$134: {
                           {
                             var $r133 = false;
                             r$133: {
                               {
                                 var $r135 = false;
                                 r$135: {
                                   {
                                     var switcher$493 = -40 + c$160;
                                     if (switcher$493 < 0 || switcher$493 > 1) {
                                       {
                                         var switcher$494 = -83 + switcher$493;
                                         if (switcher$494 < 0 || switcher$494 > 2) { { $r135 = true; break r$135; } }
                                         switch (switcher$494)
                                         {
                                         case 0: $r133 = true; break r$133;
                                         case 1: $r135 = true; break r$135;
                                         case 2: $r134 = true; break r$134;
                                         default: return null;
                                         }
                                       }
                                     }
                                     if (!(switcher$493 !== 0)) { { $r133 = true; break r$133; } }
                                     $r134 = true;
                                     break r$134;
                                   }
                                 }
                                 if ($r135) return __(sub$156, [ 1 + j$159 ]);
                               }
                             }
                             if ($r133) {
                               { var j$162 = _(sub_fmt$152, [ c$160, 1 + j$159 ]); return __(sub$156, [ 1 + j$162 ]); }
                             }
                           }
                         }
                         if ($r134) {
                           {
                             if (c$160 === close$155) return 1 + j$159;
                             return __(bad_conversion_format$147, [ fmt$149, i$154, c$160 ]);
                           }
                         }
                       });
                  return __(sub$156, [ i$154 ]);
                });
           return __(sub_fmt$152, [ conv$148, i$150 ]);
         });
    var sub_format_for_printf$163 =
      _f(function (conv$164) { return __(sub_format$145, [ incomplete_format$93, bad_conversion_format$89, conv$164 ]); });
    var iter_on_format_args$165 =
      _f(function (fmt$166, add_conv$167, add_char$168) {
           var lim$169 = fmt$166.length - 1;
           var scan_flags$170 =
             _f(function (skip$173, i$174) {
                  if (i$174 > lim$169) return __(incomplete_format$93, [ fmt$166 ]);
                  var match$489 = oc$$srefu(fmt$166, i$174);
                  var $r111 = false;
                  r$111: {
                    {
                      var $r110 = false;
                      r$110: {
                        {
                          var $r112 = false;
                          r$112: {
                            {
                              if (!(match$489 >= 58)) {
                                {
                                  if (!(match$489 >= 32)) { { $r112 = true; break r$112; } }
                                  var s$504 = -32 + match$489;
                                  switch (s$504)
                                  {
                                  case 0: $r110 = true; break r$110;
                                  case 1: $r112 = true; break r$112;
                                  case 2: $r112 = true; break r$112;
                                  case 3: $r110 = true; break r$110;
                                  case 4: $r112 = true; break r$112;
                                  case 5: $r112 = true; break r$112;
                                  case 6: $r112 = true; break r$112;
                                  case 7: $r112 = true; break r$112;
                                  case 8: $r112 = true; break r$112;
                                  case 9: $r112 = true; break r$112;
                                  case 10: return __(scan_flags$170, [ skip$173, _(add_conv$167, [ skip$173, i$174, 105 ]) ]);
                                  case 11: $r110 = true; break r$110;
                                  case 12: $r112 = true; break r$112;
                                  case 13: $r110 = true; break r$110;
                                  case 14: $r111 = true; break r$111;
                                  case 15: $r112 = true; break r$112;
                                  case 16: $r111 = true; break r$111;
                                  case 17: $r111 = true; break r$111;
                                  case 18: $r111 = true; break r$111;
                                  case 19: $r111 = true; break r$111;
                                  case 20: $r111 = true; break r$111;
                                  case 21: $r111 = true; break r$111;
                                  case 22: $r111 = true; break r$111;
                                  case 23: $r111 = true; break r$111;
                                  case 24: $r111 = true; break r$111;
                                  case 25: $r111 = true; break r$111;
                                  default: return null;
                                  }
                                }
                              }
                              if (match$489 !== 95) { { $r112 = true; break r$112; } }
                              return __(scan_flags$170, [ 1, 1 + i$174 ]);
                            }
                          }
                          if ($r112) return __(scan_conv$171, [ skip$173, i$174 ]);
                        }
                      }
                      if ($r110) return __(scan_flags$170, [ skip$173, 1 + i$174 ]);
                    }
                  }
                  if ($r111) return __(scan_flags$170, [ skip$173, 1 + i$174 ]);
                });
           var scan_conv$171 =
             _f(function (skip$175, i$176) {
                  if (i$176 > lim$169) return __(incomplete_format$93, [ fmt$166 ]);
                  var conv$177 = oc$$srefu(fmt$166, i$176);
                  var $r126 = false;
                  r$126: {
                    {
                      var $r125 = false;
                      r$125: {
                        {
                          var $r124 = false;
                          r$124: {
                            {
                              var $r123 = false;
                              r$123: {
                                {
                                  var $r122 = false;
                                  r$122: {
                                    {
                                      var $r121 = false;
                                      r$121: {
                                        {
                                          var $r120 = false;
                                          r$120: {
                                            {
                                              var $r119 = false;
                                              r$119: {
                                                {
                                                  var $r118 = false;
                                                  r$118: {
                                                    {
                                                      var $r127 = false;
                                                      r$127: {
                                                        {
                                                          if (conv$177 >= 126) { { $r127 = true; break r$127; } }
                                                          switch (conv$177)
                                                          {
                                                          case 0: $r127 = true; break r$127;
                                                          case 1: $r127 = true; break r$127;
                                                          case 2: $r127 = true; break r$127;
                                                          case 3: $r127 = true; break r$127;
                                                          case 4: $r127 = true; break r$127;
                                                          case 5: $r127 = true; break r$127;
                                                          case 6: $r127 = true; break r$127;
                                                          case 7: $r127 = true; break r$127;
                                                          case 8: $r127 = true; break r$127;
                                                          case 9: $r127 = true; break r$127;
                                                          case 10: $r127 = true; break r$127;
                                                          case 11: $r127 = true; break r$127;
                                                          case 12: $r127 = true; break r$127;
                                                          case 13: $r127 = true; break r$127;
                                                          case 14: $r127 = true; break r$127;
                                                          case 15: $r127 = true; break r$127;
                                                          case 16: $r127 = true; break r$127;
                                                          case 17: $r127 = true; break r$127;
                                                          case 18: $r127 = true; break r$127;
                                                          case 19: $r127 = true; break r$127;
                                                          case 20: $r127 = true; break r$127;
                                                          case 21: $r127 = true; break r$127;
                                                          case 22: $r127 = true; break r$127;
                                                          case 23: $r127 = true; break r$127;
                                                          case 24: $r127 = true; break r$127;
                                                          case 25: $r127 = true; break r$127;
                                                          case 26: $r127 = true; break r$127;
                                                          case 27: $r127 = true; break r$127;
                                                          case 28: $r127 = true; break r$127;
                                                          case 29: $r127 = true; break r$127;
                                                          case 30: $r127 = true; break r$127;
                                                          case 31: $r127 = true; break r$127;
                                                          case 32: $r127 = true; break r$127;
                                                          case 33: $r118 = true; break r$118;
                                                          case 34: $r127 = true; break r$127;
                                                          case 35: $r127 = true; break r$127;
                                                          case 36: $r127 = true; break r$127;
                                                          case 37: $r118 = true; break r$118;
                                                          case 38: $r127 = true; break r$127;
                                                          case 39: $r127 = true; break r$127;
                                                          case 40:
                                                            return __
                                                                   (scan_fmt$172,
                                                                    [ _(add_conv$167, [ skip$175, i$176, conv$177 ]) ]);
                                                          case 41: $r126 = true; break r$126;
                                                          case 42: $r127 = true; break r$127;
                                                          case 43: $r127 = true; break r$127;
                                                          case 44: $r118 = true; break r$118;
                                                          case 45: $r127 = true; break r$127;
                                                          case 46: $r127 = true; break r$127;
                                                          case 47: $r127 = true; break r$127;
                                                          case 48: $r127 = true; break r$127;
                                                          case 49: $r127 = true; break r$127;
                                                          case 50: $r127 = true; break r$127;
                                                          case 51: $r127 = true; break r$127;
                                                          case 52: $r127 = true; break r$127;
                                                          case 53: $r127 = true; break r$127;
                                                          case 54: $r127 = true; break r$127;
                                                          case 55: $r127 = true; break r$127;
                                                          case 56: $r127 = true; break r$127;
                                                          case 57: $r127 = true; break r$127;
                                                          case 58: $r127 = true; break r$127;
                                                          case 59: $r127 = true; break r$127;
                                                          case 60: $r127 = true; break r$127;
                                                          case 61: $r127 = true; break r$127;
                                                          case 62: $r127 = true; break r$127;
                                                          case 63: $r127 = true; break r$127;
                                                          case 64: $r127 = true; break r$127;
                                                          case 65: $r127 = true; break r$127;
                                                          case 66: $r123 = true; break r$123;
                                                          case 67: $r120 = true; break r$120;
                                                          case 68: $r127 = true; break r$127;
                                                          case 69: $r122 = true; break r$122;
                                                          case 70: $r122 = true; break r$122;
                                                          case 71: $r122 = true; break r$122;
                                                          case 72: $r127 = true; break r$127;
                                                          case 73: $r127 = true; break r$127;
                                                          case 74: $r127 = true; break r$127;
                                                          case 75: $r127 = true; break r$127;
                                                          case 76: $r125 = true; break r$125;
                                                          case 77: $r127 = true; break r$127;
                                                          case 78: $r121 = true; break r$121;
                                                          case 79: $r127 = true; break r$127;
                                                          case 80: $r127 = true; break r$127;
                                                          case 81: $r127 = true; break r$127;
                                                          case 82: $r127 = true; break r$127;
                                                          case 83: $r119 = true; break r$119;
                                                          case 84: $r127 = true; break r$127;
                                                          case 85: $r127 = true; break r$127;
                                                          case 86: $r127 = true; break r$127;
                                                          case 87: $r127 = true; break r$127;
                                                          case 88: $r121 = true; break r$121;
                                                          case 89: $r127 = true; break r$127;
                                                          case 90: $r127 = true; break r$127;
                                                          case 91: $r119 = true; break r$119;
                                                          case 92: $r127 = true; break r$127;
                                                          case 93: $r127 = true; break r$127;
                                                          case 94: $r127 = true; break r$127;
                                                          case 95: $r127 = true; break r$127;
                                                          case 96: $r127 = true; break r$127;
                                                          case 97: $r124 = true; break r$124;
                                                          case 98: $r123 = true; break r$123;
                                                          case 99: $r120 = true; break r$120;
                                                          case 100: $r121 = true; break r$121;
                                                          case 101: $r122 = true; break r$122;
                                                          case 102: $r122 = true; break r$122;
                                                          case 103: $r122 = true; break r$122;
                                                          case 104: $r127 = true; break r$127;
                                                          case 105: $r121 = true; break r$121;
                                                          case 106: $r127 = true; break r$127;
                                                          case 107: $r127 = true; break r$127;
                                                          case 108: $r125 = true; break r$125;
                                                          case 109: $r127 = true; break r$127;
                                                          case 110: $r125 = true; break r$125;
                                                          case 111: $r121 = true; break r$121;
                                                          case 112: $r127 = true; break r$127;
                                                          case 113: $r127 = true; break r$127;
                                                          case 114: $r124 = true; break r$124;
                                                          case 115: $r119 = true; break r$119;
                                                          case 116: $r124 = true; break r$124;
                                                          case 117: $r121 = true; break r$121;
                                                          case 118: $r127 = true; break r$127;
                                                          case 119: $r127 = true; break r$127;
                                                          case 120: $r121 = true; break r$121;
                                                          case 121: $r127 = true; break r$127;
                                                          case 122: $r127 = true; break r$127;
                                                          case 123:
                                                            var i$185 = _(add_conv$167, [ skip$175, i$176, conv$177 ]);
                                                            var j$186 = _(sub_format_for_printf$163, [ conv$177, fmt$166, i$185 ]);
                                                            var loop$187 =
                                                              _f(function 
                                                                 (i$188) {
                                                                   if (
                                                                   i$188 < j$186 - 2)
                                                                    return __
                                                                    (loop$187,
                                                                    [ _(add_char$168, [ i$188, oc$$srefs(fmt$166, i$188) ]) ]);
                                                                   return 0;
                                                                 });
                                                            _(loop$187, [ i$185 ]);
                                                            return __(scan_conv$171, [ skip$175, j$186 - 1 ]);
                                                          case 124: $r127 = true; break r$127;
                                                          case 125: $r126 = true; break r$126;
                                                          default: return null;
                                                          }
                                                        }
                                                      }
                                                      if ($r127) return __(bad_conversion_format$89, [ fmt$166, i$176, conv$177 ]);
                                                    }
                                                  }
                                                  if ($r118) return 1 + i$176;
                                                }
                                              }
                                              if ($r119) return __(add_conv$167, [ skip$175, i$176, 115 ]);
                                            }
                                          }
                                          if ($r120) return __(add_conv$167, [ skip$175, i$176, 99 ]);
                                        }
                                      }
                                      if ($r121) return __(add_conv$167, [ skip$175, i$176, 105 ]);
                                    }
                                  }
                                  if ($r122) return __(add_conv$167, [ skip$175, i$176, 102 ]);
                                }
                              }
                              if ($r123) return __(add_conv$167, [ skip$175, i$176, 66 ]);
                            }
                          }
                          if ($r124) return __(add_conv$167, [ skip$175, i$176, conv$177 ]);
                        }
                      }
                      if ($r125) {
                        {
                          var j$183 = 1 + i$176;
                          if (j$183 > lim$169) return __(add_conv$167, [ skip$175, i$176, 105 ]);
                          var c$184 = oc$$srefs(fmt$166, j$183);
                          var $r113 = false;
                          r$113: {
                            {
                              var $r114 = false;
                              r$114: {
                                {
                                  var switcher$491 = -88 + c$184;
                                  if (switcher$491 < 0 || switcher$491 > 32) { { $r114 = true; break r$114; } }
                                  switch (switcher$491)
                                  {
                                  case 0: $r113 = true; break r$113;
                                  case 1: $r114 = true; break r$114;
                                  case 2: $r114 = true; break r$114;
                                  case 3: $r114 = true; break r$114;
                                  case 4: $r114 = true; break r$114;
                                  case 5: $r114 = true; break r$114;
                                  case 6: $r114 = true; break r$114;
                                  case 7: $r114 = true; break r$114;
                                  case 8: $r114 = true; break r$114;
                                  case 9: $r114 = true; break r$114;
                                  case 10: $r114 = true; break r$114;
                                  case 11: $r114 = true; break r$114;
                                  case 12: $r113 = true; break r$113;
                                  case 13: $r114 = true; break r$114;
                                  case 14: $r114 = true; break r$114;
                                  case 15: $r114 = true; break r$114;
                                  case 16: $r114 = true; break r$114;
                                  case 17: $r113 = true; break r$113;
                                  case 18: $r114 = true; break r$114;
                                  case 19: $r114 = true; break r$114;
                                  case 20: $r114 = true; break r$114;
                                  case 21: $r114 = true; break r$114;
                                  case 22: $r114 = true; break r$114;
                                  case 23: $r113 = true; break r$113;
                                  case 24: $r114 = true; break r$114;
                                  case 25: $r114 = true; break r$114;
                                  case 26: $r114 = true; break r$114;
                                  case 27: $r114 = true; break r$114;
                                  case 28: $r114 = true; break r$114;
                                  case 29: $r113 = true; break r$113;
                                  case 30: $r114 = true; break r$114;
                                  case 31: $r114 = true; break r$114;
                                  case 32: $r113 = true; break r$113;
                                  default: return null;
                                  }
                                }
                              }
                              if ($r114) return __(add_conv$167, [ skip$175, i$176, 105 ]);
                            }
                          }
                          if ($r113) return __(add_char$168, [ _(add_conv$167, [ skip$175, i$176, conv$177 ]), 105 ]);
                        }
                      }
                    }
                  }
                  if ($r126) return __(add_conv$167, [ skip$175, i$176, conv$177 ]);
                });
           var scan_fmt$172 =
             _f(function (i$189) {
                  if (!(i$189 < lim$169)) return i$189;
                  if (oc$$srefs(fmt$166, i$189) === 37) return __(scan_fmt$172, [ _(scan_flags$170, [ 0, 1 + i$189 ]) ]);
                  return __(scan_fmt$172, [ 1 + i$189 ]);
                });
           _(scan_fmt$172, [ 0 ]);
           return 0;
         });
    var summarize_format_type$190 =
      _f(function (fmt$191) {
           var len$192 = fmt$191.length;
           var b$193 = _(oc$Buffer$[0], [ len$192 ]);
           var add_char$194 = _f(function (i$195, c$196) { _(oc$Buffer$[8], [ b$193, c$196 ]); return 1 + i$195; });
           var add_conv$197 =
             _f(function (skip$198, i$199, c$200) {
                  if (skip$198) _(oc$Buffer$[9], [ b$193, "%_" ]); else _(oc$Buffer$[8], [ b$193, 37 ]);
                  return __(add_char$194, [ i$199, c$200 ]);
                });
           _(iter_on_format_args$165, [ fmt$191, add_conv$197, add_char$194 ]);
           return __(oc$Buffer$[1], [ b$193 ]);
         });
    var Ac$208 = $();
    var ac_of_format$212 =
      _f(function (fmt$213) {
           var ac$214 = $(0, 0, 0);
           var incr_ac$215 =
             _f(function (skip$216, c$217) {
                  var inc$218 = c$217 === 97 ? 2 : 1;
                  if (c$217 === 114) ac$214[2] = ac$214[2] + 1; else;
                  if (skip$216) return ac$214[1] = ac$214[1] + inc$218;
                  return ac$214[0] = ac$214[0] + inc$218;
                });
           var add_conv$219 =
             _f(function (skip$221, i$222, c$223) {
                  if (c$223 !== 41 && c$223 !== 125) _(incr_ac$215, [ skip$221, c$223 ]); else;
                  return 1 + i$222;
                });
           var add_char$220 = _f(function (i$224, c$225) { return 1 + i$224; });
           _(iter_on_format_args$165, [ fmt$213, add_conv$219, add_char$220 ]);
           return ac$214;
         });
    var count_arguments_of_format$226 =
      _f(function (fmt$227) { var ac$228 = _(ac_of_format$212, [ fmt$227 ]); return ac$228[0]; });
    var list_iter_i$229 =
      _f(function (f$230, l$231) {
           var loop$232 =
             _f(function (i$233, param$487) {
                  if (param$487) {
                    {
                      var xs$236 = param$487[1];
                      var x$234 = param$487[0];
                      if (xs$236) { { _(f$230, [ i$233, x$234 ]); return __(loop$232, [ 1 + i$233, xs$236 ]); } }
                      return __(f$230, [ i$233, x$234 ]);
                    }
                  }
                  return 0;
                });
           return __(loop$232, [ 0, l$231 ]);
         });
    var kapr$237 =
      _f(function (kpr$238, fmt$239) {
           var nargs$240 = _(count_arguments_of_format$226, [ fmt$239 ]);
           if (nargs$240 < 0 || nargs$240 > 6) {
             {
               var loop$268 =
                 _f(function (i$269, args$270) {
                      if (i$269 >= nargs$240) {
                        {
                          var a$271 = caml_make_vect(nargs$240, 0);
                          _(list_iter_i$229,
                            [
                              _f(function (i$272, arg$273) { return oc$$asets(a$271, nargs$240 - i$272 - 1, arg$273); }),
                              args$270
                            ]);
                          return __(kpr$238, [ fmt$239, a$271 ]);
                        }
                      }
                      return _f(function (x$274) { return __(loop$268, [ 1 + i$269, $(x$274, args$270) ]); });
                    });
               return __(loop$268, [ 0, 0 ]);
             }
           }
           switch (nargs$240)
           {
           case 0: return __(kpr$238, [ fmt$239, $() ]);
           case 1:
             return _f(function (x$241) {
                         var a$242 = caml_make_vect(1, 0);
                         oc$$asets(a$242, 0, x$241);
                         return __(kpr$238, [ fmt$239, a$242 ]);
                       });
           case 2:
             return _f(function (x$243, y$244) {
                         var a$245 = caml_make_vect(2, 0);
                         oc$$asets(a$245, 0, x$243);
                         oc$$asets(a$245, 1, y$244);
                         return __(kpr$238, [ fmt$239, a$245 ]);
                       });
           case 3:
             return _f(function (x$246, y$247, z$248) {
                         var a$249 = caml_make_vect(3, 0);
                         oc$$asets(a$249, 0, x$246);
                         oc$$asets(a$249, 1, y$247);
                         oc$$asets(a$249, 2, z$248);
                         return __(kpr$238, [ fmt$239, a$249 ]);
                       });
           case 4:
             return _f(function (x$250, y$251, z$252, t$253) {
                         var a$254 = caml_make_vect(4, 0);
                         oc$$asets(a$254, 0, x$250);
                         oc$$asets(a$254, 1, y$251);
                         oc$$asets(a$254, 2, z$252);
                         oc$$asets(a$254, 3, t$253);
                         return __(kpr$238, [ fmt$239, a$254 ]);
                       });
           case 5:
             return _f(function (x$255, y$256, z$257, t$258, u$259) {
                         var a$260 = caml_make_vect(5, 0);
                         oc$$asets(a$260, 0, x$255);
                         oc$$asets(a$260, 1, y$256);
                         oc$$asets(a$260, 2, z$257);
                         oc$$asets(a$260, 3, t$258);
                         oc$$asets(a$260, 4, u$259);
                         return __(kpr$238, [ fmt$239, a$260 ]);
                       });
           case 6:
             return _f(function (x$261, y$262, z$263, t$264, u$265, v$266) {
                         var a$267 = caml_make_vect(6, 0);
                         oc$$asets(a$267, 0, x$261);
                         oc$$asets(a$267, 1, y$262);
                         oc$$asets(a$267, 2, z$263);
                         oc$$asets(a$267, 3, t$264);
                         oc$$asets(a$267, 4, u$265);
                         oc$$asets(a$267, 5, v$266);
                         return __(kpr$238, [ fmt$239, a$267 ]);
                       });
           default: return null;
           }
         });
    var scan_positional_spec$280 =
      _f(function (fmt$281, got_spec$282, n$283, i$284) {
           var d$285 = oc$$srefu(fmt$281, i$284);
           if (-48 + d$285 < 0 || -48 + d$285 > 9) return __(got_spec$282, [ 0, i$284 ]);
           var get_int_literal$286 =
             _f(function (accu$287, j$288) {
                  var d$289 = oc$$srefu(fmt$281, j$288);
                  var $r82 = false;
                  r$82: {
                    {
                      if (!(d$289 >= 48)) {
                        {
                          if (d$289 !== 36) { { $r82 = true; break r$82; } }
                          if (accu$287 === 0) return __(oc$Pervasives$[1], [ "printf: bad positional specification (0)." ]);
                          return __(got_spec$282, [ $(_(Sformat$84[3], [ accu$287 ])), 1 + j$288 ]);
                        }
                      }
                      if (d$289 >= 58) { { $r82 = true; break r$82; } }
                      return __(get_int_literal$286, [ 10 * accu$287 + (d$289 - 48), 1 + j$288 ]);
                    }
                  }
                  if ($r82) return __(got_spec$282, [ 0, i$284 ]);
                });
           return __(get_int_literal$286, [ d$285 - 48, 1 + i$284 ]);
         });
    var next_index$290 = _f(function (spec$291, n$292) { if (spec$291) return n$292; return __(Sformat$84[2], [ n$292 ]); });
    var get_index$293 = _f(function (spec$294, n$295) { if (spec$294) return spec$294[0]; return n$295; });
    var format_float_lexeme$297 =
      function () {
        var valid_float_lexeme$298 =
          _f(function (sfmt$299, s$300) {
               var l$301 = s$300.length;
               if (l$301 === 0) return "nan";
               var add_dot$302 = _f(function (sfmt$303, s$304) { return __(oc$Pervasives$[15], [ s$304, "." ]); });
               var loop$305 =
                 _f(function (i$306) {
                      if (i$306 >= l$301) return __(add_dot$302, [ sfmt$299, s$300 ]);
                      var match$484 = oc$$srefs(s$300, i$306);
                      if (match$484 !== 46) return __(loop$305, [ i$306 + 1 ]);
                      return s$300;
                    });
               return __(loop$305, [ 0 ]);
             });
        return _f(function (sfmt$307, x$308) {
                    var s$309 = oc$$sprintf(sfmt$307, x$308);
                    var match$483 = caml_classify_float(x$308);
                    if (match$483 >= 3) return s$309;
                    return __(valid_float_lexeme$298, [ sfmt$307, s$309 ]);
                  });
      }();
    var scan_format$310 =
      _f(function (fmt$311, args$312, n$313, pos$314, cont_s$315, cont_a$316, cont_t$317, cont_f$318, cont_m$319) {
           var get_arg$320 = _f(function (spec$321, n$322) { return oc$$arefs(args$312, _(get_index$293, [ spec$321, n$322 ])); });
           var scan_positional$323 =
             _f(function (n$326, widths$327, i$328) {
                  var got_spec$329 =
                    _f(function (spec$330, i$331) { return __(scan_flags$324, [ spec$330, n$326, widths$327, i$331 ]); });
                  return __(scan_positional_spec$280, [ fmt$311, got_spec$329, n$326, i$328 ]);
                });
           var scan_flags$324 =
             _f(function (spec$332, n$333, widths$334, i$335) {
                  var match$478 = oc$$srefu(fmt$311, i$335);
                  var $r30 = false;
                  r$30: {
                    {
                      var $r31 = false;
                      r$31: {
                        {
                          var switcher$479 = -32 + match$478;
                          if (switcher$479 < 0 || switcher$479 > 25) { { $r31 = true; break r$31; } }
                          switch (switcher$479)
                          {
                          case 0: $r30 = true; break r$30;
                          case 1: $r31 = true; break r$31;
                          case 2: $r31 = true; break r$31;
                          case 3: $r30 = true; break r$30;
                          case 4: $r31 = true; break r$31;
                          case 5: $r31 = true; break r$31;
                          case 6: $r31 = true; break r$31;
                          case 7: $r31 = true; break r$31;
                          case 8: $r31 = true; break r$31;
                          case 9: $r31 = true; break r$31;
                          case 10:
                            var got_spec$336 =
                              _f(function (wspec$337, i$338) {
                                   var width$339 = _(get_arg$320, [ wspec$337, n$333 ]);
                                   return __(scan_flags$324,
                                             [ spec$332, _(next_index$290, [ wspec$337, n$333 ]), $(width$339, widths$334), i$338 ]);
                                 });
                            return __(scan_positional_spec$280, [ fmt$311, got_spec$336, n$333, 1 + i$335 ]);
                          case 11: $r30 = true; break r$30;
                          case 12: $r31 = true; break r$31;
                          case 13: $r30 = true; break r$30;
                          case 14: $r30 = true; break r$30;
                          case 15: $r31 = true; break r$31;
                          case 16: $r30 = true; break r$30;
                          case 17: $r30 = true; break r$30;
                          case 18: $r30 = true; break r$30;
                          case 19: $r30 = true; break r$30;
                          case 20: $r30 = true; break r$30;
                          case 21: $r30 = true; break r$30;
                          case 22: $r30 = true; break r$30;
                          case 23: $r30 = true; break r$30;
                          case 24: $r30 = true; break r$30;
                          case 25: $r30 = true; break r$30;
                          default: return null;
                          }
                        }
                      }
                      if ($r31) return __(scan_conv$325, [ spec$332, n$333, widths$334, i$335 ]);
                    }
                  }
                  if ($r30) return __(scan_flags$324, [ spec$332, n$333, widths$334, 1 + i$335 ]);
                });
           var scan_conv$325 =
             _f(function (spec$340, n$341, widths$342, i$343) {
                  var conv$344 = oc$$srefu(fmt$311, i$343);
                  var $r67 = false;
                  r$67: {
                    {
                      var $r66 = false;
                      r$66: {
                        {
                          var $r65 = false;
                          r$65: {
                            {
                              var $r64 = false;
                              r$64: {
                                {
                                  var $r63 = false;
                                  r$63: {
                                    {
                                      var $r62 = false;
                                      r$62: {
                                        {
                                          var $r61 = false;
                                          r$61: {
                                            {
                                              var $r68 = false;
                                              r$68: {
                                                {
                                                  if (conv$344 >= 124) { { $r68 = true; break r$68; } }
                                                  switch (conv$344)
                                                  {
                                                  case 0: $r68 = true; break r$68;
                                                  case 1: $r68 = true; break r$68;
                                                  case 2: $r68 = true; break r$68;
                                                  case 3: $r68 = true; break r$68;
                                                  case 4: $r68 = true; break r$68;
                                                  case 5: $r68 = true; break r$68;
                                                  case 6: $r68 = true; break r$68;
                                                  case 7: $r68 = true; break r$68;
                                                  case 8: $r68 = true; break r$68;
                                                  case 9: $r68 = true; break r$68;
                                                  case 10: $r68 = true; break r$68;
                                                  case 11: $r68 = true; break r$68;
                                                  case 12: $r68 = true; break r$68;
                                                  case 13: $r68 = true; break r$68;
                                                  case 14: $r68 = true; break r$68;
                                                  case 15: $r68 = true; break r$68;
                                                  case 16: $r68 = true; break r$68;
                                                  case 17: $r68 = true; break r$68;
                                                  case 18: $r68 = true; break r$68;
                                                  case 19: $r68 = true; break r$68;
                                                  case 20: $r68 = true; break r$68;
                                                  case 21: $r68 = true; break r$68;
                                                  case 22: $r68 = true; break r$68;
                                                  case 23: $r68 = true; break r$68;
                                                  case 24: $r68 = true; break r$68;
                                                  case 25: $r68 = true; break r$68;
                                                  case 26: $r68 = true; break r$68;
                                                  case 27: $r68 = true; break r$68;
                                                  case 28: $r68 = true; break r$68;
                                                  case 29: $r68 = true; break r$68;
                                                  case 30: $r68 = true; break r$68;
                                                  case 31: $r68 = true; break r$68;
                                                  case 32: $r68 = true; break r$68;
                                                  case 33: return __(cont_f$318, [ n$341, 1 + i$343 ]);
                                                  case 34: $r68 = true; break r$68;
                                                  case 35: $r68 = true; break r$68;
                                                  case 36: $r68 = true; break r$68;
                                                  case 37: return __(cont_s$315, [ n$341, "%", 1 + i$343 ]);
                                                  case 38: $r68 = true; break r$68;
                                                  case 39: $r68 = true; break r$68;
                                                  case 40: $r67 = true; break r$67;
                                                  case 41: return __(cont_s$315, [ n$341, "", 1 + i$343 ]);
                                                  case 42: $r68 = true; break r$68;
                                                  case 43: $r68 = true; break r$68;
                                                  case 44: return __(cont_s$315, [ n$341, "", 1 + i$343 ]);
                                                  case 45: $r68 = true; break r$68;
                                                  case 46: $r68 = true; break r$68;
                                                  case 47: $r68 = true; break r$68;
                                                  case 48: $r68 = true; break r$68;
                                                  case 49: $r68 = true; break r$68;
                                                  case 50: $r68 = true; break r$68;
                                                  case 51: $r68 = true; break r$68;
                                                  case 52: $r68 = true; break r$68;
                                                  case 53: $r68 = true; break r$68;
                                                  case 54: $r68 = true; break r$68;
                                                  case 55: $r68 = true; break r$68;
                                                  case 56: $r68 = true; break r$68;
                                                  case 57: $r68 = true; break r$68;
                                                  case 58: $r68 = true; break r$68;
                                                  case 59: $r68 = true; break r$68;
                                                  case 60: $r68 = true; break r$68;
                                                  case 61: $r68 = true; break r$68;
                                                  case 62: $r68 = true; break r$68;
                                                  case 63: $r68 = true; break r$68;
                                                  case 64: $r68 = true; break r$68;
                                                  case 65: $r68 = true; break r$68;
                                                  case 66: $r65 = true; break r$65;
                                                  case 67: $r62 = true; break r$62;
                                                  case 68: $r68 = true; break r$68;
                                                  case 69: $r64 = true; break r$64;
                                                  case 70:
                                                    var x$359 = _(get_arg$320, [ spec$340, n$341 ]);
                                                    var s$360 =
                                                      widths$342 === 0 ?
                                                        _(oc$Pervasives$[20], [ x$359 ]) :
                                                        _(format_float_lexeme$297,
                                                          [
                                                            _(extract_format_float$138,
                                                              [ conv$344, fmt$311, pos$314, i$343, widths$342 ]),
                                                            x$359
                                                          ]);
                                                    return __(cont_s$315,
                                                              [ _(next_index$290, [ spec$340, n$341 ]), s$360, 1 + i$343 ]);
                                                  case 71: $r64 = true; break r$64;
                                                  case 72: $r68 = true; break r$68;
                                                  case 73: $r68 = true; break r$68;
                                                  case 74: $r68 = true; break r$68;
                                                  case 75: $r68 = true; break r$68;
                                                  case 76: $r66 = true; break r$66;
                                                  case 77: $r68 = true; break r$68;
                                                  case 78: $r63 = true; break r$63;
                                                  case 79: $r68 = true; break r$68;
                                                  case 80: $r68 = true; break r$68;
                                                  case 81: $r68 = true; break r$68;
                                                  case 82: $r68 = true; break r$68;
                                                  case 83: $r61 = true; break r$61;
                                                  case 84: $r68 = true; break r$68;
                                                  case 85: $r68 = true; break r$68;
                                                  case 86: $r68 = true; break r$68;
                                                  case 87: $r68 = true; break r$68;
                                                  case 88: $r63 = true; break r$63;
                                                  case 89: $r68 = true; break r$68;
                                                  case 90: $r68 = true; break r$68;
                                                  case 91: $r68 = true; break r$68;
                                                  case 92: $r68 = true; break r$68;
                                                  case 93: $r68 = true; break r$68;
                                                  case 94: $r68 = true; break r$68;
                                                  case 95: $r68 = true; break r$68;
                                                  case 96: $r68 = true; break r$68;
                                                  case 97:
                                                    var printer$362 = _(get_arg$320, [ spec$340, n$341 ]);
                                                    var n$363 = _(Sformat$84[2], [ _(get_index$293, [ spec$340, n$341 ]) ]);
                                                    var arg$364 = _(get_arg$320, [ 0, n$363 ]);
                                                    return __(cont_a$316,
                                                              [
                                                                _(next_index$290, [ spec$340, n$363 ]),
                                                                printer$362,
                                                                arg$364,
                                                                1 + i$343
                                                              ]);
                                                  case 98: $r65 = true; break r$65;
                                                  case 99: $r62 = true; break r$62;
                                                  case 100: $r63 = true; break r$63;
                                                  case 101: $r64 = true; break r$64;
                                                  case 102: $r64 = true; break r$64;
                                                  case 103: $r64 = true; break r$64;
                                                  case 104: $r68 = true; break r$68;
                                                  case 105: $r63 = true; break r$63;
                                                  case 106: $r68 = true; break r$68;
                                                  case 107: $r68 = true; break r$68;
                                                  case 108: $r66 = true; break r$66;
                                                  case 109: $r68 = true; break r$68;
                                                  case 110: $r66 = true; break r$66;
                                                  case 111: $r63 = true; break r$63;
                                                  case 112: $r68 = true; break r$68;
                                                  case 113: $r68 = true; break r$68;
                                                  case 114: $r68 = true; break r$68;
                                                  case 115: $r61 = true; break r$61;
                                                  case 116:
                                                    var printer$365 = _(get_arg$320, [ spec$340, n$341 ]);
                                                    return __(cont_t$317,
                                                              [ _(next_index$290, [ spec$340, n$341 ]), printer$365, 1 + i$343 ]);
                                                  case 117: $r63 = true; break r$63;
                                                  case 118: $r68 = true; break r$68;
                                                  case 119: $r68 = true; break r$68;
                                                  case 120: $r63 = true; break r$63;
                                                  case 121: $r68 = true; break r$68;
                                                  case 122: $r68 = true; break r$68;
                                                  case 123: $r67 = true; break r$67;
                                                  default: return null;
                                                  }
                                                }
                                              }
                                              if ($r68) return __(bad_conversion_format$89, [ fmt$311, i$343, conv$344 ]);
                                            }
                                          }
                                          if ($r61) {
                                            {
                                              var x$350 = _(get_arg$320, [ spec$340, n$341 ]);
                                              var x$351 =
                                                conv$344 === 115 ?
                                                  x$350 :
                                                  _(oc$Pervasives$[15],
                                                    [ "\"", _(oc$Pervasives$[15], [ _(oc$String$[7], [ x$350 ]), "\"" ]) ]);
                                              var s$352 =
                                                i$343 === 1 + pos$314 ?
                                                  x$351 :
                                                  _(format_string$108,
                                                    [ _(extract_format$113, [ fmt$311, pos$314, i$343, widths$342 ]), x$351 ]);
                                              return __(cont_s$315, [ _(next_index$290, [ spec$340, n$341 ]), s$352, 1 + i$343 ]);
                                            }
                                          }
                                        }
                                      }
                                      if ($r62) {
                                        {
                                          var x$353 = _(get_arg$320, [ spec$340, n$341 ]);
                                          var s$354 =
                                            conv$344 === 99 ?
                                              _(oc$String$[0], [ 1, x$353 ]) :
                                              _(oc$Pervasives$[15],
                                                [ "\'", _(oc$Pervasives$[15], [ _(oc$Char$[1], [ x$353 ]), "\'" ]) ]);
                                          return __(cont_s$315, [ _(next_index$290, [ spec$340, n$341 ]), s$354, 1 + i$343 ]);
                                        }
                                      }
                                    }
                                  }
                                  if ($r63) {
                                    {
                                      var x$355 = _(get_arg$320, [ spec$340, n$341 ]);
                                      var s$356 =
                                        caml_format_int(_(extract_format$113, [ fmt$311, pos$314, i$343, widths$342 ]), x$355);
                                      return __(cont_s$315, [ _(next_index$290, [ spec$340, n$341 ]), s$356, 1 + i$343 ]);
                                    }
                                  }
                                }
                              }
                              if ($r64) {
                                {
                                  var x$357 = _(get_arg$320, [ spec$340, n$341 ]);
                                  var s$358 = oc$$sprintf(_(extract_format$113, [ fmt$311, pos$314, i$343, widths$342 ]), x$357);
                                  return __(cont_s$315, [ _(next_index$290, [ spec$340, n$341 ]), s$358, 1 + i$343 ]);
                                }
                              }
                            }
                          }
                          if ($r65) {
                            {
                              var x$361 = _(get_arg$320, [ spec$340, n$341 ]);
                              return __(cont_s$315,
                                        [ _(next_index$290, [ spec$340, n$341 ]), _(oc$Pervasives$[17], [ x$361 ]), 1 + i$343 ]);
                            }
                          }
                        }
                      }
                      if ($r66) {
                        {
                          var match$481 = oc$$srefu(fmt$311, 1 + i$343);
                          var $r56 = false;
                          r$56: {
                            {
                              var $r57 = false;
                              r$57: {
                                {
                                  var switcher$482 = -88 + match$481;
                                  if (switcher$482 < 0 || switcher$482 > 32) { { $r57 = true; break r$57; } }
                                  switch (switcher$482)
                                  {
                                  case 0: $r56 = true; break r$56;
                                  case 1: $r57 = true; break r$57;
                                  case 2: $r57 = true; break r$57;
                                  case 3: $r57 = true; break r$57;
                                  case 4: $r57 = true; break r$57;
                                  case 5: $r57 = true; break r$57;
                                  case 6: $r57 = true; break r$57;
                                  case 7: $r57 = true; break r$57;
                                  case 8: $r57 = true; break r$57;
                                  case 9: $r57 = true; break r$57;
                                  case 10: $r57 = true; break r$57;
                                  case 11: $r57 = true; break r$57;
                                  case 12: $r56 = true; break r$56;
                                  case 13: $r57 = true; break r$57;
                                  case 14: $r57 = true; break r$57;
                                  case 15: $r57 = true; break r$57;
                                  case 16: $r57 = true; break r$57;
                                  case 17: $r56 = true; break r$56;
                                  case 18: $r57 = true; break r$57;
                                  case 19: $r57 = true; break r$57;
                                  case 20: $r57 = true; break r$57;
                                  case 21: $r57 = true; break r$57;
                                  case 22: $r57 = true; break r$57;
                                  case 23: $r56 = true; break r$56;
                                  case 24: $r57 = true; break r$57;
                                  case 25: $r57 = true; break r$57;
                                  case 26: $r57 = true; break r$57;
                                  case 27: $r57 = true; break r$57;
                                  case 28: $r57 = true; break r$57;
                                  case 29: $r56 = true; break r$56;
                                  case 30: $r57 = true; break r$57;
                                  case 31: $r57 = true; break r$57;
                                  case 32: $r56 = true; break r$56;
                                  default: return null;
                                  }
                                }
                              }
                              if ($r57) {
                                {
                                  var x$371 = _(get_arg$320, [ spec$340, n$341 ]);
                                  var s$372 =
                                    caml_format_int(_(extract_format$113, [ fmt$311, pos$314, i$343, widths$342 ]), x$371);
                                  return __(cont_s$315, [ _(next_index$290, [ spec$340, n$341 ]), s$372, 1 + i$343 ]);
                                }
                              }
                            }
                          }
                          if ($r56) {
                            {
                              var i$366 = 1 + i$343;
                              var s$367 =
                                function () {
                                  var $r51 = false;
                                  r$51: {
                                    {
                                      var switcher$480 = -108 + conv$344;
                                      if (switcher$480 < 0 || switcher$480 > 2) { { $r51 = true; break r$51; } }
                                      switch (switcher$480)
                                      {
                                      case 0:
                                        var x$368 = _(get_arg$320, [ spec$340, n$341 ]);
                                        return caml_format_int(_(extract_format$113, [ fmt$311, pos$314, i$366, widths$342 ]),
                                                               x$368);
                                      case 1: $r51 = true; break r$51;
                                      case 2:
                                        var x$369 = _(get_arg$320, [ spec$340, n$341 ]);
                                        return caml_format_int(_(extract_format$113, [ fmt$311, pos$314, i$366, widths$342 ]),
                                                               x$369);
                                      default: return null;
                                      }
                                    }
                                  }
                                  if ($r51) {
                                    {
                                      var x$370 = _(get_arg$320, [ spec$340, n$341 ]);
                                      return caml_format_int(_(extract_format$113, [ fmt$311, pos$314, i$366, widths$342 ]), x$370);
                                    }
                                  }
                                }();
                              return __(cont_s$315, [ _(next_index$290, [ spec$340, n$341 ]), s$367, 1 + i$366 ]);
                            }
                          }
                        }
                      }
                    }
                  }
                  if ($r67) {
                    {
                      var xf$373 = _(get_arg$320, [ spec$340, n$341 ]);
                      var i$374 = 1 + i$343;
                      var j$375 = _(sub_format_for_printf$163, [ conv$344, fmt$311, i$374 ]);
                      if (conv$344 === 123)
                        return __(cont_s$315,
                                  [ _(next_index$290, [ spec$340, n$341 ]), _(summarize_format_type$190, [ xf$373 ]), j$375 ]);
                      return __(cont_m$319, [ _(next_index$290, [ spec$340, n$341 ]), xf$373, j$375 ]);
                    }
                  }
                });
           return __(scan_positional$323, [ n$313, 0, 1 + pos$314 ]);
         });
    var mkprintf$376 =
      _f(function (to_s$377, get_out$378, outc$379, outs$380, flush$381, k$382, fmt$383) {
           var out$384 = _(get_out$378, [ fmt$383 ]);
           var pr$385 =
             _f(function (k$386, n$387, fmt$388, v$389) {
                  var len$390 = fmt$388.length;
                  var doprn$391 =
                    _f(function (n$397, i$398) {
                         if (i$398 >= len$390) return _(k$386, [ out$384 ]);
                         var c$399 = oc$$srefu(fmt$388, i$398);
                         if (c$399 !== 37) { { _(outc$379, [ out$384, c$399 ]); return __(doprn$391, [ n$397, 1 + i$398 ]); } }
                         return __(scan_format$310,
                                   [ fmt$388, v$389, n$397, i$398, cont_s$392, cont_a$393, cont_t$394, cont_f$395, cont_m$396 ]);
                       });
                  var cont_s$392 =
                    _f(function (n$400, s$401, i$402) { _(outs$380, [ out$384, s$401 ]); return __(doprn$391, [ n$400, i$402 ]); });
                  var cont_a$393 =
                    _f(function (n$403, printer$404, arg$405, i$406) {
                         if (to_s$377)
                           _(outs$380, [ out$384, _(printer$404, [ 0, arg$405 ]) ]);
                         else
                           _(printer$404, [ out$384, arg$405 ]);
                         return __(doprn$391, [ n$403, i$406 ]);
                       });
                  var cont_t$394 =
                    _f(function (n$407, printer$408, i$409) {
                         if (to_s$377) _(outs$380, [ out$384, _(printer$408, [ 0 ]) ]); else _(printer$408, [ out$384 ]);
                         return __(doprn$391, [ n$407, i$409 ]);
                       });
                  var cont_f$395 =
                    _f(function (n$410, i$411) { _(flush$381, [ out$384 ]); return __(doprn$391, [ n$410, i$411 ]); });
                  var cont_m$396 =
                    _f(function (n$412, xf$413, i$414) {
                         var m$415 = _(Sformat$84[1], [ _(count_arguments_of_format$226, [ xf$413 ]), n$412 ]);
                         return __(pr$385,
                                   [ _f(function (param$477) { return __(doprn$391, [ m$415, i$414 ]); }), n$412, xf$413, v$389 ]);
                       });
                  return __(doprn$391, [ n$387, 0 ]);
                });
           var kpr$416 = _(pr$385, [ k$382, _(Sformat$84[0], [ 0 ]) ]);
           return __(kapr$237, [ kpr$416, fmt$383 ]);
         });
    var kfprintf$417 =
      _f(function (k$418, oc$419) {
           return __(mkprintf$376,
                     [
                       0,
                       _f(function (param$476) { return oc$419; }),
                       oc$Pervasives$[45],
                       oc$Pervasives$[46],
                       oc$Pervasives$[43],
                       k$418
                     ]);
         });
    var ifprintf$420 =
      _f(function (oc$421) { return __(kapr$237, [ _f(function (param$474) { return _f(function (prim$475) { return 0; }); }) ]); });
    var fprintf$422 = _f(function (oc$423) { return __(kfprintf$417, [ _f(function (prim$473) { return 0; }), oc$423 ]); });
    var printf$424 = _f(function (fmt$425) { return __(fprintf$422, [ oc$Pervasives$[23], fmt$425 ]); });
    var eprintf$426 = _f(function (fmt$427) { return __(fprintf$422, [ oc$Pervasives$[24], fmt$427 ]); });
    var kbprintf$428 =
      _f(function (k$429, b$430) {
           return __(mkprintf$376,
                     [
                       0,
                       _f(function (param$471) { return b$430; }),
                       oc$Buffer$[8],
                       oc$Buffer$[9],
                       _f(function (prim$472) { return 0; }),
                       k$429
                     ]);
         });
    var bprintf$431 = _f(function (b$432) { return __(kbprintf$428, [ _f(function (prim$470) { return 0; }), b$432 ]); });
    var get_buff$433 = _f(function (fmt$434) { var len$435 = 2 * fmt$434.length; return __(oc$Buffer$[0], [ len$435 ]); });
    var get_contents$436 =
      _f(function (b$437) { var s$438 = _(oc$Buffer$[1], [ b$437 ]); _(oc$Buffer$[6], [ b$437 ]); return s$438; });
    var get_cont$439 = _f(function (k$440, b$441) { return __(k$440, [ _(get_contents$436, [ b$441 ]) ]); });
    var ksprintf$442 =
      _f(function (k$443) {
           return __(mkprintf$376,
                     [
                       1,
                       get_buff$433,
                       oc$Buffer$[8],
                       oc$Buffer$[9],
                       _f(function (prim$469) { return 0; }),
                       _(get_cont$439, [ k$443 ])
                     ]);
         });
    var sprintf$445 = _f(function (fmt$446) { return __(ksprintf$442, [ _f(function (s$447) { return s$447; }), fmt$446 ]); });
    var CamlinternalPr$462 =
      function () {
        var Tformat$461 = $(ac_of_format$212, sub_format$145, summarize_format_type$190, scan_format$310, kapr$237);
        return $(Sformat$84, Tformat$461);
      }();
    return $(fprintf$422, printf$424, eprintf$426, ifprintf$420, sprintf$445, bprintf$431, kfprintf$417, ksprintf$442,
             kbprintf$428, ksprintf$442,
             $(function () { var let$468 = CamlinternalPr$462[0]; return $(let$468[0], let$468[2], let$468[4], let$468[5]); }(),
               CamlinternalPr$462[1]));
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
var oc$ListLabels$ =
  function () {
    var include$99 = oc$List$;
    return $(include$99[0], include$99[1], include$99[2], include$99[3], 
             include$99[4], include$99[5], include$99[6], include$99[7], 
             include$99[8], include$99[9], include$99[10], include$99[11], 
             include$99[12], include$99[13], include$99[14], include$99[15], 
             include$99[16], include$99[17], include$99[18], include$99[19], 
             include$99[20], include$99[21], include$99[22], include$99[23], 
             include$99[24], include$99[25], include$99[26], include$99[27], 
             include$99[28], include$99[29], include$99[30], include$99[31], 
             include$99[32], include$99[33], include$99[34], include$99[35], 
             include$99[36], include$99[37], include$99[38], include$99[39], 
             include$99[40]);
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
    var debug$76 = $(_f(function (prim$1156) { return 0; }));
    var set_debug$77 = _f(function (f$78) { debug$76[0] = f$78; return __(TS$75[9], [ f$78 ]); });
    var handle_exn$79 = $(_f(function (prim$1155) { throw prim$1155; }));
    var set_exn_handler$80 = _f(function (h$81) { return handle_exn$79[0] = h$81; });
    var total_eq$115 =
      _f(function (v1$116, v2$117) { try { return caml_compare(v1$116, v2$117) === 0; } catch (exn$1154) { return 0; } });
    var hash$118 =
      _f(function (t$119) {
           var match$1152 = t$119;
           switch ($t(match$1152)) { case 0: return match$1152[0]; case 1: return match$1152[0][0]; default: return null; }
         });
    var Unset$122 = $("Froc_ddg.Unset");
    var next_id$123 =
      function () {
        var next_id$124 = $(1);
        return _f(function (param$1151) { var id$125 = next_id$124[0]; next_id$124[0]++; return id$125; });
      }();
    var unset$126 = $1($(Unset$122));
    var make_changeable$127 =
      _f(function ($2Aopt$2A$128, $2Aopt$2A$131, param$1149) {
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
      _f(function (t$145) { var match$1146 = t$145; switch ($t(match$1146)) { case 0: return 1; default: return 0; } });
    var clear$146 = _f(function (u$147) { var c$148 = u$147; return c$148[2] = unset$126; });
    var write_result$149 =
      _f(function (u$150, r$151) {
           var c$152 = u$150;
           var eq$153 =
             function () {
               var match$1144 = c$152[2];
               var $r254 = false;
               r$254:
                 switch ($t(match$1144))
                 {
                 case 0:
                   switch ($t(r$151))
                   {
                   case 0: return _(c$152[1], [ match$1144[0], r$151[0] ]);
                   default: $r254 = true; break r$254;
                   }
                   break;
                 case 1:
                   switch ($t(r$151)) { case 1: return match$1144[0] === r$151[0]; default: $r254 = true; break r$254; }
                   break;
                 default: return null;
                 }
               if ($r254) return 0;
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
           var match$1142 = t$171;
           switch ($t(match$1142)) { case 0: return match$1142[1]; case 1: return match$1142[0][2]; default: return null; }
         });
    var read$174 =
      _f(function (t$175) {
           var match$1141 = _(read_result$170, [ t$175 ]);
           switch ($t(match$1141)) { case 0: return match$1141[0]; case 1: throw match$1141[0]; default: return null; }
         });
    var make_cancel$179 = _f(function (f$180) { return f$180; });
    var no_cancel$181 = _f(function (prim$1140) { return 0; });
    var cancel$182 = _f(function (c$183) { return __(c$183, [ 0 ]); });
    var add_dep_cancel$184 =
      _f(function (ts$185, t$186, dep$187) {
           var cancel$188 =
             function () {
               var match$1137 = t$186;
               switch ($t(match$1137))
               {
               case 0: return no_cancel$181;
               case 1:
                 var dl$190 = _(Dlist$74[1], [ match$1137[0][3], dep$187 ]);
                 return _(make_cancel$179, [ _f(function (param$1136) { return __(Dlist$74[2], [ dl$190 ]); }) ]);
               default: return null;
               }
             }();
           _(TS$75[4], [ ts$185, cancel$188 ]);
           return cancel$188;
         });
    var add_dep$191 =
      _f(function (ts$192, t$193, dep$194) { var match$1135 = _(add_dep_cancel$184, [ ts$192, t$193, dep$194 ]); return 0; });
    var PQ$263 =
      function () {
        var make$207 = _f(function (param$1133) { return $($(), 0); });
        var is_empty$208 = _f(function (t$209) { return t$209[1] === 0; });
        var size$210 = _f(function (t$211) { return t$211[1]; });
        var compare_down$212 =
          _f(function (h$213, i$214, i$27$215) {
               var t1$216 = h$213[0][i$214][1];
               var t2$217 = h$213[0][i$27$215][1];
               var match$1131 = _(TS$75[6], [ t1$216 ]);
               var match$1132 = _(TS$75[6], [ t2$217 ]);
               if (!(match$1131 !== 0)) { { if (match$1132 !== 0) return 1; return __(TS$75[7], [ t1$216, t2$217 ]); } }
               if (match$1132 !== 0) return 0;
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
                          var match$1129 = _(TS$75[6], [ t1$242 ]);
                          var match$1130 = _(TS$75[6], [ t2$243 ]);
                          if (match$1129 !== 0) throw $(Assert_failure$26g, $("froc_ddg.ml", 209, 21));
                          if (match$1130 !== 0) {
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
    var init$265 = _f(function (param$1128) { _(TS$75[0], [ 0 ]); return pq$264[0] = _(PQ$263[0], [ 0 ]); });
    var enqueue$266 = _f(function (e$267) { return __(PQ$263[2], [ pq$264[0], e$267 ]); });
    var read_now$268 =
      _f(function ($2Aopt$2A$269, read$272) {
           var now$270 = $2Aopt$2A$269 ? $2Aopt$2A$269[0] : 1;
           if (now$270) return read$272;
           var notify$273 = $(0);
           return _f(function (param$1127) { if (!notify$273[0]) return notify$273[0] = 1; return __(read$272, [ 0 ]); });
         });
    var add_reader_cancel$274 =
      _f(function (now$275, t$276, read$277) {
           var read$278 = _(read_now$268, [ now$275, read$277 ]);
           var start$279 = _(TS$75[1], [ 0 ]);
           _(read$278, [ 0 ]);
           var r$280 = $(read$278, start$279, _(TS$75[1], [ 0 ]));
           var dep$281 = _f(function (param$1125) { return __(enqueue$266, [ r$280 ]); });
           return __(add_dep_cancel$184, [ start$279, t$276, dep$281 ]);
         });
    var add_reader$282 =
      _f(function (now$283, t$284, read$285) { var match$1124 = _(add_reader_cancel$274, [ now$283, t$284, read$285 ]); return 0; });
    var connect_cancel$286 =
      _f(function (u$287, t$27$288) {
           _(write_result$149, [ u$287, _(read_result$170, [ t$27$288 ]) ]);
           return __(add_dep_cancel$184, [ _(TS$75[1], [ 0 ]), t$27$288, _(write_result_no_eq$159, [ u$287 ]) ]);
         });
    var connect$289 =
      _f(function (u$290, t$27$291) {
           _(write_result$149, [ u$290, _(read_result$170, [ t$27$291 ]) ]);
           return __(add_dep$191, [ _(TS$75[1], [ 0 ]), t$27$291, _(write_result_no_eq$159, [ u$290 ]) ]);
         });
    var notify_result_cancel$292 =
      _f(function (now$293, t$294, f$295) {
           return __(add_reader_cancel$274,
                     [
                       now$293,
                       t$294,
                       _f(function (param$1123) {
                            try {
                              return _(f$295, [ _(read_result$170, [ t$294 ]) ]);
                            }
                            catch (e$296) {
                              return __(handle_exn$79[0], [ e$296 ]);
                            }
                          })
                     ]);
         });
    var notify_result$297 =
      _f(function (now$298, t$299, f$300) { var match$1122 = _(notify_result_cancel$292, [ now$298, t$299, f$300 ]); return 0; });
    var notify_cancel$301 =
      _f(function (now$302, t$303, f$304) {
           return __(notify_result_cancel$292,
                     [
                       now$302,
                       t$303,
                       _f(function (param$1120) {
                            switch ($t(param$1120))
                            {
                            case 0: return __(f$304, [ param$1120[0] ]);
                            case 1: return 0;
                            default: return null;
                            }
                          })
                     ]);
         });
    var notify$306 =
      _f(function (now$307, t$308, f$309) {
           return __(notify_result$297,
                     [
                       now$307,
                       t$308,
                       _f(function (param$1118) {
                            switch ($t(param$1118))
                            {
                            case 0: return __(f$309, [ param$1118[0] ]);
                            case 1: return 0;
                            default: return null;
                            }
                          })
                     ]);
         });
    var cleanup$311 = _f(function (f$312) { return __(TS$75[4], [ _(TS$75[1], [ 0 ]), f$312 ]); });
    var bind_gen$314 =
      _f(function (eq$315, return$316, assign$317, f$318, t$319) {
           var match$1115 = t$319;
           switch ($t(match$1115))
           {
           case 0:
             var match$1117 = match$1115[1];
             switch ($t(match$1117))
             {
             case 0:
               try { return _(return$316, [ _(f$318, [ match$1117[0] ]) ]); } catch (e$322) { return __(fail$142, [ e$322 ]); }
               break;
             case 1: return __(fail$142, [ match$1117[0] ]);
             default: return null;
             }
             break;
           default:
             var match$1114 = _(make_changeable$127, [ eq$315, 0, 0 ]);
             var ru$324 = match$1114[1];
             _(add_reader$282,
               [
                 0,
                 t$319,
                 _f(function (param$1112) {
                      var match$1113 = _(read_result$170, [ t$319 ]);
                      switch ($t(match$1113))
                      {
                      case 0:
                        try {
                          return _(assign$317, [ ru$324, _(f$318, [ match$1113[0] ]) ]);
                        }
                        catch (e$327) {
                          return __(write_exn$167, [ ru$324, e$327 ]);
                        }
                        break;
                      case 1: return __(write_exn$167, [ ru$324, match$1113[0] ]);
                      default: return null;
                      }
                    })
               ]);
             return match$1114[0];
           }
         });
    var bind$328 =
      _f(function (eq$329, t$330, f$331) {
           return __(bind_gen$314, [ eq$329, _f(function (prim$1111) { return prim$1111; }), connect$289, f$331, t$330 ]);
         });
    var $3E$3E$3D$332 = _f(function (t$333, f$334) { return __(bind$328, [ 0, t$333, f$334 ]); });
    var lift$335 = _f(function (eq$336, f$337) { return __(bind_gen$314, [ eq$336, return$140, write$164, f$337 ]); });
    var blift$338 = _f(function (eq$339, t$340, f$341) { return __(lift$335, [ eq$339, f$341, t$340 ]); });
    var try_bind_gen$342 =
      _f(function (eq$343, return$344, assign$345, f$346, succ$347, err$348) {
           var t$349 = function () { try { return _(f$346, [ 0 ]); } catch (e$350) { return _(fail$142, [ e$350 ]); } }();
           var match$1108 = t$349;
           switch ($t(match$1108))
           {
           case 0:
             var match$1110 = match$1108[1];
             switch ($t(match$1110))
             {
             case 0:
               try { return _(return$344, [ _(succ$347, [ match$1110[0] ]) ]); } catch (e$354) { return __(fail$142, [ e$354 ]); }
               break;
             case 1:
               try { return _(return$344, [ _(err$348, [ match$1110[0] ]) ]); } catch (e$353) { return __(fail$142, [ e$353 ]); }
               break;
             default: return null;
             }
             break;
           default:
             var match$1107 = _(make_changeable$127, [ eq$343, 0, 0 ]);
             var ru$356 = match$1107[1];
             _(add_reader$282,
               [
                 0,
                 t$349,
                 _f(function (param$1105) {
                      try {
                        return _(assign$345,
                                 [
                                   ru$356,
                                   function () {
                                     var match$1106 = _(read_result$170, [ t$349 ]);
                                     switch ($t(match$1106))
                                     {
                                     case 0: return _(succ$347, [ match$1106[0] ]);
                                     case 1: return _(err$348, [ match$1106[0] ]);
                                     default: return null;
                                     }
                                   }()
                                 ]);
                      }
                      catch (e$359) {
                        return __(write_exn$167, [ ru$356, e$359 ]);
                      }
                    })
               ]);
             return match$1107[0];
           }
         });
    var try_bind$360 =
      _f(function (eq$361, f$362, succ$363, err$364) {
           return __(try_bind_gen$342,
                     [ eq$361, _f(function (prim$1104) { return prim$1104; }), connect$289, f$362, succ$363, err$364 ]);
         });
    var try_bind_lift$365 =
      _f(function (eq$366, f$367, succ$368, err$369) {
           return __(try_bind_gen$342, [ eq$366, return$140, write$164, f$367, succ$368, err$369 ]);
         });
    var catch_gen$370 =
      _f(function (eq$371, return$372, assign$373, f$374, err$375) {
           var t$376 = function () { try { return _(f$374, [ 0 ]); } catch (e$377) { return _(fail$142, [ e$377 ]); } }();
           var match$1100 = t$376;
           switch ($t(match$1100))
           {
           case 0:
             var match$1102 = match$1100[1];
             switch ($t(match$1102))
             {
             case 0: return t$376;
             case 1:
               try { return _(return$372, [ _(err$375, [ match$1102[0] ]) ]); } catch (e$379) { return __(fail$142, [ e$379 ]); }
               break;
             default: return null;
             }
             break;
           default:
             var match$1099 = _(make_changeable$127, [ eq$371, 0, 0 ]);
             var ru$381 = match$1099[1];
             _(add_reader$282,
               [
                 0,
                 t$376,
                 _f(function (param$1097) {
                      var r$382 = _(read_result$170, [ t$376 ]);
                      switch ($t(r$382))
                      {
                      case 0: return __(write_result$149, [ ru$381, r$382 ]);
                      case 1:
                        try {
                          return _(assign$373, [ ru$381, _(err$375, [ r$382[0] ]) ]);
                        }
                        catch (e$384) {
                          return __(write_exn$167, [ ru$381, e$384 ]);
                        }
                        break;
                      default: return null;
                      }
                    })
               ]);
             return match$1099[0];
           }
         });
    var catch$385 =
      _f(function (eq$386, f$387, err$388) {
           return __(catch_gen$370, [ eq$386, _f(function (prim$1096) { return prim$1096; }), connect$289, f$387, err$388 ]);
         });
    var catch_lift$389 =
      _f(function (eq$390, f$391, err$392) { return __(catch_gen$370, [ eq$390, return$140, write$164, f$391, err$392 ]); });
    var finish$393 = _(oc$Stack$[1], [ 0 ]);
    var prop$394 =
      _f(function (until$395, param$1095) {
           if (!_(PQ$263[1], [ pq$264[0] ])) {
             {
               var r$396 = _(PQ$263[3], [ pq$264[0] ]);
               if (_(TS$75[6], [ r$396[1] ])) { { _(PQ$263[4], [ pq$264[0] ]); return __(prop$394, [ until$395, 0 ]); } }
               var $r162 = false;
               r$162: {
                 {
                   if (!until$395) { { $r162 = true; break r$162; } }
                   if (!(_(TS$75[7], [ r$396[1], until$395[0] ]) === 1)) { { $r162 = true; break r$162; } }
                   return 0;
                 }
               }
               if ($r162) {
                 {
                   _(PQ$263[4], [ pq$264[0] ]);
                   _(TS$75[3], [ r$396[1] ]);
                   _(oc$Stack$[2], [ r$396[2], finish$393 ]);
                   _(r$396[0], [ 0 ]);
                   _(oc$Stack$[3], [ finish$393 ]);
                   _(TS$75[5], [ _(TS$75[2], [ 0 ]), r$396[2] ]);
                   return __(prop$394, [ until$395, 0 ]);
                 }
               }
             }
           }
           return 0;
         });
    var propagate$398 =
      _f(function (param$1094) { var now$27$399 = _(TS$75[2], [ 0 ]); _(prop$394, [ 0, 0 ]); return __(TS$75[3], [ now$27$399 ]); });
    var memo$410 =
      _f(function (size$411, hash$412, eq$413, param$1090) {
           var h$414 = _(oc$Froc_hashtbl$[0], [ size$411, hash$412, eq$413, 0 ]);
           return _f(function (f$415, k$416) {
                       var result$417 =
                         function () {
                           try {
                             if (_(oc$Stack$[7], [ finish$393 ])) throw $(Not_found$20g); else;
                             var ok$418 =
                               _f(function (m$419) {
                                    return _(TS$75[7], [ _(TS$75[2], [ 0 ]), m$419[1] ]) === -1 &&
                                             _(TS$75[7], [ m$419[2], _(oc$Stack$[4], [ finish$393 ]) ]) === -1;
                                  });
                             var m$420 = _(oc$Froc_hashtbl$[2], [ h$414, k$416, ok$418 ]);
                             _(TS$75[5], [ _(TS$75[2], [ 0 ]), m$420[1] ]);
                             _(prop$394, [ $(m$420[2]), 0 ]);
                             _(TS$75[3], [ m$420[2] ]);
                             return m$420[0];
                           }
                           catch (exn$1091) {
                             if (exn$1091[0] === Not_found$20g) {
                               {
                                 var start$421 = _(TS$75[1], [ 0 ]);
                                 var result$422 =
                                   function () { try { return $(_(f$415, [ k$416 ])); } catch (e$423) { return $1(e$423); } }();
                                 var finish$424 = _(TS$75[1], [ 0 ]);
                                 var m$425 = $(result$422, start$421, finish$424);
                                 _(oc$Froc_hashtbl$[1], [ h$414, k$416, m$425 ]);
                                 var cancel$426 =
                                   _f(function (param$1092) {
                                        return __(oc$Froc_hashtbl$[3],
                                                  [ h$414, k$416, _f(function (m$27$427) { return m$27$427 === m$425; }) ]);
                                      });
                                 _(TS$75[4], [ finish$424, cancel$426 ]);
                                 return result$422;
                               }
                             }
                             throw exn$1091;
                           }
                         }();
                       switch ($t(result$417)) { case 0: return result$417[0]; case 1: throw result$417[0]; default: return null; }
                     });
         });
    var add_reader2$430 =
      _f(function (now$431, t1$432, t2$433, read$434) {
           var read$435 = _(read_now$268, [ now$431, read$434 ]);
           var start$436 = _(TS$75[1], [ 0 ]);
           _(read$435, [ 0 ]);
           var r$437 = $(read$435, start$436, _(TS$75[1], [ 0 ]));
           var dep$438 = _f(function (param$1088) { return __(enqueue$266, [ r$437 ]); });
           _(add_dep$191, [ start$436, t1$432, dep$438 ]);
           return __(add_dep$191, [ start$436, t2$433, dep$438 ]);
         });
    var bind2_gen$439 =
      _f(function (eq$440, return$441, assign$442, f$443, t1$444, t2$445) {
           var match$1080 = t1$444;
           var match$1081 = t2$445;
           var $r138_0 = null;
           var $r138 = false;
           r$138: {
             {
               var $r139 = false;
               r$139: {
                 {
                   var $r140 = false;
                   r$140:
                     switch ($t(match$1080))
                     {
                     case 0:
                       var match$1083 = match$1080[1];
                       switch ($t(match$1083))
                       {
                       case 0:
                         switch ($t(match$1081))
                         {
                         case 0:
                           var match$1085 = match$1081[1];
                           switch ($t(match$1085))
                           {
                           case 0:
                             try {
                               return _(return$441, [ _(f$443, [ match$1083[0], match$1085[0] ]) ]);
                             }
                             catch (e$450) {
                               return __(fail$142, [ e$450 ]);
                             }
                             break;
                           default: $r140 = true; break r$140;
                           }
                           break;
                         default: $r139 = true; break r$139;
                         }
                         break;
                       case 1: $r138_0 = match$1083[0]; $r138 = true; break r$138;
                       default: return null;
                       }
                       break;
                     default: $r140 = true; break r$140;
                     }
                   if ($r140)
                     switch ($t(match$1081))
                     {
                     case 0:
                       var match$1087 = match$1081[1];
                       switch ($t(match$1087))
                       {
                       case 1: $r138_0 = match$1087[0]; $r138 = true; break r$138;
                       default: $r139 = true; break r$139;
                       }
                       break;
                     default: $r139 = true; break r$139;
                     }
                 }
               }
               if ($r139) {
                 {
                   var match$1077 = _(make_changeable$127, [ eq$440, 0, 0 ]);
                   var ru$452 = match$1077[1];
                   _(add_reader2$430,
                     [
                       0,
                       t1$444,
                       t2$445,
                       _f(function (param$1072) {
                            var match$1075 = _(read_result$170, [ t1$444 ]);
                            var match$1076 = _(read_result$170, [ t2$445 ]);
                            var $r135_0 = null;
                            var $r135 = false;
                            r$135:
                              switch ($t(match$1075))
                              {
                              case 0:
                                switch ($t(match$1076))
                                {
                                case 0:
                                  try {
                                    return _(assign$442, [ ru$452, _(f$443, [ match$1075[0], match$1076[0] ]) ]);
                                  }
                                  catch (e$457) {
                                    return __(write_exn$167, [ ru$452, e$457 ]);
                                  }
                                  break;
                                default: $r135_0 = match$1076[0]; $r135 = true; break r$135;
                                }
                                break;
                              case 1: $r135_0 = match$1075[0]; $r135 = true; break r$135;
                              default: return null;
                              }
                            if ($r135) { { var e$453 = $r135_0; return __(write_exn$167, [ ru$452, e$453 ]); } }
                          })
                     ]);
                   return match$1077[0];
                 }
               }
             }
           }
           if ($r138) { { var e$446 = $r138_0; return __(fail$142, [ e$446 ]); } }
         });
    var bind2$458 =
      _f(function (eq$459, t1$460, t2$461, f$462) {
           return __(bind2_gen$439, [ eq$459, _f(function (prim$1071) { return prim$1071; }), connect$289, f$462, t1$460, t2$461 ]);
         });
    var lift2$463 = _f(function (eq$464, f$465) { return __(bind2_gen$439, [ eq$464, return$140, write$164, f$465 ]); });
    var blift2$466 = _f(function (eq$467, t1$468, t2$469, f$470) { return __(lift2$463, [ eq$467, f$470, t1$468, t2$469 ]); });
    var add_reader3$471 =
      _f(function (now$472, t1$473, t2$474, t3$475, read$476) {
           var read$477 = _(read_now$268, [ now$472, read$476 ]);
           var start$478 = _(TS$75[1], [ 0 ]);
           _(read$477, [ 0 ]);
           var r$479 = $(read$477, start$478, _(TS$75[1], [ 0 ]));
           var dep$480 = _f(function (param$1069) { return __(enqueue$266, [ r$479 ]); });
           _(add_dep$191, [ start$478, t1$473, dep$480 ]);
           _(add_dep$191, [ start$478, t2$474, dep$480 ]);
           return __(add_dep$191, [ start$478, t3$475, dep$480 ]);
         });
    var bind3_gen$481 =
      _f(function (eq$482, return$483, assign$484, f$485, t1$486, t2$487, t3$488) {
           var match$1056 = t1$486;
           var match$1057 = t2$487;
           var match$1058 = t3$488;
           var $r120_0 = null;
           var $r120 = false;
           r$120: {
             {
               var $r121 = false;
               r$121: {
                 {
                   var $r122 = false;
                   r$122: {
                     {
                       var $r123 = false;
                       r$123:
                         switch ($t(match$1056))
                         {
                         case 0:
                           var match$1060 = match$1056[1];
                           switch ($t(match$1060))
                           {
                           case 0:
                             switch ($t(match$1057))
                             {
                             case 0:
                               var match$1062 = match$1057[1];
                               switch ($t(match$1062))
                               {
                               case 0:
                                 switch ($t(match$1058))
                                 {
                                 case 0:
                                   var match$1064 = match$1058[1];
                                   switch ($t(match$1064))
                                   {
                                   case 0:
                                     try {
                                       return _(return$483, [ _(f$485, [ match$1060[0], match$1062[0], match$1064[0] ]) ]);
                                     }
                                     catch (e$495) {
                                       return __(fail$142, [ e$495 ]);
                                     }
                                     break;
                                   default: $r122 = true; break r$122;
                                   }
                                   break;
                                 default: $r121 = true; break r$121;
                                 }
                                 break;
                               default: $r123 = true; break r$123;
                               }
                               break;
                             default: $r122 = true; break r$122;
                             }
                             break;
                           case 1: $r120_0 = match$1060[0]; $r120 = true; break r$120;
                           default: return null;
                           }
                           break;
                         default: $r123 = true; break r$123;
                         }
                       if ($r123)
                         switch ($t(match$1057))
                         {
                         case 0:
                           var match$1066 = match$1057[1];
                           switch ($t(match$1066))
                           {
                           case 1: $r120_0 = match$1066[0]; $r120 = true; break r$120;
                           default: $r122 = true; break r$122;
                           }
                           break;
                         default: $r122 = true; break r$122;
                         }
                     }
                   }
                   if ($r122)
                     switch ($t(match$1058))
                     {
                     case 0:
                       var match$1068 = match$1058[1];
                       switch ($t(match$1068))
                       {
                       case 1: $r120_0 = match$1068[0]; $r120 = true; break r$120;
                       default: $r121 = true; break r$121;
                       }
                       break;
                     default: $r121 = true; break r$121;
                     }
                 }
               }
               if ($r121) {
                 {
                   var match$1052 = _(make_changeable$127, [ eq$482, 0, 0 ]);
                   var ru$497 = match$1052[1];
                   _(add_reader3$471,
                     [
                       0,
                       t1$486,
                       t2$487,
                       t3$488,
                       _f(function (param$1045) {
                            var match$1049 = _(read_result$170, [ t1$486 ]);
                            var match$1050 = _(read_result$170, [ t2$487 ]);
                            var match$1051 = _(read_result$170, [ t3$488 ]);
                            var $r116_0 = null;
                            var $r116 = false;
                            r$116:
                              switch ($t(match$1049))
                              {
                              case 0:
                                switch ($t(match$1050))
                                {
                                case 0:
                                  switch ($t(match$1051))
                                  {
                                  case 0:
                                    try {
                                      return _(assign$484, [ ru$497, _(f$485, [ match$1049[0], match$1050[0], match$1051[0] ]) ]);
                                    }
                                    catch (e$504) {
                                      return __(write_exn$167, [ ru$497, e$504 ]);
                                    }
                                    break;
                                  default: $r116_0 = match$1051[0]; $r116 = true; break r$116;
                                  }
                                  break;
                                default: $r116_0 = match$1050[0]; $r116 = true; break r$116;
                                }
                                break;
                              case 1: $r116_0 = match$1049[0]; $r116 = true; break r$116;
                              default: return null;
                              }
                            if ($r116) { { var e$498 = $r116_0; return __(write_exn$167, [ ru$497, e$498 ]); } }
                          })
                     ]);
                   return match$1052[0];
                 }
               }
             }
           }
           if ($r120) { { var e$489 = $r120_0; return __(fail$142, [ e$489 ]); } }
         });
    var bind3$505 =
      _f(function (eq$506, t1$507, t2$508, t3$509, f$510) {
           return __(bind3_gen$481,
                     [ eq$506, _f(function (prim$1044) { return prim$1044; }), connect$289, f$510, t1$507, t2$508, t3$509 ]);
         });
    var lift3$511 = _f(function (eq$512, f$513) { return __(bind3_gen$481, [ eq$512, return$140, write$164, f$513 ]); });
    var blift3$514 =
      _f(function (eq$515, t1$516, t2$517, t3$518, f$519) { return __(lift3$511, [ eq$515, f$519, t1$516, t2$517, t3$518 ]); });
    var add_reader4$520 =
      _f(function (now$521, t1$522, t2$523, t3$524, t4$525, read$526) {
           var read$527 = _(read_now$268, [ now$521, read$526 ]);
           var start$528 = _(TS$75[1], [ 0 ]);
           _(read$527, [ 0 ]);
           var r$529 = $(read$527, start$528, _(TS$75[1], [ 0 ]));
           var dep$530 = _f(function (param$1042) { return __(enqueue$266, [ r$529 ]); });
           _(add_dep$191, [ start$528, t1$522, dep$530 ]);
           _(add_dep$191, [ start$528, t2$523, dep$530 ]);
           _(add_dep$191, [ start$528, t3$524, dep$530 ]);
           return __(add_dep$191, [ start$528, t4$525, dep$530 ]);
         });
    var bind4_gen$531 =
      _f(function (eq$532, return$533, assign$534, f$535, t1$536, t2$537, t3$538, t4$539) {
           var match$1024 = t1$536;
           var match$1025 = t2$537;
           var match$1026 = t3$538;
           var match$1027 = t4$539;
           var $r100_0 = null;
           var $r100 = false;
           r$100: {
             {
               var $r101 = false;
               r$101: {
                 {
                   var $r102 = false;
                   r$102: {
                     {
                       var $r103 = false;
                       r$103: {
                         {
                           var $r104 = false;
                           r$104:
                             switch ($t(match$1024))
                             {
                             case 0:
                               var match$1029 = match$1024[1];
                               switch ($t(match$1029))
                               {
                               case 0:
                                 switch ($t(match$1025))
                                 {
                                 case 0:
                                   var match$1031 = match$1025[1];
                                   switch ($t(match$1031))
                                   {
                                   case 0:
                                     switch ($t(match$1026))
                                     {
                                     case 0:
                                       var match$1033 = match$1026[1];
                                       switch ($t(match$1033))
                                       {
                                       case 0:
                                         switch ($t(match$1027))
                                         {
                                         case 0:
                                           var match$1035 = match$1027[1];
                                           switch ($t(match$1035))
                                           {
                                           case 0:
                                             try {
                                               return _(return$533,
                                                        [
                                                          _(f$535, [ match$1029[0], match$1031[0], match$1033[0], match$1035[0] ])
                                                        ]);
                                             }
                                             catch (e$548) {
                                               return __(fail$142, [ e$548 ]);
                                             }
                                             break;
                                           default: $r102 = true; break r$102;
                                           }
                                           break;
                                         default: $r101 = true; break r$101;
                                         }
                                         break;
                                       default: $r103 = true; break r$103;
                                       }
                                       break;
                                     default: $r102 = true; break r$102;
                                     }
                                     break;
                                   default: $r104 = true; break r$104;
                                   }
                                   break;
                                 default: $r103 = true; break r$103;
                                 }
                                 break;
                               case 1: $r100_0 = match$1029[0]; $r100 = true; break r$100;
                               default: return null;
                               }
                               break;
                             default: $r104 = true; break r$104;
                             }
                           if ($r104)
                             switch ($t(match$1025))
                             {
                             case 0:
                               var match$1037 = match$1025[1];
                               switch ($t(match$1037))
                               {
                               case 1: $r100_0 = match$1037[0]; $r100 = true; break r$100;
                               default: $r103 = true; break r$103;
                               }
                               break;
                             default: $r103 = true; break r$103;
                             }
                         }
                       }
                       if ($r103)
                         switch ($t(match$1026))
                         {
                         case 0:
                           var match$1039 = match$1026[1];
                           switch ($t(match$1039))
                           {
                           case 1: $r100_0 = match$1039[0]; $r100 = true; break r$100;
                           default: $r102 = true; break r$102;
                           }
                           break;
                         default: $r102 = true; break r$102;
                         }
                     }
                   }
                   if ($r102)
                     switch ($t(match$1027))
                     {
                     case 0:
                       var match$1041 = match$1027[1];
                       switch ($t(match$1041))
                       {
                       case 1: $r100_0 = match$1041[0]; $r100 = true; break r$100;
                       default: $r101 = true; break r$101;
                       }
                       break;
                     default: $r101 = true; break r$101;
                     }
                 }
               }
               if ($r101) {
                 {
                   var match$1019 = _(make_changeable$127, [ eq$532, 0, 0 ]);
                   var ru$550 = match$1019[1];
                   _(add_reader4$520,
                     [
                       0,
                       t1$536,
                       t2$537,
                       t3$538,
                       t4$539,
                       _f(function (param$1010) {
                            var match$1015 = _(read_result$170, [ t1$536 ]);
                            var match$1016 = _(read_result$170, [ t2$537 ]);
                            var match$1017 = _(read_result$170, [ t3$538 ]);
                            var match$1018 = _(read_result$170, [ t4$539 ]);
                            var $r95_0 = null;
                            var $r95 = false;
                            r$95:
                              switch ($t(match$1015))
                              {
                              case 0:
                                switch ($t(match$1016))
                                {
                                case 0:
                                  switch ($t(match$1017))
                                  {
                                  case 0:
                                    switch ($t(match$1018))
                                    {
                                    case 0:
                                      try {
                                        return _(assign$534,
                                                 [
                                                   ru$550,
                                                   _(f$535, [ match$1015[0], match$1016[0], match$1017[0], match$1018[0] ])
                                                 ]);
                                      }
                                      catch (e$559) {
                                        return __(write_exn$167, [ ru$550, e$559 ]);
                                      }
                                      break;
                                    default: $r95_0 = match$1018[0]; $r95 = true; break r$95;
                                    }
                                    break;
                                  default: $r95_0 = match$1017[0]; $r95 = true; break r$95;
                                  }
                                  break;
                                default: $r95_0 = match$1016[0]; $r95 = true; break r$95;
                                }
                                break;
                              case 1: $r95_0 = match$1015[0]; $r95 = true; break r$95;
                              default: return null;
                              }
                            if ($r95) { { var e$551 = $r95_0; return __(write_exn$167, [ ru$550, e$551 ]); } }
                          })
                     ]);
                   return match$1019[0];
                 }
               }
             }
           }
           if ($r100) { { var e$540 = $r100_0; return __(fail$142, [ e$540 ]); } }
         });
    var bind4$560 =
      _f(function (eq$561, t1$562, t2$563, t3$564, t4$565, f$566) {
           return __(bind4_gen$531,
                     [ eq$561, _f(function (prim$1009) { return prim$1009; }), connect$289, f$566, t1$562, t2$563, t3$564, t4$565 ]);
         });
    var lift4$567 = _f(function (eq$568, f$569) { return __(bind4_gen$531, [ eq$568, return$140, write$164, f$569 ]); });
    var blift4$570 =
      _f(function (eq$571, t1$572, t2$573, t3$574, t4$575, f$576) {
           return __(lift4$567, [ eq$571, f$576, t1$572, t2$573, t3$574, t4$575 ]);
         });
    var add_reader5$577 =
      _f(function (now$578, t1$579, t2$580, t3$581, t4$582, t5$583, read$584) {
           var read$585 = _(read_now$268, [ now$578, read$584 ]);
           var start$586 = _(TS$75[1], [ 0 ]);
           _(read$585, [ 0 ]);
           var r$587 = $(read$585, start$586, _(TS$75[1], [ 0 ]));
           var dep$588 = _f(function (param$1007) { return __(enqueue$266, [ r$587 ]); });
           _(add_dep$191, [ start$586, t1$579, dep$588 ]);
           _(add_dep$191, [ start$586, t2$580, dep$588 ]);
           _(add_dep$191, [ start$586, t3$581, dep$588 ]);
           _(add_dep$191, [ start$586, t4$582, dep$588 ]);
           return __(add_dep$191, [ start$586, t5$583, dep$588 ]);
         });
    var bind5_gen$589 =
      _f(function (eq$590, return$591, assign$592, f$593, t1$594, t2$595, t3$596, t4$597, t5$598) {
           var match$984 = t1$594;
           var match$985 = t2$595;
           var match$986 = t3$596;
           var match$987 = t4$597;
           var match$988 = t5$598;
           var $r78_0 = null;
           var $r78 = false;
           r$78: {
             {
               var $r79 = false;
               r$79: {
                 {
                   var $r80 = false;
                   r$80: {
                     {
                       var $r81 = false;
                       r$81: {
                         {
                           var $r82 = false;
                           r$82: {
                             {
                               var $r83 = false;
                               r$83:
                                 switch ($t(match$984))
                                 {
                                 case 0:
                                   var match$990 = match$984[1];
                                   switch ($t(match$990))
                                   {
                                   case 0:
                                     switch ($t(match$985))
                                     {
                                     case 0:
                                       var match$992 = match$985[1];
                                       switch ($t(match$992))
                                       {
                                       case 0:
                                         switch ($t(match$986))
                                         {
                                         case 0:
                                           var match$994 = match$986[1];
                                           switch ($t(match$994))
                                           {
                                           case 0:
                                             switch ($t(match$987))
                                             {
                                             case 0:
                                               var match$996 = match$987[1];
                                               switch ($t(match$996))
                                               {
                                               case 0:
                                                 switch ($t(match$988))
                                                 {
                                                 case 0:
                                                   var match$998 = match$988[1];
                                                   switch ($t(match$998))
                                                   {
                                                   case 0:
                                                     try {
                                                       return _(return$591,
                                                                [
                                                                  _(f$593,
                                                                    [
                                                                    match$990[0],
                                                                    match$992[0],
                                                                    match$994[0],
                                                                    match$996[0],
                                                                    match$998[0]
                                                                    ])
                                                                ]);
                                                     }
                                                     catch (e$609) {
                                                       return __(fail$142, [ e$609 ]);
                                                     }
                                                     break;
                                                   default: $r80 = true; break r$80;
                                                   }
                                                   break;
                                                 default: $r79 = true; break r$79;
                                                 }
                                                 break;
                                               default: $r81 = true; break r$81;
                                               }
                                               break;
                                             default: $r80 = true; break r$80;
                                             }
                                             break;
                                           default: $r82 = true; break r$82;
                                           }
                                           break;
                                         default: $r81 = true; break r$81;
                                         }
                                         break;
                                       default: $r83 = true; break r$83;
                                       }
                                       break;
                                     default: $r82 = true; break r$82;
                                     }
                                     break;
                                   case 1: $r78_0 = match$990[0]; $r78 = true; break r$78;
                                   default: return null;
                                   }
                                   break;
                                 default: $r83 = true; break r$83;
                                 }
                               if ($r83)
                                 switch ($t(match$985))
                                 {
                                 case 0:
                                   var match$1000 = match$985[1];
                                   switch ($t(match$1000))
                                   {
                                   case 1: $r78_0 = match$1000[0]; $r78 = true; break r$78;
                                   default: $r82 = true; break r$82;
                                   }
                                   break;
                                 default: $r82 = true; break r$82;
                                 }
                             }
                           }
                           if ($r82)
                             switch ($t(match$986))
                             {
                             case 0:
                               var match$1002 = match$986[1];
                               switch ($t(match$1002))
                               {
                               case 1: $r78_0 = match$1002[0]; $r78 = true; break r$78;
                               default: $r81 = true; break r$81;
                               }
                               break;
                             default: $r81 = true; break r$81;
                             }
                         }
                       }
                       if ($r81)
                         switch ($t(match$987))
                         {
                         case 0:
                           var match$1004 = match$987[1];
                           switch ($t(match$1004))
                           {
                           case 1: $r78_0 = match$1004[0]; $r78 = true; break r$78;
                           default: $r80 = true; break r$80;
                           }
                           break;
                         default: $r80 = true; break r$80;
                         }
                     }
                   }
                   if ($r80)
                     switch ($t(match$988))
                     {
                     case 0:
                       var match$1006 = match$988[1];
                       switch ($t(match$1006))
                       {
                       case 1: $r78_0 = match$1006[0]; $r78 = true; break r$78;
                       default: $r79 = true; break r$79;
                       }
                       break;
                     default: $r79 = true; break r$79;
                     }
                 }
               }
               if ($r79) {
                 {
                   var match$978 = _(make_changeable$127, [ eq$590, 0, 0 ]);
                   var ru$611 = match$978[1];
                   _(add_reader5$577,
                     [
                       0,
                       t1$594,
                       t2$595,
                       t3$596,
                       t4$597,
                       t5$598,
                       _f(function (param$967) {
                            var match$973 = _(read_result$170, [ t1$594 ]);
                            var match$974 = _(read_result$170, [ t2$595 ]);
                            var match$975 = _(read_result$170, [ t3$596 ]);
                            var match$976 = _(read_result$170, [ t4$597 ]);
                            var match$977 = _(read_result$170, [ t5$598 ]);
                            var $r72_0 = null;
                            var $r72 = false;
                            r$72:
                              switch ($t(match$973))
                              {
                              case 0:
                                switch ($t(match$974))
                                {
                                case 0:
                                  switch ($t(match$975))
                                  {
                                  case 0:
                                    switch ($t(match$976))
                                    {
                                    case 0:
                                      switch ($t(match$977))
                                      {
                                      case 0:
                                        try {
                                          return _(assign$592,
                                                   [
                                                     ru$611,
                                                     _(f$593,
                                                       [ match$973[0], match$974[0], match$975[0], match$976[0], match$977[0] ])
                                                   ]);
                                        }
                                        catch (e$622) {
                                          return __(write_exn$167, [ ru$611, e$622 ]);
                                        }
                                        break;
                                      default: $r72_0 = match$977[0]; $r72 = true; break r$72;
                                      }
                                      break;
                                    default: $r72_0 = match$976[0]; $r72 = true; break r$72;
                                    }
                                    break;
                                  default: $r72_0 = match$975[0]; $r72 = true; break r$72;
                                  }
                                  break;
                                default: $r72_0 = match$974[0]; $r72 = true; break r$72;
                                }
                                break;
                              case 1: $r72_0 = match$973[0]; $r72 = true; break r$72;
                              default: return null;
                              }
                            if ($r72) { { var e$612 = $r72_0; return __(write_exn$167, [ ru$611, e$612 ]); } }
                          })
                     ]);
                   return match$978[0];
                 }
               }
             }
           }
           if ($r78) { { var e$599 = $r78_0; return __(fail$142, [ e$599 ]); } }
         });
    var bind5$623 =
      _f(function (eq$624, t1$625, t2$626, t3$627, t4$628, t5$629, f$630) {
           return __(bind5_gen$589,
                     [
                       eq$624,
                       _f(function (prim$966) { return prim$966; }),
                       connect$289,
                       f$630,
                       t1$625,
                       t2$626,
                       t3$627,
                       t4$628,
                       t5$629
                     ]);
         });
    var lift5$631 = _f(function (eq$632, f$633) { return __(bind5_gen$589, [ eq$632, return$140, write$164, f$633 ]); });
    var blift5$634 =
      _f(function (eq$635, t1$636, t2$637, t3$638, t4$639, t5$640, f$641) {
           return __(lift5$631, [ eq$635, f$641, t1$636, t2$637, t3$638, t4$639, t5$640 ]);
         });
    var add_reader6$642 =
      _f(function (now$643, t1$644, t2$645, t3$646, t4$647, t5$648, t6$649, read$650) {
           var read$651 = _(read_now$268, [ now$643, read$650 ]);
           var start$652 = _(TS$75[1], [ 0 ]);
           _(read$651, [ 0 ]);
           var r$653 = $(read$651, start$652, _(TS$75[1], [ 0 ]));
           var dep$654 = _f(function (param$964) { return __(enqueue$266, [ r$653 ]); });
           _(add_dep$191, [ start$652, t1$644, dep$654 ]);
           _(add_dep$191, [ start$652, t2$645, dep$654 ]);
           _(add_dep$191, [ start$652, t3$646, dep$654 ]);
           _(add_dep$191, [ start$652, t4$647, dep$654 ]);
           _(add_dep$191, [ start$652, t5$648, dep$654 ]);
           return __(add_dep$191, [ start$652, t6$649, dep$654 ]);
         });
    var bind6_gen$655 =
      _f(function (eq$656, return$657, assign$658, f$659, t1$660, t2$661, t3$662, t4$663, t5$664, t6$665) {
           var match$936 = t1$660;
           var match$937 = t2$661;
           var match$938 = t3$662;
           var match$939 = t4$663;
           var match$940 = t5$664;
           var match$941 = t6$665;
           var $r54_0 = null;
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
                           r$58: {
                             {
                               var $r59 = false;
                               r$59: {
                                 {
                                   var $r60 = false;
                                   r$60:
                                     switch ($t(match$936))
                                     {
                                     case 0:
                                       var match$943 = match$936[1];
                                       switch ($t(match$943))
                                       {
                                       case 0:
                                         switch ($t(match$937))
                                         {
                                         case 0:
                                           var match$945 = match$937[1];
                                           switch ($t(match$945))
                                           {
                                           case 0:
                                             switch ($t(match$938))
                                             {
                                             case 0:
                                               var match$947 = match$938[1];
                                               switch ($t(match$947))
                                               {
                                               case 0:
                                                 switch ($t(match$939))
                                                 {
                                                 case 0:
                                                   var match$949 = match$939[1];
                                                   switch ($t(match$949))
                                                   {
                                                   case 0:
                                                     switch ($t(match$940))
                                                     {
                                                     case 0:
                                                       var match$951 = match$940[1];
                                                       switch ($t(match$951))
                                                       {
                                                       case 0:
                                                         switch ($t(match$941))
                                                         {
                                                         case 0:
                                                           var match$953 = match$941[1];
                                                           switch ($t(match$953))
                                                           {
                                                           case 0:
                                                             try {
                                                               return _
                                                                    (return$657,
                                                                    [
                                                                    _
                                                                    (f$659,
                                                                    [
                                                                    match$943[0],
                                                                    match$945[0],
                                                                    match$947[0],
                                                                    match$949[0],
                                                                    match$951[0],
                                                                    match$953[0]
                                                                    ])
                                                                    ]);
                                                             }
                                                             catch (e$678) {
                                                               return __(fail$142, [ e$678 ]);
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
                                               default: $r59 = true; break r$59;
                                               }
                                               break;
                                             default: $r58 = true; break r$58;
                                             }
                                             break;
                                           default: $r60 = true; break r$60;
                                           }
                                           break;
                                         default: $r59 = true; break r$59;
                                         }
                                         break;
                                       case 1: $r54_0 = match$943[0]; $r54 = true; break r$54;
                                       default: return null;
                                       }
                                       break;
                                     default: $r60 = true; break r$60;
                                     }
                                   if ($r60)
                                     switch ($t(match$937))
                                     {
                                     case 0:
                                       var match$955 = match$937[1];
                                       switch ($t(match$955))
                                       {
                                       case 1: $r54_0 = match$955[0]; $r54 = true; break r$54;
                                       default: $r59 = true; break r$59;
                                       }
                                       break;
                                     default: $r59 = true; break r$59;
                                     }
                                 }
                               }
                               if ($r59)
                                 switch ($t(match$938))
                                 {
                                 case 0:
                                   var match$957 = match$938[1];
                                   switch ($t(match$957))
                                   {
                                   case 1: $r54_0 = match$957[0]; $r54 = true; break r$54;
                                   default: $r58 = true; break r$58;
                                   }
                                   break;
                                 default: $r58 = true; break r$58;
                                 }
                             }
                           }
                           if ($r58)
                             switch ($t(match$939))
                             {
                             case 0:
                               var match$959 = match$939[1];
                               switch ($t(match$959))
                               {
                               case 1: $r54_0 = match$959[0]; $r54 = true; break r$54;
                               default: $r57 = true; break r$57;
                               }
                               break;
                             default: $r57 = true; break r$57;
                             }
                         }
                       }
                       if ($r57)
                         switch ($t(match$940))
                         {
                         case 0:
                           var match$961 = match$940[1];
                           switch ($t(match$961))
                           {
                           case 1: $r54_0 = match$961[0]; $r54 = true; break r$54;
                           default: $r56 = true; break r$56;
                           }
                           break;
                         default: $r56 = true; break r$56;
                         }
                     }
                   }
                   if ($r56)
                     switch ($t(match$941))
                     {
                     case 0:
                       var match$963 = match$941[1];
                       switch ($t(match$963))
                       {
                       case 1: $r54_0 = match$963[0]; $r54 = true; break r$54;
                       default: $r55 = true; break r$55;
                       }
                       break;
                     default: $r55 = true; break r$55;
                     }
                 }
               }
               if ($r55) {
                 {
                   var match$929 = _(make_changeable$127, [ eq$656, 0, 0 ]);
                   var ru$680 = match$929[1];
                   _(add_reader6$642,
                     [
                       0,
                       t1$660,
                       t2$661,
                       t3$662,
                       t4$663,
                       t5$664,
                       t6$665,
                       _f(function (param$916) {
                            var match$923 = _(read_result$170, [ t1$660 ]);
                            var match$924 = _(read_result$170, [ t2$661 ]);
                            var match$925 = _(read_result$170, [ t3$662 ]);
                            var match$926 = _(read_result$170, [ t4$663 ]);
                            var match$927 = _(read_result$170, [ t5$664 ]);
                            var match$928 = _(read_result$170, [ t6$665 ]);
                            var $r47_0 = null;
                            var $r47 = false;
                            r$47:
                              switch ($t(match$923))
                              {
                              case 0:
                                switch ($t(match$924))
                                {
                                case 0:
                                  switch ($t(match$925))
                                  {
                                  case 0:
                                    switch ($t(match$926))
                                    {
                                    case 0:
                                      switch ($t(match$927))
                                      {
                                      case 0:
                                        switch ($t(match$928))
                                        {
                                        case 0:
                                          try {
                                            return _(assign$658,
                                                     [
                                                       ru$680,
                                                       _(f$659,
                                                         [
                                                           match$923[0],
                                                           match$924[0],
                                                           match$925[0],
                                                           match$926[0],
                                                           match$927[0],
                                                           match$928[0]
                                                         ])
                                                     ]);
                                          }
                                          catch (e$693) {
                                            return __(write_exn$167, [ ru$680, e$693 ]);
                                          }
                                          break;
                                        default: $r47_0 = match$928[0]; $r47 = true; break r$47;
                                        }
                                        break;
                                      default: $r47_0 = match$927[0]; $r47 = true; break r$47;
                                      }
                                      break;
                                    default: $r47_0 = match$926[0]; $r47 = true; break r$47;
                                    }
                                    break;
                                  default: $r47_0 = match$925[0]; $r47 = true; break r$47;
                                  }
                                  break;
                                default: $r47_0 = match$924[0]; $r47 = true; break r$47;
                                }
                                break;
                              case 1: $r47_0 = match$923[0]; $r47 = true; break r$47;
                              default: return null;
                              }
                            if ($r47) { { var e$681 = $r47_0; return __(write_exn$167, [ ru$680, e$681 ]); } }
                          })
                     ]);
                   return match$929[0];
                 }
               }
             }
           }
           if ($r54) { { var e$666 = $r54_0; return __(fail$142, [ e$666 ]); } }
         });
    var bind6$694 =
      _f(function (eq$695, t1$696, t2$697, t3$698, t4$699, t5$700, t6$701, f$702) {
           return __(bind6_gen$655,
                     [
                       eq$695,
                       _f(function (prim$915) { return prim$915; }),
                       connect$289,
                       f$702,
                       t1$696,
                       t2$697,
                       t3$698,
                       t4$699,
                       t5$700,
                       t6$701
                     ]);
         });
    var lift6$703 = _f(function (eq$704, f$705) { return __(bind6_gen$655, [ eq$704, return$140, write$164, f$705 ]); });
    var blift6$706 =
      _f(function (eq$707, t1$708, t2$709, t3$710, t4$711, t5$712, t6$713, f$714) {
           return __(lift6$703, [ eq$707, f$714, t1$708, t2$709, t3$710, t4$711, t5$712, t6$713 ]);
         });
    var add_reader7$715 =
      _f(function (now$716, t1$717, t2$718, t3$719, t4$720, t5$721, t6$722, t7$723, read$724) {
           var read$725 = _(read_now$268, [ now$716, read$724 ]);
           var start$726 = _(TS$75[1], [ 0 ]);
           _(read$725, [ 0 ]);
           var r$727 = $(read$725, start$726, _(TS$75[1], [ 0 ]));
           var dep$728 = _f(function (param$913) { return __(enqueue$266, [ r$727 ]); });
           _(add_dep$191, [ start$726, t1$717, dep$728 ]);
           _(add_dep$191, [ start$726, t2$718, dep$728 ]);
           _(add_dep$191, [ start$726, t3$719, dep$728 ]);
           _(add_dep$191, [ start$726, t4$720, dep$728 ]);
           _(add_dep$191, [ start$726, t5$721, dep$728 ]);
           _(add_dep$191, [ start$726, t6$722, dep$728 ]);
           return __(add_dep$191, [ start$726, t7$723, dep$728 ]);
         });
    var bind7_gen$729 =
      _f(function (eq$730, return$731, assign$732, f$733, t1$734, t2$735, t3$736, t4$737, t5$738, t6$739, t7$740) {
           var match$880 = t1$734;
           var match$881 = t2$735;
           var match$882 = t3$736;
           var match$883 = t4$737;
           var match$884 = t5$738;
           var match$885 = t6$739;
           var match$886 = t7$740;
           var $r28_0 = null;
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
                                   r$34: {
                                     {
                                       var $r35 = false;
                                       r$35:
                                         switch ($t(match$880))
                                         {
                                         case 0:
                                           var match$888 = match$880[1];
                                           switch ($t(match$888))
                                           {
                                           case 0:
                                             switch ($t(match$881))
                                             {
                                             case 0:
                                               var match$890 = match$881[1];
                                               switch ($t(match$890))
                                               {
                                               case 0:
                                                 switch ($t(match$882))
                                                 {
                                                 case 0:
                                                   var match$892 = match$882[1];
                                                   switch ($t(match$892))
                                                   {
                                                   case 0:
                                                     switch ($t(match$883))
                                                     {
                                                     case 0:
                                                       var match$894 = match$883[1];
                                                       switch ($t(match$894))
                                                       {
                                                       case 0:
                                                         switch ($t(match$884))
                                                         {
                                                         case 0:
                                                           var match$896 = match$884[1];
                                                           switch ($t(match$896))
                                                           {
                                                           case 0:
                                                             switch (
                                                             $t(match$885))
                                                             {
                                                             case 0:
                                                               var match$898 = match$885[1];
                                                               switch (
                                                               $t(match$898))
                                                               {
                                                               case 0:
                                                                 switch (
                                                                 $t(match$886))
                                                                 {
                                                                 case 0:
                                                                   var match$900 = match$886[1];
                                                                   switch (
                                                                   $t(match$900))
                                                                   {
                                                                   case 0:
                                                                    try {
                                                                    return _
                                                                    (return$731,
                                                                    [
                                                                    _
                                                                    (f$733,
                                                                    [
                                                                    match$888[0],
                                                                    match$890[0],
                                                                    match$892[0],
                                                                    match$894[0],
                                                                    match$896[0],
                                                                    match$898[0],
                                                                    match$900[0]
                                                                    ])
                                                                    ]);
                                                                    }
                                                                    catch (e$755) {
                                                                    return __(fail$142, [ e$755 ]);
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
                                               default: $r35 = true; break r$35;
                                               }
                                               break;
                                             default: $r34 = true; break r$34;
                                             }
                                             break;
                                           case 1: $r28_0 = match$888[0]; $r28 = true; break r$28;
                                           default: return null;
                                           }
                                           break;
                                         default: $r35 = true; break r$35;
                                         }
                                       if ($r35)
                                         switch ($t(match$881))
                                         {
                                         case 0:
                                           var match$902 = match$881[1];
                                           switch ($t(match$902))
                                           {
                                           case 1: $r28_0 = match$902[0]; $r28 = true; break r$28;
                                           default: $r34 = true; break r$34;
                                           }
                                           break;
                                         default: $r34 = true; break r$34;
                                         }
                                     }
                                   }
                                   if ($r34)
                                     switch ($t(match$882))
                                     {
                                     case 0:
                                       var match$904 = match$882[1];
                                       switch ($t(match$904))
                                       {
                                       case 1: $r28_0 = match$904[0]; $r28 = true; break r$28;
                                       default: $r33 = true; break r$33;
                                       }
                                       break;
                                     default: $r33 = true; break r$33;
                                     }
                                 }
                               }
                               if ($r33)
                                 switch ($t(match$883))
                                 {
                                 case 0:
                                   var match$906 = match$883[1];
                                   switch ($t(match$906))
                                   {
                                   case 1: $r28_0 = match$906[0]; $r28 = true; break r$28;
                                   default: $r32 = true; break r$32;
                                   }
                                   break;
                                 default: $r32 = true; break r$32;
                                 }
                             }
                           }
                           if ($r32)
                             switch ($t(match$884))
                             {
                             case 0:
                               var match$908 = match$884[1];
                               switch ($t(match$908))
                               {
                               case 1: $r28_0 = match$908[0]; $r28 = true; break r$28;
                               default: $r31 = true; break r$31;
                               }
                               break;
                             default: $r31 = true; break r$31;
                             }
                         }
                       }
                       if ($r31)
                         switch ($t(match$885))
                         {
                         case 0:
                           var match$910 = match$885[1];
                           switch ($t(match$910))
                           {
                           case 1: $r28_0 = match$910[0]; $r28 = true; break r$28;
                           default: $r30 = true; break r$30;
                           }
                           break;
                         default: $r30 = true; break r$30;
                         }
                     }
                   }
                   if ($r30)
                     switch ($t(match$886))
                     {
                     case 0:
                       var match$912 = match$886[1];
                       switch ($t(match$912))
                       {
                       case 1: $r28_0 = match$912[0]; $r28 = true; break r$28;
                       default: $r29 = true; break r$29;
                       }
                       break;
                     default: $r29 = true; break r$29;
                     }
                 }
               }
               if ($r29) {
                 {
                   var match$872 = _(make_changeable$127, [ eq$730, 0, 0 ]);
                   var ru$757 = match$872[1];
                   _(add_reader7$715,
                     [
                       0,
                       t1$734,
                       t2$735,
                       t3$736,
                       t4$737,
                       t5$738,
                       t6$739,
                       t7$740,
                       _f(function (param$857) {
                            var match$865 = _(read_result$170, [ t1$734 ]);
                            var match$866 = _(read_result$170, [ t2$735 ]);
                            var match$867 = _(read_result$170, [ t3$736 ]);
                            var match$868 = _(read_result$170, [ t4$737 ]);
                            var match$869 = _(read_result$170, [ t5$738 ]);
                            var match$870 = _(read_result$170, [ t6$739 ]);
                            var match$871 = _(read_result$170, [ t7$740 ]);
                            var $r20_0 = null;
                            var $r20 = false;
                            r$20:
                              switch ($t(match$865))
                              {
                              case 0:
                                switch ($t(match$866))
                                {
                                case 0:
                                  switch ($t(match$867))
                                  {
                                  case 0:
                                    switch ($t(match$868))
                                    {
                                    case 0:
                                      switch ($t(match$869))
                                      {
                                      case 0:
                                        switch ($t(match$870))
                                        {
                                        case 0:
                                          switch ($t(match$871))
                                          {
                                          case 0:
                                            try {
                                              return _(assign$732,
                                                       [
                                                         ru$757,
                                                         _(f$733,
                                                           [
                                                             match$865[0],
                                                             match$866[0],
                                                             match$867[0],
                                                             match$868[0],
                                                             match$869[0],
                                                             match$870[0],
                                                             match$871[0]
                                                           ])
                                                       ]);
                                            }
                                            catch (e$772) {
                                              return __(write_exn$167, [ ru$757, e$772 ]);
                                            }
                                            break;
                                          default: $r20_0 = match$871[0]; $r20 = true; break r$20;
                                          }
                                          break;
                                        default: $r20_0 = match$870[0]; $r20 = true; break r$20;
                                        }
                                        break;
                                      default: $r20_0 = match$869[0]; $r20 = true; break r$20;
                                      }
                                      break;
                                    default: $r20_0 = match$868[0]; $r20 = true; break r$20;
                                    }
                                    break;
                                  default: $r20_0 = match$867[0]; $r20 = true; break r$20;
                                  }
                                  break;
                                default: $r20_0 = match$866[0]; $r20 = true; break r$20;
                                }
                                break;
                              case 1: $r20_0 = match$865[0]; $r20 = true; break r$20;
                              default: return null;
                              }
                            if ($r20) { { var e$758 = $r20_0; return __(write_exn$167, [ ru$757, e$758 ]); } }
                          })
                     ]);
                   return match$872[0];
                 }
               }
             }
           }
           if ($r28) { { var e$741 = $r28_0; return __(fail$142, [ e$741 ]); } }
         });
    var bind7$773 =
      _f(function (eq$774, t1$775, t2$776, t3$777, t4$778, t5$779, t6$780, t7$781, f$782) {
           return __(bind7_gen$729,
                     [
                       eq$774,
                       _f(function (prim$856) { return prim$856; }),
                       connect$289,
                       f$782,
                       t1$775,
                       t2$776,
                       t3$777,
                       t4$778,
                       t5$779,
                       t6$780,
                       t7$781
                     ]);
         });
    var lift7$783 = _f(function (eq$784, f$785) { return __(bind7_gen$729, [ eq$784, return$140, write$164, f$785 ]); });
    var blift7$786 =
      _f(function (eq$787, t1$788, t2$789, t3$790, t4$791, t5$792, t6$793, t7$794, f$795) {
           return __(lift7$783, [ eq$787, f$795, t1$788, t2$789, t3$790, t4$791, t5$792, t6$793, t7$794 ]);
         });
    var add_readerN$796 =
      _f(function (now$797, ts$798, read$799) {
           var read$800 = _(read_now$268, [ now$797, read$799 ]);
           var start$801 = _(TS$75[1], [ 0 ]);
           _(read$800, [ 0 ]);
           var r$802 = $(read$800, start$801, _(TS$75[1], [ 0 ]));
           var dep$803 = _f(function (param$854) { return __(enqueue$266, [ r$802 ]); });
           return __(oc$List$[9], [ _f(function (t$804) { return __(add_dep$191, [ start$801, t$804, dep$803 ]); }), ts$798 ]);
         });
    var bindN_gen$805 =
      _f(function (eq$806, return$807, assign$808, f$809, ts$810) {
           var loop$811 =
             _f(function (vs$812, param$848) {
                  if (param$848) {
                    {
                      var match$851 = param$848[0];
                      switch ($t(match$851))
                      {
                      case 0:
                        var match$853 = match$851[1];
                        switch ($t(match$853))
                        {
                        case 0: return __(loop$811, [ $(match$853[0], vs$812), param$848[1] ]);
                        case 1: return __(fail$142, [ match$853[0] ]);
                        default: return null;
                        }
                        break;
                      default:
                        var match$850 = _(make_changeable$127, [ eq$806, 0, 0 ]);
                        var ru$819 = match$850[1];
                        _(add_readerN$796,
                          [
                            0,
                            ts$810,
                            _f(function (param$849) {
                                 try {
                                   var vs$820 = _(oc$List$[10], [ read$174, ts$810 ]);
                                   return _(assign$808, [ ru$819, _(f$809, [ vs$820 ]) ]);
                                 }
                                 catch (e$821) {
                                   return __(write_exn$167, [ ru$819, e$821 ]);
                                 }
                               })
                          ]);
                        return match$850[0];
                      }
                    }
                  }
                  try {
                    return _(return$807, [ _(f$809, [ _(oc$List$[4], [ vs$812 ]) ]) ]);
                  }
                  catch (e$815) {
                    return __(fail$142, [ e$815 ]);
                  }
                });
           return __(loop$811, [ 0, ts$810 ]);
         });
    var bindN$822 =
      _f(function (eq$823, ts$824, f$825) {
           return __(bindN_gen$805, [ eq$823, _f(function (prim$847) { return prim$847; }), connect$289, f$825, ts$824 ]);
         });
    var liftN$826 = _f(function (eq$827, f$828) { return __(bindN_gen$805, [ eq$827, return$140, write$164, f$828 ]); });
    var bliftN$829 = _f(function (eq$830, ts$831, f$832) { return __(liftN$826, [ eq$830, f$832, ts$831 ]); });
    return $(Unset$122, make_cancel$179, no_cancel$181, cancel$182, changeable$137, return$140, fail$142, is_constant$144,
             bind$328, $3E$3E$3D$332, lift$335, blift$338, add_reader$282, add_reader_cancel$274, catch$385, try_bind$360,
             catch_lift$389, try_bind_lift$365, read$174, read_result$170, write$164, write_exn$167, write_result$149, clear$146,
             notify$306, notify_cancel$301, notify_result$297, notify_result_cancel$292, connect$289, connect_cancel$286,
             cleanup$311, make_changeable$127, make_constant$135, hash$118, init$265, propagate$398, set_exn_handler$80,
             set_debug$77, memo$410, bind2$458, lift2$463, blift2$466, add_reader2$430, bind3$505, lift3$511, blift3$514,
             add_reader3$471, bind4$560, lift4$567, blift4$570, add_reader4$520, bind5$623, lift5$631, blift5$634, add_reader5$577,
             bind6$694, lift6$703, blift6$706, add_reader6$642, bind7$773, lift7$783, blift7$786, add_reader7$715, bindN$822,
             liftN$826, bliftN$829, add_readerN$796);
  }();
var oc$Froc$ =
  function () {
    var include$314 = oc$Froc_ddg$;
    var Unset$60 = include$314[0];
    var no_cancel$63 = include$314[2];
    var cancel$64 = include$314[3];
    var is_constant$69 = include$314[7];
    var bind$70 = include$314[8];
    var read_result$81 = include$314[19];
    var write_result$84 = include$314[22];
    var notify$86 = include$314[24];
    var notify_cancel$87 = include$314[25];
    var notify_result$88 = include$314[26];
    var notify_result_cancel$89 = include$314[27];
    var connect$90 = include$314[28];
    var make_changeable$93 = include$314[31];
    var make_constant$94 = include$314[32];
    var hash$95 = include$314[33];
    var debug$131 = $(_f(function (prim$355) { return 0; }));
    var set_debug$132 = _f(function (f$133) { debug$131[0] = f$133; return __(include$314[37], [ f$133 ]); });
    var q$136 = _(oc$Queue$[1], [ 0 ]);
    var temps$137 = $(0);
    var running$138 = $(0);
    var init$139 =
      _f(function (param$354) {
           _(include$314[34], [ 0 ]);
           _(oc$Queue$[8], [ q$136 ]);
           temps$137[0] = 0;
           return running$138[0] = 0;
         });
    var run_queue$140 =
      _f(function (param$353) {
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
           temps$137[0] = $(_f(function (param$352) { return __(include$314[23], [ u$146 ]); }), temps$137[0]);
           return __(write_result$84, [ u$146, r$147 ]);
         });
    var send_result$148 =
      _f(function (s$149, r$150) {
           var match$351 = temps$137[0];
           if (match$351) return __(oc$Pervasives$[1], [ "already in update loop" ]);
           return __(with_run_queue$142,
                     [
                       _f(function (param$350) {
                            _(write_temp_result$145, [ s$149, r$150 ]);
                            _(include$314[35], [ 0 ]);
                            _(oc$List$[9], [ _f(function (f$151) { return __(f$151, [ 0 ]); }), temps$137[0] ]);
                            return temps$137[0] = 0;
                          })
                     ]);
         });
    var send$152 = _f(function (s$153, v$154) { return __(send_result$148, [ s$153, $(v$154) ]); });
    var send_exn$155 = _f(function (s$156, e$157) { return __(send_result$148, [ s$156, $1(e$157) ]); });
    var send_result_deferred$158 =
      _f(function (u$159, r$160) {
           _(oc$Queue$[2], [ _f(function (param$349) { return __(send_result$148, [ u$159, r$160 ]); }), q$136 ]);
           return __(run_queue$140, [ 0 ]);
         });
    var send_deferred$161 = _f(function (u$162, v$163) { return __(send_result_deferred$158, [ u$162, $(v$163) ]); });
    var send_exn_deferred$164 = _f(function (u$165, e$166) { return __(send_result_deferred$158, [ u$165, $1(e$166) ]); });
    var never_eq$167 = _f(function (param$347, param$348) { return 0; });
    var make_event$168 = _f(function (param$346) { return __(make_changeable$93, [ $(never_eq$167), 0, 0 ]); });
    var never$169 = _(make_constant$94, [ $1($(Unset$60)) ]);
    var notify_result_e_cancel$171 = _f(function (t$172, f$173) { return __(notify_result_cancel$89, [ $(0), t$172, f$173 ]); });
    var notify_result_e$174 = _f(function (t$175, f$176) { return __(notify_result$88, [ $(0), t$175, f$176 ]); });
    var notify_e_cancel$177 = _f(function (t$178, f$179) { return __(notify_cancel$87, [ $(0), t$178, f$179 ]); });
    var notify_e$180 = _f(function (t$181, f$182) { return __(notify$86, [ $(0), t$181, f$182 ]); });
    var next$184 =
      _f(function (t$185) {
           if (_(is_constant$69, [ t$185 ])) return never$169;
           var match$345 = _(make_event$168, [ 0 ]);
           var c$188 = $(no_cancel$63);
           c$188[0] =
             _(notify_result_e_cancel$171,
               [
                 t$185,
                 _f(function (r$189) {
                      _(cancel$64, [ c$188[0] ]);
                      c$188[0] = no_cancel$63;
                      return __(write_temp_result$145, [ match$345[1], r$189 ]);
                    })
               ]);
           return match$345[0];
         });
    var merge$190 =
      _f(function (ts$191) {
           if (_(oc$List$[19], [ is_constant$69, ts$191 ])) return never$169;
           var match$344 = _(make_event$168, [ 0 ]);
           _(include$314[66],
             [
               $(0),
               ts$191,
               _f(function (param$341) {
                    var loop$194 =
                      _f(function (param$342) {
                           if (param$342) {
                             {
                               var r$197 = _(read_result$81, [ param$342[0] ]);
                               switch ($t(r$197))
                               {
                               case 1: if (r$197[0][0] === Unset$60) return __(loop$194, [ param$342[1] ]); return r$197;
                               default: return r$197;
                               }
                             }
                           }
                           throw $(Assert_failure$26g, $("froc.ml", 121, 16));
                         });
                    return __(write_temp_result$145, [ match$344[1], _(loop$194, [ ts$191 ]) ]);
                  })
             ]);
           return match$344[0];
         });
    var map$198 =
      _f(function (f$199, t$200) {
           if (_(is_constant$69, [ t$200 ])) return never$169;
           var match$340 = _(make_event$168, [ 0 ]);
           _(notify_result_e$174,
             [
               t$200,
               _f(function (r$203) {
                    var r$204 =
                      function () {
                        switch ($t(r$203))
                        {
                        case 0: try { return $(_(f$199, [ r$203[0] ])); } catch (e$207) { return $1(e$207); } break;
                        case 1: return $1(r$203[0]);
                        default: return null;
                        }
                      }();
                    return __(write_temp_result$145, [ match$340[1], r$204 ]);
                  })
             ]);
           return match$340[0];
         });
    var map2$208 =
      _f(function (f$209, t1$210, t2$211) {
           if (_(is_constant$69, [ t1$210 ]) && _(is_constant$69, [ t2$211 ])) return never$169;
           var match$339 = _(make_event$168, [ 0 ]);
           _(include$314[42],
             [
               $(0),
               t1$210,
               t2$211,
               _f(function (param$332) {
                    var r$214 =
                      function () {
                        var match$335 = _(read_result$81, [ t1$210 ]);
                        var match$336 = _(read_result$81, [ t2$211 ]);
                        var $r44_0 = null;
                        var $r44 = false;
                        r$44: {
                          {
                            var $r43 = false;
                            r$43: {
                              {
                                var $r46 = false;
                                r$46: {
                                  {
                                    var $r47 = false;
                                    r$47:
                                      switch ($t(match$335))
                                      {
                                      case 0:
                                        switch ($t(match$336))
                                        {
                                        case 0:
                                          try {
                                            return $($(_(f$209, [ match$335[0], match$336[0] ])));
                                          }
                                          catch (e$219) {
                                            return $($1(e$219));
                                          }
                                          break;
                                        default: $r47 = true; break r$47;
                                        }
                                        break;
                                      case 1:
                                        if (!(match$335[0][0] === Unset$60)) { { $r47 = true; break r$47; } }
                                        $r43 = true;
                                        break r$43;
                                      default: return null;
                                      }
                                    if ($r47)
                                      switch ($t(match$336))
                                      {
                                      case 1:
                                        if (!(match$336[0][0] === Unset$60)) { { $r46 = true; break r$46; } }
                                        $r43 = true;
                                        break r$43;
                                      default: $r46 = true; break r$46;
                                      }
                                  }
                                }
                                if ($r46)
                                  switch ($t(match$335))
                                  {
                                  case 1: $r44_0 = match$335[0]; $r44 = true; break r$44;
                                  default: $r44_0 = match$336[0]; $r44 = true; break r$44;
                                  }
                              }
                            }
                            if ($r43) return 0;
                          }
                        }
                        if ($r44) { { var e$215 = $r44_0; return $($1(e$215)); } }
                      }();
                    if (r$214) return __(write_temp_result$145, [ match$339[1], r$214[0] ]);
                    return 0;
                  })
             ]);
           return match$339[0];
         });
    var filter$221 =
      _f(function (p$222, t$223) {
           if (_(is_constant$69, [ t$223 ])) return never$169;
           var match$331 = _(make_event$168, [ 0 ]);
           _(notify_result_e$174,
             [
               t$223,
               _f(function (r$226) {
                    var r$227 =
                      function () {
                        switch ($t(r$226))
                        {
                        case 0:
                          var v$228 = r$226[0];
                          try { if (_(p$222, [ v$228 ])) return $($(v$228)); return 0; } catch (e$229) { return $($1(e$229)); }
                          break;
                        case 1: return $(r$226);
                        default: return null;
                        }
                      }();
                    if (r$227) return __(write_temp_result$145, [ match$331[1], r$227[0] ]);
                    return 0;
                  })
             ]);
           return match$331[0];
         });
    var collect$231 =
      _f(function (f$232, init$233, t$234) {
           if (_(is_constant$69, [ t$234 ])) return never$169;
           var match$329 = _(make_event$168, [ 0 ]);
           var st$237 = $($(init$233));
           _(notify_result_e$174,
             [
               t$234,
               _f(function (r$238) {
                    var r$239 =
                      function () {
                        var match$326 = st$237[0];
                        switch ($t(match$326))
                        {
                        case 0:
                          switch ($t(r$238))
                          {
                          case 0:
                            try { return $($(_(f$232, [ match$326[0], r$238[0] ]))); } catch (e$243) { return $($1(e$243)); }
                            break;
                          default: return $($1(r$238[0]));
                          }
                          break;
                        case 1: return 0;
                        default: return null;
                        }
                      }();
                    if (r$239) {
                      { var r$244 = r$239[0]; st$237[0] = r$244; return __(write_temp_result$145, [ match$329[1], r$244 ]); }
                    }
                    return 0;
                  })
             ]);
           return match$329[0];
         });
    var join_e$245 =
      _f(function (ee$246) {
           if (_(is_constant$69, [ ee$246 ])) return never$169;
           var match$325 = _(make_event$168, [ 0 ]);
           var ru$248 = match$325[1];
           _(notify_result_e$174,
             [
               ee$246,
               _f(function (param$324) {
                    switch ($t(param$324))
                    {
                    case 0: return __(notify_result_e$174, [ param$324[0], _(write_temp_result$145, [ ru$248 ]) ]);
                    case 1: return __(write_temp_result$145, [ ru$248, $1(param$324[0]) ]);
                    default: return null;
                    }
                  })
             ]);
           return match$325[0];
         });
    var fix_e$251 =
      _f(function (ef$252) {
           var match$323 = _(make_event$168, [ 0 ]);
           var e$255 = _(ef$252, [ match$323[0] ]);
           _(notify_result_e$174, [ e$255, _(send_result_deferred$158, [ match$323[1] ]) ]);
           return e$255;
         });
    var join_b$264 =
      _f(function (eq$265, bb$266) { return __(bind$70, [ eq$265, bb$266, _f(function (b$267) { return b$267; }) ]); });
    var fix_b$268 =
      _f(function (eq$269, bf$270) {
           var match$322 = _(make_changeable$93, [ eq$269, 0, 0 ]);
           var b$273 = _(bf$270, [ match$322[0] ]);
           _(notify_result$88,
             [
               0,
               b$273,
               _f(function (r$274) {
                    _(oc$Queue$[2], [ _f(function (param$321) { return __(write_result$84, [ match$322[1], r$274 ]); }), q$136 ]);
                    return __(run_queue$140, [ 0 ]);
                  })
             ]);
           return b$273;
         });
    var switch$275 =
      _f(function (eq$276, b$277, e$278) {
           if (_(is_constant$69, [ e$278 ])) return b$277;
           var match$320 = _(make_changeable$93, [ eq$276, 0, 0 ]);
           var bu$280 = match$320[1];
           _(notify_result$88,
             [
               0,
               e$278,
               _f(function (param$319) {
                    switch ($t(param$319))
                    {
                    case 0: return __(connect$90, [ bu$280, param$319[0] ]);
                    case 1:
                      var e$282 = param$319[0];
                      if (e$282[0] === Unset$60) return __(connect$90, [ bu$280, b$277 ]);
                      return __(include$314[21], [ bu$280, e$282 ]);
                    default: return null;
                    }
                  })
             ]);
           return match$320[0];
         });
    var until$283 = _f(function (eq$284, b$285, e$286) { return __(switch$275, [ eq$284, b$285, _(next$184, [ e$286 ]) ]); });
    var hold_result$287 =
      _f(function (eq$288, init$289, e$290) {
           if (_(is_constant$69, [ e$290 ])) return __(make_constant$94, [ init$289 ]);
           var match$318 = _(make_changeable$93, [ eq$288, $(init$289), 0 ]);
           _(notify_result_e$174, [ e$290, _(write_result$84, [ match$318[1] ]) ]);
           return match$318[0];
         });
    var hold$293 = _f(function (eq$294, init$295, e$296) { return __(hold_result$287, [ eq$294, $(init$295), e$296 ]); });
    var changes$297 =
      _f(function (b$298) {
           if (_(is_constant$69, [ b$298 ])) return never$169;
           var match$317 = _(make_event$168, [ 0 ]);
           _(notify_result$88, [ $(0), b$298, _(write_temp_result$145, [ match$317[1] ]) ]);
           return match$317[0];
         });
    var when_true$301 =
      _f(function (b$302) {
           return __(map$198,
                     [
                       _f(function (b$303) { return 0; }),
                       _(filter$221, [ _f(function (b$304) { return b$304; }), _(changes$297, [ b$302 ]) ])
                     ]);
         });
    var count$305 =
      _f(function (t$306) {
           return __(hold$293, [ 0, 0, _(collect$231, [ _f(function (n$307, param$316) { return n$307 + 1; }), 0, t$306 ]) ]);
         });
    var make_cell$308 =
      _f(function (v$309) {
           var match$315 = _(make_event$168, [ 0 ]);
           return $(_(hold$293, [ 0, v$309, match$315[0] ]), _(send_deferred$161, [ match$315[1] ]));
         });
    return $(include$314[5], include$314[6], bind$70, include$314[9], 
             include$314[11], include$314[10], include$314[18], read_result$81, 
             include$314[14], include$314[16], include$314[15], include$314[17], join_b$264, fix_b$268, notify$86,
             notify_cancel$87, notify_result$88, notify_result_cancel$89, hash$95, make_event$168, never$169, notify_e$180,
             notify_e_cancel$177, notify_result_e$174, notify_result_e_cancel$171, send$152, send_exn$155, send_result$148,
             send_deferred$161, send_exn_deferred$164, send_result_deferred$158, next$184, merge$190, map$198, map2$208,
             filter$221, collect$231, join_e$245, fix_e$251, hash$95, switch$275, until$283, hold$293, hold_result$287,
             changes$297, when_true$301, count$305, make_cell$308, init$139, no_cancel$63, cancel$64, 
             include$314[30], include$314[38], include$314[36], set_debug$132, 
             include$314[39], include$314[41], include$314[40], include$314[43], 
             include$314[45], include$314[44], include$314[47], include$314[49], 
             include$314[48], include$314[51], include$314[53], include$314[52], 
             include$314[55], include$314[57], include$314[56], include$314[59], 
             include$314[61], include$314[60], include$314[63], include$314[65], 
             include$314[64]);
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
           _(oc$Froc$[51], [ clear$68 ]);
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
           _(oc$Froc$[51],
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
                           _($7C$3E$58, [ t$108, oc$Froc$[44] ]),
                           _f(function (e$110) { return __(delay_eb$93, [ e$110, msb$109 ]); })
                         ]),
                       _(oc$Froc$[43], [ 0, _(oc$Froc$[7], [ t$108 ]) ])
                     ]);
         });
    var delay_b$111 = _f(function (t$112, ms$113) { return __(delay_bb$107, [ t$112, _(oc$Froc$[0], [ ms$113 ]) ]); });
    var mouse_e$114 =
      _f(function (param$185) {
           var match$187 = _(oc$Froc$[19], [ 0 ]);
           var f$117 = _f(function (me$118) { return __(oc$Froc$[25], [ match$187[1], $(me$118.clientX, me$118.clientY) ]); });
           (function () { var v$205 = oc$Dom$[1]; return _m(v$205.addEventListener, v$205, [ "mousemove", f$117, 0 ]); }());
           _(oc$Froc$[51],
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
    var mouse_b$119 = _f(function (param$184) { return __(oc$Froc$[42], [ 0, $(0, 0), _(mouse_e$114, [ 0 ]) ]); });
    var attach_innerHTML$120 =
      _f(function (elem$121, b$122) {
           var e$123 = _(oc$Froc$[44], [ b$122 ]);
           return __(oc$Froc$[21], [ e$123, _f(function (s$124) { return elem$121.innerHTML = s$124; }) ]);
         });
    var input_value_e$125 =
      _f(function (input$126) {
           var match$183 = _(oc$Froc$[19], [ 0 ]);
           var f$129 = _f(function (param$182) { return __(oc$Froc$[25], [ match$183[1], input$126.value ]); });
           _m(input$126.addEventListener, input$126, [ "change", f$129, 0 ]);
           _(oc$Froc$[51],
             [ _f(function (param$181) { return __m(input$126.addEventListener, input$126, [ "change", f$129, 0 ]); }) ]);
           return match$183[0];
         });
    var input_value_b$130 =
      _f(function (input$131) { return __(oc$Froc$[42], [ 0, input$131.value, _(input_value_e$125, [ input$131 ]) ]); });
    var attach_input_value_e$132 =
      _f(function (i$133, e$134) { return __(oc$Froc$[21], [ e$134, _f(function (v$135) { return i$133.value = v$135; }) ]); });
    var attach_input_value_b$136 =
      _f(function (i$137, b$138) { return __(attach_input_value_e$132, [ i$137, _(oc$Froc$[44], [ b$138 ]) ]); });
    var attach_backgroundColor_e$139 =
      _f(function (el$140, e$141) {
           return __(oc$Froc$[21], [ e$141, _f(function (v$142) { return el$140.style.backgroundColor = v$142; }) ]);
         });
    var attach_backgroundColor_b$143 =
      _f(function (el$144, b$145) { return __(attach_backgroundColor_e$139, [ el$144, _(oc$Froc$[44], [ b$145 ]) ]); });
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
           _(oc$Froc$[51],
             [ _f(function (param$177) { return __m(elem$170.removeEventListener, elem$170, [ "click", f$173, 0 ]); }) ]);
           return match$178[0];
         });
    return $(ticks$73, ticks_b$63, delay_e$104, delay_eb$93, delay_b$111, delay_bb$107, mouse_e$114, mouse_b$119,
             attach_innerHTML$120, input_value_e$125, input_value_b$130, attach_input_value_e$132, attach_input_value_b$136,
             attach_backgroundColor_e$139, attach_backgroundColor_b$143, appendChild$151, replaceNode$160, clicks$169);
  }();
var oc$Froc_dom_anim$ =
  function () {
    var color$61 =
      _f(function (a$62, r$63, g$64, b$65) {
           if (a$62) return __(oc$Printf$[4], [ "rgba(%d,%d,%d,%d)", r$63, g$64, b$65, a$62[0] ]);
           return __(oc$Printf$[4], [ "rgb(%d,%d,%d)", r$63, g$64, b$65 ]);
         });
    var disk$67 =
      _f(function (param$92, radius$70, color$71, ctx$72) {
           ctx$72.fillStyle = color$71;
           _m(ctx$72.beginPath, ctx$72, [  ]);
           _m(ctx$72.arc, ctx$72, [ param$92[0], param$92[1], radius$70, 0., 2. * oc$Javascript$[5][0], 1 ]);
           return __m(ctx$72.fill, ctx$72, [  ]);
         });
    var filled_poly$73 =
      _f(function (points$74, color$75, ctx$76) {
           ctx$76.fillStyle = color$75;
           _m(ctx$76.beginPath, ctx$76, [  ]);
           _(oc$List$[9],
             [ _f(function (param$91) { return __m(ctx$76.lineTo, ctx$76, [ param$91[0], param$91[1] ]); }), points$74 ]);
           _m(ctx$76.closePath, ctx$76, [  ]);
           return __m(ctx$76.fill, ctx$76, [  ]);
         });
    var draw$79 =
      _f(function (canvas$80, instrs$81) {
           var ctx$82 = _m(canvas$80.getContext, canvas$80, [ "2d" ]);
           _m(ctx$82.clearRect, ctx$82, [ 0., 0., canvas$80.width, canvas$80.height ]);
           return __(oc$ListLabels$[9],
                     [
                       _f(function (f$83) {
                            _m(ctx$82.save, ctx$82, [  ]);
                            _(f$83, [ ctx$82 ]);
                            _m(ctx$82.closePath, ctx$82, [  ]);
                            return __m(ctx$82.restore, ctx$82, [  ]);
                          }),
                       instrs$81
                     ]);
         });
    var attach$84 =
      _f(function (canvas$85, instrsb$86) {
           var notify$87 =
             _f(function (param$89) {
                  switch ($t(param$89))
                  {
                  case 0: return __(draw$79, [ canvas$85, param$89[0] ]);
                  case 1: return 0;
                  default: return null;
                  }
                });
           return __(oc$Froc$[16], [ 0, instrsb$86, notify$87 ]);
         });
    return $(color$61, disk$67, filled_poly$73, attach$84);
  }();
var oc$Quickhull$ =
  function () {
    var D$58 = oc$Dom$;
    var F$59 = oc$Froc$;
    var Fd$60 = oc$Froc_dom$;
    var Fda$61 = oc$Froc_dom_anim$;
    var $7C$3E$62 = _f(function (x$63, f$64) { return __(f$64, [ x$63 ]); });
    var $3E$3E$3D$65 = F$59[3];
    var L$119 =
      function () {
        var nil$76 = _f(function (param$511) { return __(F$59[0], [ 0 ]); });
        var cons$77 = _f(function (h$78, t$79) { return __(F$59[0], [ $(h$78, t$79) ]); });
        var of_list$80 =
          _f(function (param$510) {
               if (param$510) return __(cons$77, [ param$510[0], _(of_list$80, [ param$510[1] ]) ]);
               return __(nil$76, [ 0 ]);
             });
        var to_list$83 =
          _f(function (l$84) {
               return __($3E$3E$3D$65,
                         [
                           l$84,
                           _f(function (param$509) {
                                if (param$509)
                                  return __($3E$3E$3D$65,
                                            [
                                              _(to_list$83, [ param$509[1] ]),
                                              _f(function (t$87) { return __(F$59[0], [ $(param$509[0], t$87) ]); })
                                            ]);
                                return __(F$59[0], [ 0 ]);
                              })
                         ]);
             });
        var length_less_than$88 =
          _f(function (n$89, l$90) {
               if (n$89 <= 0) return __(F$59[0], [ 0 ]);
               return __($3E$3E$3D$65,
                         [
                           l$90,
                           _f(function (param$507) {
                                if (param$507) return __(length_less_than$88, [ n$89 - 1, param$507[1] ]);
                                return __(F$59[0], [ 1 ]);
                              })
                         ]);
             });
        var map$92 =
          _f(function (f$93) {
               var memo$95 = _(F$59[52], [ 0, $(F$59[18]), 0, 0 ]);
               var map$96 =
                 _f(function (l$97) {
                      return __($3E$3E$3D$65,
                                [
                                  l$97,
                                  _f(function (param$506) {
                                       if (param$506)
                                         return __(cons$77, [ _(f$93, [ param$506[0] ]), _(memo$95, [ map$96, param$506[1] ]) ]);
                                       return __(nil$76, [ 0 ]);
                                     })
                                ]);
                    });
               return __(memo$95, [ map$96 ]);
             });
        var filter$100 =
          _f(function (f$101) {
               var memo$103 = _(F$59[52], [ 0, $(F$59[18]), 0, 0 ]);
               var filter$104 =
                 _f(function (l$105) {
                      return __($3E$3E$3D$65,
                                [
                                  l$105,
                                  _f(function (param$505) {
                                       if (param$505) {
                                         {
                                           var h$106 = param$505[0];
                                           var t$108 = _(memo$103, [ filter$104, param$505[1] ]);
                                           if (_(f$101, [ h$106 ])) return __(cons$77, [ h$106, t$108 ]);
                                           return t$108;
                                         }
                                       }
                                       return __(nil$76, [ 0 ]);
                                     })
                                ]);
                    });
               return __(memo$103, [ filter$104 ]);
             });
        var max$109 =
          _f(function (cmp$110) {
               var memo$112 = _(F$59[52], [ 0, $(F$59[18]), 0, 0 ]);
               var max$113 =
                 _f(function (l$114) {
                      return __($3E$3E$3D$65,
                                [
                                  l$114,
                                  _f(function (param$502) {
                                       if (param$502) {
                                         {
                                           var t$116 = param$502[1];
                                           var h$115 = param$502[0];
                                           return __($3E$3E$3D$65,
                                                     [
                                                       t$116,
                                                       _f(function (param$503) {
                                                            if (param$503) {
                                                              {
                                                                var m$117 = _(memo$112, [ max$113, t$116 ]);
                                                                return __
                                                                    ($3E$3E$3D$65,
                                                                    [
                                                                    m$117,
                                                                    _f
                                                                    (function 
                                                                    (m$27$118) {
                                                                    var match$504 = _(cmp$110, [ h$115, m$27$118 ]);
                                                                    if (match$504 !== 1) return m$117;
                                                                    return __(F$59[0], [ h$115 ]);
                                                                    })
                                                                    ]);
                                                              }
                                                            }
                                                            return __(F$59[0], [ h$115 ]);
                                                          })
                                                     ]);
                                         }
                                       }
                                       return __(F$59[1], [ $(Invalid_argument$18g, "empty list") ]);
                                     })
                                ]);
                    });
               return __(memo$112, [ max$113 ]);
             });
        return $(nil$76, cons$77, of_list$80, to_list$83, length_less_than$88, map$92, filter$100, max$109);
      }();
    var G$154 =
      function () {
        var compare$122 =
          _f(function (param$500, param$501) {
               var c$127 = caml_compare(param$500[0], param$501[0]);
               if (c$127 !== 0) return c$127;
               return caml_compare(param$500[1], param$501[1]);
             });
        var cross$128 = _f(function (param$498, param$499) { return param$498[0] * param$499[1] - param$499[0] * param$498[1]; });
        var line_side$133 =
          _f(function (param$494, param$495) {
               var match$497 = param$494[1];
               var match$496 = param$494[0];
               var ay$135 = match$496[1];
               var ax$134 = match$496[0];
               var u$140 = $(match$497[0] - ax$134, match$497[1] - ay$135);
               var v$141 = $(param$495[0] - ax$134, param$495[1] - ay$135);
               return __(cross$128, [ u$140, v$141 ]);
             });
        var above_line$142 = _f(function (l$143, p$144) { return _(line_side$133, [ l$143, p$144 ]) > 0.; });
        var line_dist$145 =
          _f(function (param$491, p$148) {
               var vec$149 =
                 _f(function (param$492, param$493) { return $(param$493[0] - param$492[0], param$493[1] - param$492[1]); });
               return __(cross$128, [ _(vec$149, [ param$491[0], p$148 ]), _(vec$149, [ param$491[1], p$148 ]) ]);
             });
        return $(compare$122, cross$128, line_side$133, above_line$142, line_dist$145);
      }();
    var QH$177 =
      function () {
        var split$155 =
          _f(function (p1$156, p2$157, l$158, hull$159) {
               return __($3E$3E$3D$65,
                         [
                           l$158,
                           _f(function (param$490) {
                                if (param$490) {
                                  {
                                    var line_dist$160 = _(G$154[4], [ $(p1$156, p2$157) ]);
                                    return __($3E$3E$3D$65,
                                              [
                                                _(L$119[7],
                                                  [
                                                    _f(function (a$161, b$162) {
                                                         return caml_float_compare
                                                                (_(line_dist$160, [ a$161 ]), 
                                                                 _(line_dist$160, [ b$162 ]));
                                                       }),
                                                    l$158
                                                  ]),
                                                _f(function (m$163) {
                                                     var left$164 = _(L$119[6], [ _(G$154[3], [ $(p1$156, m$163) ]), l$158 ]);
                                                     var right$165 = _(L$119[6], [ _(G$154[3], [ $(m$163, p2$157) ]), l$158 ]);
                                                     return __(split$155,
                                                               [
                                                                 p1$156,
                                                                 m$163,
                                                                 left$164,
                                                                 _(split$155, [ m$163, p2$157, right$165, hull$159 ])
                                                               ]);
                                                   })
                                              ]);
                                  }
                                }
                                return __(L$119[1], [ p1$156, hull$159 ]);
                              })
                         ]);
             });
        var hull$166 =
          _f(function (l$167) {
               return __($3E$3E$3D$65,
                         [
                           _(L$119[4], [ 2, l$167 ]),
                           _f(function (b$168) {
                                if (b$168) return l$167;
                                var min$169 =
                                  _(L$119[7], [ _f(function (a$170, b$171) { return -_(G$154[0], [ a$170, b$171 ]); }), l$167 ]);
                                var max$172 = _(L$119[7], [ G$154[0], l$167 ]);
                                return __(F$59[55],
                                          [
                                            0,
                                            min$169,
                                            max$172,
                                            _f(function (min$173, max$174) {
                                                 var upper$175 = _(L$119[6], [ _(G$154[3], [ $(min$173, max$174) ]), l$167 ]);
                                                 var lower$176 = _(L$119[6], [ _(G$154[3], [ $(max$174, min$173) ]), l$167 ]);
                                                 return __(split$155,
                                                           [
                                                             min$173,
                                                             max$174,
                                                             upper$175,
                                                             _(split$155, [ max$174, min$173, lower$176, _(L$119[0], [ 0 ]) ])
                                                           ]);
                                               })
                                          ]);
                              })
                         ]);
             });
        return $(split$155, hull$166);
      }();
    var get$178 =
      _f(function (id$179) { return function () { var v$512 = D$58[1]; return __m(v$512.getElementById, v$512, [ id$179 ]); }(); });
    var onload$180 =
      _f(function (param$472) {
           var min$181 = 0.;
           var max$182 = 500.;
           var ticks$183 = _(Fd$60[0], [ 20. ]);
           var random_color$184 =
             _f(function (param$489) {
                  return __(Fda$61[0], [ 0, _(oc$Random$[4], [ 255 ]), _(oc$Random$[4], [ 255 ]), _(oc$Random$[4], [ 255 ]) ]);
                });
           var bouncing$185 =
             _f(function (param$484) {
                  var coord$186 =
                    _f(function (param$485) {
                         var v$187 = _(oc$Random$[8], [ 5. ]);
                         var init$188 = _(oc$Random$[8], [ max$182 ]);
                         var collect$189 =
                           _f(function (param$487, param$488) {
                                var v$191 = param$487[1];
                                var p$192 = param$487[0] + v$191;
                                var v$193 = p$192 <= min$181 || p$192 >= max$182 ? -v$191 : v$191;
                                return $(p$192, v$193);
                              });
                         return __($7C$3E$62,
                                   [
                                     _($7C$3E$62,
                                       [
                                         _(F$59[36], [ collect$189, $(init$188, v$187), ticks$183 ]),
                                         _(F$59[33], [ _f(function (prim$486) { return prim$486[0]; }) ])
                                       ]),
                                     _(F$59[42], [ 0, init$188 ])
                                   ]);
                       });
                  var x$194 = _(coord$186, [ 0 ]);
                  var y$195 = _(coord$186, [ 0 ]);
                  var c$196 = _(random_color$184, [ 0 ]);
                  return __(F$59[56], [ 0, x$194, y$195, _f(function (x$197, y$198) { return $(x$197, y$198, c$196); }) ]);
                });
           var stationary$199 =
             _f(function (param$483) {
                  return $(_(oc$Random$[8], [ max$182 ]), _(oc$Random$[8], [ max$182 ]), _(random_color$184, [ 0 ]));
                });
           var clicks$200 =
             _(F$59[32],
               [
                 $(_(F$59[33], [ _f(function (param$480) { return 525483156; }), _(Fd$60[17], [ _(get$178, [ "stationary" ]) ]) ]),
                   $(_(F$59[33], [ _f(function (param$481) { return 644160741; }), _(Fd$60[17], [ _(get$178, [ "bouncing" ]) ]) ]),
                     $(_(F$59[33], [ _f(function (param$482) { return 958206052; }), _(Fd$60[17], [ _(get$178, [ "remove" ]) ]) ]),
                       0)))
               ]);
           var points$201 =
             function () {
               var memo$202 = _(F$59[52], [ 0, 0, 0, 0 ]);
               var lookup$203 =
                 _(memo$202,
                   [
                     _f(function (param$479) {
                          if (param$479 !== 0) throw $(Assert_failure$26g, $("quickhull.ml", 215, 53));
                          return __(L$119[0], [ 0 ]);
                        })
                   ]);
               var stationary$204 =
                 _(memo$202,
                   [ _f(function (v$205) { return __(L$119[1], [ _(stationary$199, [ 0 ]), _(lookup$203, [ v$205 - 1 ]) ]); }) ]);
               var bouncing$206 =
                 _(memo$202,
                   [
                     _f(function (v$207) {
                          return __($3E$3E$3D$65,
                                    [
                                      _(bouncing$185, [ 0 ]),
                                      _f(function (p$208) { return __(L$119[1], [ p$208, _(lookup$203, [ v$207 - 1 ]) ]); })
                                    ]);
                        })
                   ]);
               var collect$209 =
                 _f(function (param$476, param$477) {
                      var v$210 = param$476[0];
                      if (!(param$477 !== 644160741)) { { var v$212 = v$210 + 1; return $(v$212, _(bouncing$206, [ v$212 ])); } }
                      if (!(param$477 >= 958206052)) { { var v$211 = v$210 + 1; return $(v$211, _(stationary$204, [ v$211 ])); } }
                      if (v$210 !== 0) { { var v$214 = v$210 - 1; return $(v$214, _(lookup$203, [ v$214 ])); } }
                      return $(0, _(lookup$203, [ 0 ]));
                    });
               return _($7C$3E$62,
                        [
                          _($7C$3E$62,
                            [
                              _($7C$3E$62,
                                [
                                  _(F$59[36], [ collect$209, $(0, _(L$119[0], [ 0 ])), clicks$200 ]),
                                  _(F$59[33], [ _f(function (prim$475) { return prim$475[1]; }) ])
                                ]),
                              _(F$59[42], [ 0, _(L$119[0], [ 0 ]) ])
                            ]),
                          _f(function (eta$215) { return __(F$59[12], [ 0, eta$215 ]); })
                        ]);
             }();
           var disks$216 =
             _($7C$3E$62,
               [
                 _($7C$3E$62, [ points$201, L$119[3] ]),
                 _(F$59[5],
                   [
                     0,
                     _(oc$List$[10],
                       [ _f(function (param$474) { return __(Fda$61[1], [ $(param$474[0], param$474[1]), 5., param$474[2] ]); }) ])
                   ])
               ]);
           var hull$220 =
             _($7C$3E$62,
               [
                 _($7C$3E$62,
                   [
                     _($7C$3E$62,
                       [
                         _($7C$3E$62,
                           [ points$201, _(L$119[5], [ _f(function (param$473) { return $(param$473[0], param$473[1]); }) ]) ]),
                         QH$177[1]
                       ]),
                     L$119[3]
                   ]),
                 _(F$59[5], [ 0, _f(function (hull$224) { return __(Fda$61[2], [ hull$224, _(Fda$61[0], [ 0, 128, 0, 0 ]) ]); }) ])
               ]);
           var shapes$225 =
             _(F$59[56], [ 0, disks$216, hull$220, _f(function (disks$226, hull$227) { return $(hull$227, disks$226); }) ]);
           return __(oc$Froc_dom_anim$[3], [ _(get$178, [ "canvas" ]), shapes$225 ]);
         });
    _(F$59[48], [ 0 ]);
    (D$58[0]).onload = onload$180;
    return $(D$58, F$59, Fd$60, Fda$61, $7C$3E$62, $3E$3E$3D$65, L$119, G$154, QH$177, get$178, onload$180);
  }();
var oc$Std_exit$ = (_(oc$Pervasives$[80], [ 0 ]), $());
return caml_named_value;
})();
