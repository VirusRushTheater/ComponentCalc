// Namespace for hand made functions used by the calculator.

var compCalculatorUtility =
{
	// Converts a number into a prefixed component value (ex. 3300 -> 3.30k)
	toCompValue: function(value){
		var pref = ['f', 'p', 'n', 'u', 'm', '', 'k', 'M', 'G', 'T']
		var multiplier;
		if(value != 0)
			multiplier = Math.floor(Math.log10(value) / 3);
		else
			multiplier = 0
		var normalized = value * Math.pow(1000, -multiplier)
		
		return normalized.toFixed(2).toString() + pref[multiplier + 5]
	},

	// Removes duplicate entries on a list.
	remove_list_dupls: function(list){
		if(a == null)
		{
			return new Array();
		}
		a.sort();
		for(var i = 1; i < a.length; ){
			if(a[i-1] == a[i]){
				a.splice(i, 1);
			} else {
				i++;
			}
		}
		return a;
	},

	// Converts a prefixed component value (as a string) to a number. (ex. 2k2 -> 2200, 47u -> 4.7e-5)
	fromCompValue: function(res){
		if(typeof(res) == "number")
		{
			return res;
		}
		var retval = 1.0;
		var multdic = {p:1e-12, n:1e-9, u:1e-6, m:1e-3, R:1.0, r:1.0, k:1e3, K:1e3, M:1e6, G:1e9};
		var resvalrx = /([\d\.]*)([pnumrRkKMG]?)([\d]*)/;
		var multiplier;
		var resmatch = resvalrx.exec(res);
		
		if(resmatch[1] !== ''){
			retval = Number(resmatch[1]);
		}
		if(resmatch[2] !== ''){
			multiplier = multdic[resmatch[2]];
			retval *= multiplier;
		}
		if(resmatch[3] !== ''){
			retval += (multiplier * Number("0." + resmatch[3]));
		}
		
		return retval;
	},

	// TODO: Reformat function calls.
	// Converts a string of components separated by spaces or commas into a list of their values, by iterating fromCompValue() on them.
	formatToolbox: function(txt){
		var matchlist;
		var retlist = new Array();
		var re = /[\d\.]+[pnumrRkKMG]?[\d]*/g;
		
		matchlist = txt.match(re);
		for(var m in matchlist){
			retlist.push(this.fromCompValue(matchlist[m]));
		}
		
		return retlist.sort(function(a,b){return (a-b);});
	},

	// Recursive part of the Powerset algorithm. Not meant to be used as a standalone function, use powerset() instead.
	_powersetCore: function(set, labels, retval, index=(labels.length-1), unfinished=[]){
		var lcols = set;
		if(index < 0)
		{
			return unfinished;
		}
		
		var rcol = set[index];
		
		for(var row in rcol)
		{
			unfinished[index] = rcol[row];
			retval.push(this._powersetCore(lcols, labels, retval, index-1, unfinished).slice());
			if(index != 0){
				retval.pop();
			}
		}
		return []
	},

	// Supply a list of lists (eg: [[1, 2, 3], [4, 5, 6]]) and returns all the possible combinations of elements from those lists
	// (eg: [[1,4], [1,5], [1,6], [2,4], ...])
	powerset: function(set, labels)
	{
		var retval = [];
		this._powersetCore(set, labels, retval);
		return retval;
	},

	// Takes a list of elements (eg: [1, 2, 3]) and a list of labels (eg: ["first", "second", "third"]) and converts it into a map
	// (eg: {first:1, second:2, third:3})
	labelList: function(list, labels){
		var retval = {}
		for(var i in list)
		{
			retval[labels[i]] = list[i];
		}
		return retval;
	}
};

// Namespace for the component calculator.
var compCalculator = {

}

var comp_calculator = function()
{
	functions: [],
	restrictions: [],

}

function addPrefix(value)
{
	var pref = ['f', 'p', 'n', 'u', 'm', '', 'k', 'M', 'G', 'T']
	var multiplier;
	if(value != 0)
		multiplier = Math.floor(Math.log10(value) / 3);
	else
		multiplier = 0
	var normalized = value * Math.pow(1000, -multiplier)
	
	return normalized.toFixed(2).toString() + pref[multiplier + 5]
}

// Removes duplicates from a list
function remove_dupl(a)
{
	if(a == null)
	{
		return new Array();
	}
	a.sort();
	for(var i = 1; i < a.length; ){
		if(a[i-1] == a[i]){
			a.splice(i, 1);
		} else {
			i++;
		}
	}
	return a;
}

