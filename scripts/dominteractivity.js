var funcrow_template = '<td>$0</td><td>$1</td><td><a href="" onclick="return false;"><i class="icon-minus-circle"></i></a></td>'
var restrow_template = '<td>$0</td><td>$1</td><td><a href="" onclick="return false;"><i class="icon-minus-circle"></i></a></td>'

var comp_template = {
	resistors: 	'$0&Omega;&nbsp;<a href="" onclick="return false;"><i class="icon-minus-circle"></i></a>',
	capacitors: '$0F&nbsp;<a href="" onclick="return false;"><i class="icon-minus-circle"></i></a>',
	inductors: 	'$0H&nbsp;<a href="" onclick="return false;"><i class="icon-minus-circle"></i></a>'
}

var function_table = 	[]
var restriction_table = []
var components = {
	resistors: [],
	capacitors: [],
	inductors: []
}

var func_variables = 	[]

function setStatus(statustype, text, buttonok = false, onOk = null)
{
	document.getElementById("status-text").innerHTML = text;
	document.getElementById("statusbar").className = statustype;	// success, error, warning or info
	
	if(buttonok == true)
	{
		document.getElementById("status-ok-btn").style.display = 'inherit';
		document.getElementById("status-cancel-btn").style.display = 'inherit';
		
		document.getElementById("status-ok-btn").addEventListener("click", function(event){
			onOk();
			document.getElementById("statusbar").className = "";
		});
		document.getElementById("status-cancel-btn").addEventListener("click", function(event){
			document.getElementById("statusbar").className = "";
		});
	}
	else
	{
		document.getElementById("status-ok-btn").style.display = 'inherit';
		document.getElementById("status-cancel-btn").style.display = 'none';
		document.getElementById("status-ok-btn").addEventListener("click", function(event){
			document.getElementById("statusbar").className = "";
		});
	}
}

function addFunction(fn)
{
	var parenttable = 	document.querySelectorAll("table.flist")[0]
	var newelement =	document.createElement("tr")
	var fn_html =		fn

	// Syntax checking for function (search for =)
	var equalmatches =	fn.match(/=/g)
	if((equalmatches == null) || (equalmatches.length != 1))
	{
		setStatus("error", "<b>Syntax error:</b> Function must be an equation and have only one equal (=) sign.")
		return null;
	}

	newelement.innerHTML = funcrow_template.replace("$0", function_table.length + 1).replace("$1", fn)
	parenttable.appendChild(newelement)

	newelement.getElementsByTagName("a")[0].addEventListener("click", function(event){
		removeFunction(newelement)
	})

	function_table.push({
		value: 			fn,
		funct_html: 	fn_html, 
		element_ref: 	newelement
	})

	updateFunctionStorage();
}

function removeFunction(domelement)
{
	// Remove both element and table.
	for(var i in function_table)
	{
		if(function_table[i].element_ref.isEqualNode(domelement))
		{
			domelement.parentNode.removeChild(domelement)
			function_table.splice(i, 1)
		}
	}

	// Updates other elements
	for(var i in function_table)
	{
		function_table[i].element_ref.getElementsByTagName("td")[0].innerHTML = (i*1+1)
	}

	document.getElementById("vars-id").innerHTML = functionVariables().join(", ")
	updateFunctionStorage()
}

function clearFunctions()
{
	for(var i in function_table)
	{
		function_table[i].element_ref.parentNode.removeChild(function_table[i].element_ref)
	}
	function_table = []
	updateFunctionStorage()
}


function addRestriction(fn)
{
	var parenttable = 	document.querySelectorAll("table.flist")[1]
	var newelement =	document.createElement("tr")
	var fn_html =		fn

	// Syntax checking for function (search for =)
	var equalmatches =	fn.match(/(<=|>=|=|<|>)/g)
	if((equalmatches == null) || (equalmatches.length != 1))
	{
		setStatus("error", "<b>Syntax error:</b> Restriction must be a relation, and have only one inequation sign (&gt;, &lt;, &gt;=, &lt;= or =)")
		return null;
	}

	newelement.innerHTML = restrow_template.replace("$0", restriction_table.length + 1).replace("$1", fn)
	parenttable.appendChild(newelement)

	newelement.getElementsByTagName("a")[0].addEventListener("click", function(event){
		removeRestriction(newelement)
	})

	restriction_table.push({
		value: 			fn,
		funct_html: 	fn_html, 
		element_ref: 	newelement
	})

	updateRestrictionStorage()
}

