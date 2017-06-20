/**
 * 
 */

var defaultlimit = 20;

function onLoad()
{
	// On pressing the "Calculate" button
	document.getElementById("calculate_btn").addEventListener("click",
	function()
	{
		var results = eval_function(
		document.getElementById("calcfunction").value,	// fn
		{												// toolbox
			R: parsetoolbox(document.getElementById("resbox").value),
			C: parsetoolbox(document.getElementById("capbox").value),
			L: parsetoolbox(document.getElementById("indbox").value)
		}
		, defaultlimit);

		document.getElementById("results_form").value = results.toString();
	});
}