// Converts a string like "3k3" into a number
function comp_value_num(res)
{
	if(typeof(res) == "number")
	{
		return res;
	}
	var retval = 1.0;
	var multdic = {p:1e-12, n:1e-9, u:1e-6, m:1e-3, R:1.0, r:1.0, k:1e3, K:1e3, M:1e6, G:1e9};
	var resvalrx = /([\d\.]*)([pnumrRkKMG]?)([\d]*)/;
	var multiplier;
	var resmatch = resvalrx.exec(res);
	
	if(resmatch[1] !== ''){
		retval = Number(resmatch[1]);
	}
	if(resmatch[2] !== ''){
		multiplier = multdic[resmatch[2]];
		retval *= multiplier;
	}
	if(resmatch[3] !== ''){
		retval += (multiplier * Number("0." + resmatch[3]));
	}
	
	return retval;
}

// Returns a numeric list with all the value matchings in the string.
function parsetoolbox(txt)
{
	var matchlist;
	var retlist = new Array();
	var re = /[\d\.]+[pnumrRkKMG]?[\d]*/g;
	
	matchlist = txt.match(re);
	for(var m in matchlist){
		retlist.push(comp_value_num(matchlist[m]));
	}
	
	return retlist.sort(function(a,b){return (a-b);});
}

// Custom powerset function.
function powerset_core(set, labels, retval, index=(labels.length-1), unfinished=[])
{	
	var lcols = set;
	if(index < 0)
	{
		return unfinished;
	}
	
	var rcol = set[index];
	
	for(var row in rcol)
	{
		unfinished[index] = rcol[row];
		retval.push(powerset_core(lcols, labels, retval, index-1, unfinished).slice());
		if(index != 0){
			retval.pop();
		}
	}
	return []
}

function powerset(set, labels)
{
	var retval = [];
	powerset_core(set, labels, retval);
	return retval;
}

function replacelist(list, labels)
{
	var retval = {}
	for(var i in list)
	{
		retval[labels[i]] = list[i];
	}
	return retval;
}

// Evaluate the function fn. Toolbox in an object {R:[], C:[], L:[]}
function eval_function(fn, toolbox, limit=0)
{
	var resistor_re = /R[\d]*/g;
	var capacitor_re = /C[\d]*/g;
	var inductor_re = /L[\d]*/g;
	
	var rcllist = [];
	var component_order = [];
	var box = {};
	
	var component_comb = [];

	var sides, errorfn, llfnparsed;
	
	var retval;
	
	if(fn.search('=') == -1)
	{
		// ERROR: No equation found.
		return []
	}
	sides = fn.split('=')
	errorfn = 'abs((' + sides[0] + ') - (' + sides[1] + '))/(' + sides[1] + ')';
	errorfn = errorfn.replace(/ /g, '');
	
	var results;
	var rplist;
	var matchlist = [];
	
	// Search the ocurrences of R1,2,...
	var resistor_ocurrences = remove_dupl(fn.match(resistor_re));
	var capacitor_ocurrences = remove_dupl(fn.match(capacitor_re));
	var inductor_ocurrences = remove_dupl(fn.match(inductor_re));
	
	// Adds a list of components for each R1, R2, ..., C1, C2, ... in the formula.
	for(var ro in resistor_ocurrences){
		rcllist.push(toolbox['R']);
		component_order.push(resistor_ocurrences[ro]);
	}
	for(var co in capacitor_ocurrences){
		rcllist.push(toolbox['C']);
		component_order.push(capacitor_ocurrences[co]);
	}
	for(var lo in inductor_ocurrences){
		rcllist.push(toolbox['L']);
		component_order.push(inductor_ocurrences[lo]);
	}
	
	// Filters that list of components using our restrictions.
	// Todo: Use restrictions
	component_comb = powerset(rcllist, component_order);
	
	// The lesser the error, the best is the match.
	for(var combination in component_comb)
	{
		rplist = replacelist(component_comb[combination], component_order)
		matchlist.push({match: (100.0 - 100.0*Number(nerdamer(errorfn, rplist, 'numer').evaluate().text())), components: replacelist(component_comb[combination], component_order)})
	}
	
	// Sorts the list of components by error percentage.
	matchlist.sort(function(a,b){return(a.match < b.match)});
	
	// Limits the list if limit is different than zero.
	if(limit > 0)
	{
		matchlist = matchlist.splice(0, limit);
	}
	
	// Prepares an object.
	retval = {matches: matchlist,
	toString: function(){
		var rv = "Best matches are:\n"
		console.log(this)
		for(var m in this.matches)
		{
			for(var c in this.matches[m].components)
			{
				rv += c += ": " + addPrefix(this.matches[m].components[c]) + " | ";
			}
			rv += "(Match: " + this.matches[m].match.toFixed(2) + "%)\n";
		}
		
		return rv;
	}}
	
	return retval;
}