function removeRestriction(domelement)
{
	// Remove both element and table.
	for(var i in restriction_table)
	{
		if(restriction_table[i].element_ref.isEqualNode(domelement))
		{
			domelement.parentNode.removeChild(domelement)
			restriction_table.splice(i, 1)
			break;
		}
	}

	// Updates other elements
	for(var i in restriction_table)
	{
		restriction_table[i].element_ref.getElementsByTagName("td")[0].innerHTML = (i*1+1)
	}

	updateRestrictionStorage()
}

function clearRestrictions()
{
	for(var i in restriction_table)
	{
		restriction_table[i].element_ref.parentNode.removeChild(restriction_table[i].element_ref)
	}
	restriction_table = []

	updateRestrictionStorage()
}

// Adding "type" and "compdiv" for reusability
function addComponents(typ, valuesstr, parentdivid)
{
	if((typ != "resistors") && (typ != "capacitors") && (typ != "inductors"))
	{
		return null;
	}
	var colorprefix = {
		resistors: -1,
		capacitors: -12,
		inductors: -9
	}

	var values =	valuesstr.split(" ")
	var numericv =	[]
	var currentv =	compCalculatorUtility.listValues(components[typ])
	var tempnv

	// Converts values to numbers
	for(var v in values)
	{
		if(values[v] == "")
			continue;

		tempnv =	compCalculatorUtility.fromCompValue(values[v])
		if(!isNaN(tempnv))
		{
			numericv.push({
				value: 		tempnv,
				element: 	null
			})
		}
		else
		{
			setStatus("error", "You entered an ilegible component value (" + values[v] + ")")
			return null
		}
	}

	components[typ] = components[typ].concat(numericv)
	components[typ].sort(function(a,b){
		if(a.value != b.value)
			return (a.value - b.value)
		else
			return ((a.element != null) && ~(b.element != null))
	})

	// First element will always have a not-null element if duplicated. Remove everything else.
	compCalculatorUtility.removeListDuplicatesByProperty(components[typ], "value")

	var pdvid = document.getElementById(parentdivid)
	var val = 0

	// Add and sort properly.
	for(var c in components[typ])
	{
		if(components[typ][c].element == null)
		{
			var nc = document.createElement("div")
			val = components[typ][c].value
			nc.className = "magnitude-" + Math.floor((Math.log10(components[typ][c].value) - colorprefix[typ])).toFixed(0).toString()
			nc.innerHTML = comp_template[typ].replace("$0", compCalculatorUtility.toCompValue(components[typ][c].value))
			pdvid.appendChild(nc)

			nc.getElementsByTagName("a")[0].addEventListener("click", function(ev1,ev2){
				return function(){
					removeComponents(ev1, ev2)
				}
			}(typ, val), false)
			components[typ][c].element = nc
		}
		else
		{
			pdvid.appendChild(components[typ][c].element)	
		}
	}

	updateCompMemory(typ)
}

function removeComponents(typ, val)
{
	// Remove both element and table.
	for(var i in components[typ])
	{
		if(components[typ][i].value == val)
		{
			components[typ][i].element.parentNode.removeChild(components[typ][i].element)
			components[typ].splice(i, 1)
			break;
		}
	}
	updateCompMemory(typ)
}

function clearComponents(typ)
{
	// Remove both element and table.
	var j = components[typ].length
	for(var i = 0; i < j; i++)
	{
		components[typ][0].element.parentNode.removeChild(components[typ][0].element)
		components[typ].splice(0, 1)
	}
	updateCompMemory(typ)
}

function updateCompMemory(typ)
{
	localStorage[typ] = compCalculatorUtility.listValues(components[typ]).join(" ")
}

function updateFunctionStorage()
{
	localStorage.functions = compCalculatorUtility.listValues(function_table).join('\u0001')
}

function updateRestrictionStorage()
{
	localStorage.restrictions = compCalculatorUtility.listValues(restriction_table).join('\u0001')
}

function recoverCompFromMemory()
{
	addComponents("resistors", localStorage.resistors, "res-tbx-flex")
	addComponents("capacitors", localStorage.capacitors, "cap-tbx-flex")
	addComponents("inductors", localStorage.inductors, "ind-tbx-flex")

	if(localStorage.functions != "")
	{
		var func = localStorage.functions.split('\u0001')
		for(var f in func)
			addFunction(func[f])
	}

	if(localStorage.restrictions != "")
	{
		var rest = localStorage.restrictions.split('\u0001')
		for(var r in rest)
			addRestriction(rest[r])
	}

	document.getElementById("vars-id").innerHTML = functionVariables().join(", ")
}

