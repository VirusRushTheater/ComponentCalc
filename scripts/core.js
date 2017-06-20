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

	// Removes duplicate, null and undefined entries on a list.
	removeListDuplicates: function(a){
		if(a == null)
		{
			return new Array();
		}
		a.sort();
		for(var i = 1; i < a.length; ){
			if(a[i-1] == a[i]){
				a.splice(i, 1);
			}
			else if((typeof a[i] == undefined) || (a[i] == null)){
				a.splice(i, 1);	
			}else {
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
		
		this.removeListDuplicates(retlist)
		return retlist.sort(function(a,b){return (a-b);});
	},

	// Recursive part of the Powerset algorithm. Not meant to be used as a standalone function, use powerSet() instead.
	_powersetCore: function(set, retval, index=(set.length-1), unfinished=[]){
		var lcols = set;
		if(index < 0)
		{
			return unfinished;
		}
		
		var rcol = set[index];
		
		for(var row in rcol)
		{
			unfinished[index] = rcol[row];
			retval.push(this._powersetCore(lcols, retval, index-1, unfinished).slice());
			if(index != 0){
				retval.pop();
			}
		}
		return []
	},

	// Supply a list of lists (eg: [[1, 2, 3], [4, 5, 6]]) and returns all the possible combinations of elements from those lists
	// (eg: [[1,4], [1,5], [1,6], [2,4], ...])
	powerSet: function(set)
	{
		var retval = [];
		this._powersetCore(set, retval);
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
	},

	// A type safe length, to avoid errors when checking length on null elements.
	typesafeLength: function(likelylist){
		if((typeof likelylist == undefined) || (likelylist == null)){
			return 0;
		}else{
			return likelylist.length;
		}
	}
};

var compCalculator = function(){ return(
{
	// Populate this with your component values here.
	components: {R: [], C: [], L: []},

	// Add restrictions to the function evaluator.
	restrictions: [],

	// Add the function(s) to be maximized using your components values.
	functions: [],

	// Results are stored here, once you run evaluate().
	result: [],

	// Error string and callback.
	error: "",

	errorCallback: function(error=this.error){},

	// FUNCTION:
	// Parses a component list, formatted as values separated with commas or spaces (eg: '2k2 3.3k 10M')
	// type: Type of component: 'R' for resistor, 'C' for capacitor, 'L' for inductor.
	parseComponentList: function(type, complist)
	{
		if(typeof this.components[type] == undefined)
		{
			this.error = "This type of component does not exist.";
			this.errorCallback();
		}
		this.components[type] = compCalculatorUtility.formatToolbox(complist);
	},

	// FUNCTION:
	// Checks if the functions are valid. (Have a '=' sign)
	// TODO: Throw an error if two '='s are found. Or another syntax errors, use Nerdamer for that.
	checkFunctions: function()
	{
		var rx

		for(f in this.functions)
		{
			rx = /=/g
			if(!rx.test(this.functions[f]))
			{
				this.error = "'" + this.functions[f] + "' -> Not a valid equation."
				this.errorCallback(this.error);
				return false;
			}
		}
		return true;
	},

	// FUNCTION:
	// Checks if the restrictions are valid. (Have relationship signs)
	// TODO: Throw an error if two relation signs are found. Or another syntax errors, use Nerdamer for that.
	checkRestrictions: function()
	{
		var rx

		for(r in this.restrictions)
		{
			rx = /(\=|>\=|<\=|<|>)/g
			if(!(rx.test(this.restrictions[r])))
			{
				this.error = "'" + this.restrictions[r] + "' -> Not a valid relation."
				this.errorCallback(this.error);
				return false;
			}
		}
		return true;
	},

	// FUNCTION:
	// This is used to weigh the matches after calculation, thus sorting the best.
	matchWeight: function(matchlist)
	{
		if(typeof matchlist == "number")
		{
			if(!isNaN(matchlist)){
				return matchlist;
			}else{
				return Number.NEGATIVE_INFINITY;
			}
		}
		else if(typeof matchlist == "object")
		{
			var sum = 0.0
			for(var i in matchlist){
				sum += matchlist[i]
			}
			if(!isNaN(sum)){
				return (sum)/(matchlist.length)
			}else{
				return Number.NEGATIVE_INFINITY;
			}
		}
	},

	// FUNCTION:
	// Once you have your components, restrictions and functions set, run this function.
	// Use "limit" to limit the results to a set amount. (Default is 20)
	evaluate: function(limit=20)
	{
		var component_regex = [/R[\d]+/g, /C[\d]+/g, /L[\d]+/g];
		var component_labels = []
		var component_values = []
		var component_combinations = []
		var equationsides;

		var error_functions = [];

		var restriction_simple = []
		var restriction_complex = []

		// Checks functions and restrictions.
		if(!this.checkFunctions() || !this.checkRestrictions())
		{
			return false;
		}

		// Nerdamer doesn't like spaces in their expressions. Remove them.
		// Also, replace component values in each restriction and function by a respective number.
		for(var f in this.functions){
			this.functions[f] = this.functions[f].replace(/[ \t]/g, '')
			this.functions[f] = this.functions[f].replace(/([\d\.]+[pnumrRkKMG][\d]*)[FfOHh]?/g, function(s){return compCalculatorUtility.fromCompValue(s)})
		}
		for(var r in this.restrictions){
			this.restrictions[r] = this.restrictions[r].replace(/[ \t]/g, '')
			this.restrictions[r] = this.restrictions[r].replace(/([\d\.]+[pnumrRkKMG][\d]*)[FfOHh]?/g, function(s){return compCalculatorUtility.fromCompValue(s)})
		}

		this.result = []

		// Convert function into an Error function (0.0 for complete match, 1.0 for complete unmatch.)
		// Model: LS = RS -> Error = |LS - RS| / RS
		// Tolerates only one function at the moment.
		// TODO: Evaluate more than one function.
		for(var f in this.functions)
		{
			equationsides = this.functions[f].split('=')
			error_functions.push('abs((' + equationsides[0] + ') - (' + equationsides[1] + '))/(' + equationsides[1] + ')')
		}

		// Finds ocurrences of component variables in the functions, such as R1, R2, C1, C2, ...
		// And registers them as labels.
		for(var cptn in component_regex)
		{
			for(var f in this.functions)
			{
				component_labels = component_labels.concat(this.functions[f].match(component_regex[cptn]));
			}
		}
		compCalculatorUtility.removeListDuplicates(component_labels);

		// For each label, generates a list of all possible values.
		for(l in component_labels)
		{
			for(key in this.components)
			{
				if(component_labels[l].indexOf(key) != -1)
				{
					component_values.push(this.components[key].slice())
				}
			}
		}

		// Check which restrictions based on single components there are, so I can quickly filter those out and save much processing.
		var complex_matches;
		for(r in this.restrictions)
		{
			complex_matches = 0;
			for(m in component_regex)
			{
				complex_matches += compCalculatorUtility.typesafeLength(this.restrictions[r].match(component_regex[m]))
			}
			if(complex_matches > 1){
				restriction_complex.push(this.restrictions[r])
			}else if(complex_matches == 1){
				restriction_simple.push(this.restrictions[r])
			}
		}

		// Use simple restrictions to filter combinations right away. Time for Nerdamer to shine.
		// But Nerdamer cannot test relation symbols, so I will use a trick: substract both sides of the equation and test the sign of the result.
		// This part relies a lot in Nerdamer's capacity of parsing math expressions. Any improvements in that library will make this part run faster.
		var clist_ref, clist_match
		var test_type
		var test_regex = /(\=|>\=|<\=|<|>)/g
		var test_equation
		var test_variable = {}
		for(var s in restriction_simple)
		{
			test_type = restriction_simple[s].match(test_regex)[0]

			for(var m in component_regex)
			{
				clist_match = restriction_simple[s].match(component_regex[m])
				if(clist_match != null)
				{
					clist_ref = component_values[component_labels.indexOf(clist_match[0])]
					break;
				}
			}

			// Different treatment for each relation symbol.
			clist_match = clist_match[0]
			switch(test_type)
			{
				case '=':
					equationsides = restriction_simple[s].split('=')
					test_equation = '(' + equationsides[0] + ')-(' + equationsides[1] + ')'
					for(var c = 0; c < clist_ref.length; )
					{
						test_variable[clist_match] = clist_ref[c]
						if(Number(nerdamer(test_equation, test_variable, 'numer').evaluate().text()) != 0)
						{
							c++;
						}
						else{
							clist_ref.splice(c, 1);
						}
					}
				break;
				case '<':
					equationsides = restriction_simple[s].split('<')
					test_equation = '(' + equationsides[0] + ')-(' + equationsides[1] + ')'
					for(var c = 0; c < clist_ref.length; )
					{
						test_variable[clist_match] = clist_ref[c]
						if(Number(nerdamer(test_equation, test_variable, 'numer').evaluate().text()) < 0)
						{
							c++;
						}
						else{
							clist_ref.splice(c, 1);
						}
					}
				break;
				case '>':
					equationsides = restriction_simple[s].split('>')
					test_equation = '(' + equationsides[0] + ')-(' + equationsides[1] + ')'
					for(var c = 0; c < clist_ref.length; )
					{
						test_variable[clist_match] = clist_ref[c]
						if(Number(nerdamer(test_equation, test_variable, 'numer').evaluate().text()) > 0)
						{
							c++;
						}
						else{
							clist_ref.splice(c, 1);
						}
					}
				break;
				case '<=':
					equationsides = restriction_simple[s].split('<=')
					test_equation = '(' + equationsides[0] + ')-(' + equationsides[1] + ')'
					for(var c = 0; c < clist_ref.length; )
					{
						test_variable[clist_match] = clist_ref[c]
						if(Number(nerdamer(test_equation, test_variable, 'numer').evaluate().text()) <= 0)
						{
							c++;
						}
						else{
							clist_ref.splice(c, 1);
						}
					}
				break;
				case '>=':
					equationsides = restriction_simple[s].split('>=')
					test_equation = '(' + equationsides[0] + ')-(' + equationsides[1] + ')'
					for(var c = 0; c < clist_ref.length; )
					{
						test_variable[clist_match] = clist_ref[c]
						if(Number(nerdamer(test_equation, test_variable, 'numer').evaluate().text()) >= 0)
						{
							c++;
						}
						else{
							clist_ref.splice(c, 1);
						}
					}
				break;
			}
		}

		// Now that simple restrictions have been put in place, generate all possible combinations.
		component_combinations = compCalculatorUtility.powerSet(component_values)

		// TODO: It's late and I ran out of coffee. I'll bother my future self to implement Complex Restrictions.

		// Test each error function with all those different combinations so I can quantize how close are the components of the toolbox to the requirements of each function.
		// TODO: This is the most heavy duty part of the code. Any optimization here is well received. I've thought in using GPU libraries or partial derivatives using the exponential nature of component values.
		// But alas, I haven't crunched the numbers yet, so I'll count purely on CPU in this one.
		// This part is also heavily reliant on Nerdamer, so any improvements in that library will be reflected in this algorithm's performance.
		var value_combination, value_combination_expendable;
		var value_match = [];
		for(var c in component_combinations)
		{
			value_combination = compCalculatorUtility.labelList(component_combinations[c], component_labels)
			value_combination_expendable = compCalculatorUtility.labelList(component_combinations[c], component_labels)
			for(f in error_functions)
			{
				// TODO: Why these match functions return negative values sometimes?
				value_match.push(100.0 * (1.0 - Number(nerdamer(error_functions[f], value_combination_expendable, 'numer').evaluate().text())));
			}

			this.result.push({
				match: value_match.slice(),
				components: value_combination,
				weight: this.matchWeight(value_match)
			})

			// Flush value_match
			value_match = []
		}

		// Sort all matches by their weight, and limits the amount of results.
		this.result.sort(function(a,b){return(a.weight < b.weight)});
		if(limit > 0)
		{
			this.result = this.result.splice(0, limit);
		}

		// Done. If you missed the return value, try this.result.
		return this.result;
	},

	// FUNCTION:
	// Transforms this.result into a human-readable string.
	toString: function()
	{
		var retval = "Best matches for last evaluation:"
		return "Not implemented yet."
	},

	// FUNCTION:
	// Transforms this.result into HTML.
	toHTML: function()
	{
		var retval = "<h3>Best matches for last evaluation<h3><h4>Functions</h4><ul>"
		for(f in this.functions)
		{
			retval += "<li>" + this.functions[f] + "</li>"
		}
		retval += "</ul><h4>Restrictions</h4><ul>"
		for(r in this.restrictions)
		{
			retval += "<li>" + this.restrictions[r].replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</li>"
		}
		retval += "</ul><h4>Best matches:</h4><table>"
		for(m in this.result)
		{
			retval += "<tr><td>"
			for(c in this.result[m].components)
			{
				retval += c + " = " + compCalculatorUtility.toCompValue(this.result[m].components[c]) + "</td><td>"
			}
			for(mt in this.result[m].match)
			{
				retval += "Match: " + this.result[m].match[mt].toFixed(2) + "%</td><td>"
			}
			retval += "</td></tr>"
		}
		retval += "</table>"
		return retval
	}
})}