function calculate()
{
	var coreunit = compCalculator()

	coreunit.components.R = 	compCalculatorUtility.listValues(components["resistors"])
	coreunit.components.C = 	compCalculatorUtility.listValues(components["capacitors"])
	coreunit.components.L = 	compCalculatorUtility.listValues(components["inductors"])

	coreunit.restrictions = compCalculatorUtility.listValues(restriction_table)
	coreunit.functions =	compCalculatorUtility.listValues(function_table)
	coreunit.errorCallback = function(errorstr)
	{
		setStatus("error", errorstr)
	}

	// HEAVY DUTY
	coreunit.evaluate()

	document.getElementById("results-div").value = coreunit.toString()
}

function functionVariables()
{
	var allvars = []
	for(var f in function_table)
	{
		var m = function_table[f].value.match(/[RLC]\d+/g)
		for(var j in m)
		{
			allvars.push(m[j])
		}
	}
	compCalculatorUtility.removeListDuplicates(allvars)
	return allvars
}

// When page loads
document.addEventListener("DOMContentLoaded", function(event){
	if(localStorage.components == undefined)
	{
		localStorage.components = "defined"
		localStorage.resistors = ""
		localStorage.capacitors = ""
		localStorage.inductors = ""
		localStorage.functions = ""
		localStorage.restrictions = ""
	}

	document.getElementById("add-function").addEventListener("click", function(ev){
		addFunction(document.getElementById("func-input").value)
		document.getElementById("func-input").value = ""
		document.getElementById("vars-id").innerHTML = functionVariables().join(", ")
	})
	document.getElementById("clr-function").addEventListener("click", function(ev){
		clearFunctions()
		document.getElementById("vars-id").innerHTML = functionVariables().join(", ")
	})
	document.getElementById("func-input").addEventListener("keydown", function(ev){
		if(ev.keyCode == 13){
			addFunction(document.getElementById("func-input").value)
			document.getElementById("func-input").value
			document.getElementById("vars-id").innerHTML = functionVariables().join(", ")
		}
	})
	document.getElementById("add-restriction").addEventListener("click", function(ev){
		addRestriction(document.getElementById("rest-input").value)
		document.getElementById("rest-input").value = ""
	})
	document.getElementById("clr-restriction").addEventListener("click", function(ev){
		clearRestrictions()
	})
	document.getElementById("rest-input").addEventListener("keydown", function(ev){
		if(ev.keyCode == 13){
			addRestriction(document.getElementById("rest-input").value)
			document.getElementById("rest-input").value = ""
		}
	})
	document.getElementById("add-res").addEventListener("click", function(ev){
		addComponents("resistors", document.getElementById("res-input").value, "res-tbx-flex")
		document.getElementById("res-input").value = ""
	})
	document.getElementById("clr-res").addEventListener("click", function(ev){
		clearComponents("resistors")
	})
	document.getElementById("res-input").addEventListener("keydown", function(ev){
		if(ev.keyCode == 13){
			addComponents("resistors", document.getElementById("res-input").value, "res-tbx-flex")
			document.getElementById("res-input").value = ""
		}
	})
	document.getElementById("add-cap").addEventListener("click", function(ev){
		addComponents("capacitors", document.getElementById("cap-input").value, "cap-tbx-flex")
		document.getElementById("cap-input").value = ""
	})
	document.getElementById("clr-cap").addEventListener("click", function(ev){
		clearComponents("capacitors")
	})
	document.getElementById("cap-input").addEventListener("keydown", function(ev){
		if(ev.keyCode == 13){
			addComponents("capacitors", document.getElementById("cap-input").value, "cap-tbx-flex")
			document.getElementById("cap-input").value = ""
		}
	})
	document.getElementById("add-ind").addEventListener("click", function(ev){
		addComponents("inductors", document.getElementById("ind-input").value, "ind-tbx-flex")
		document.getElementById("ind-input").value = ""
	})
	document.getElementById("clr-ind").addEventListener("click", function(ev){
		clearComponents("inductors")
	})
	document.getElementById("ind-input").addEventListener("keydown", function(ev){
		if(ev.keyCode == 13){
			addComponents("inductors", document.getElementById("ind-input").value, "ind-tbx-flex")
			document.getElementById("ind-input").value = ""
		}
	})
	document.getElementById("calculate-btn").addEventListener("click", function(ev){
		calculate()
	})

	recoverCompFromMemory();
})