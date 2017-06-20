var resistor_sets = {
	resistors1p: [0,
	1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1,
	10, 11, 12, 13, 15, 16, 18, 20, 22, 24, 27, 30, 33, 36, 39, 43, 47, 51, 56, 62, 68, 75, 82, 91,
	100, 110, 120, 130, 150, 160, 180, 200, 220, 240, 270, 300, 330, 360, 390, 430, 470, 510, 560, 620, 680, 750, 820, 910,
	1000, 1100, 1200, 1300, 1500, 1600, 1800, 2000, 2200, 2400, 2700, 3000, 3300, 3600, 3900, 4300, 4700, 5100, 5600, 6200, 6800, 7500, 8200, 9100,
	10000, 11000, 12000, 13000, 15000, 16000, 18000, 20000, 22000, 24000, 27000, 30000, 33000, 36000, 39000, 43000, 47000, 51000, 56000, 62000, 68000, 75000, 82000, 91000,
	100000, 110000, 120000, 130000, 150000, 160000, 180000, 200000, 220000, 240000, 270000, 300000, 330000, 360000, 390000, 430000, 470000, 510000, 560000, 620000, 680000, 750000, 820000, 910000,
	1000000, 1100000, 1200000, 1300000, 1500000, 1600000, 1800000, 2000000, 2200000, 2400000, 2700000, 3000000, 3300000, 3600000, 3900000, 4300000, 4700000, 5100000, 5600000, 6200000, 6800000, 7500000, 8200000, 9100000,
	10000000]

	resistors5p:[
	1, 10, 11, 13, 15, 22, 24, 30, 33, 36, 39, 43, 47, 51, 56, 62, 75, 82, 91,
	100, 120, 150, 180, 220, 270, 330, 470, 560, 680, 820,
	1000, 1200, 1500, 1800, 2000, 2200, 2400, 3000, 3300, 3600, 3900, 4300, 4700, 5100, 6200, 6800, 7500, 8200, 9100,
	10000, 11000, 12000, 13000, 15000, 16000, 18000, 20000, 22000, 24000, 27000, 30000, 33000, 39000, 43000, 47000, 51000, 56000, 62000, 68000, 75000, 82000, 91000,
	100000, 110000, 120000, 130000, 150000, 160000, 180000, 200000, 220000, 240000, 270000, 300000, 330000, 360000, 390000, 470000, 510000, 560000, 620000, 680000, 750000, 820000, 910000,
	1000000, 1200000, 1500000, 1800000, 2200000, 2700000, 3300000, 3900000, 4700000, 5600000, 6800000, 8200000, 10000000
	]
}

var capacitor_sets = {
	capacitors_ceramic:[
	8e-13, 1e-12, 1.2e-12, 1.5e-12, 1.8e-12, 2.2e-12, 2.7e-12, 3.3e-12, 3.9e-12, 4.7e-12, 5.6e-12, 6.8e-12, 8.2e-12,
	1e-11, 1.5e-11, 1.8e-11, 2.2e-11, 2.7e-11, 3.3e-11, 3.9e-11, 4.7e-11, 5.6e-11, 6.8e-11, 8.2e-11,
	1e-10, 1.2e-10, 1.5e-10, 1.8e-10, 2.2e-10, 2.7e-10, 3.3e-10, 3.9e-10, 4.7e-10, 5.6e-10, 6.8e-10, 8.2e-10,
	1e-09, 1e-09, 1.2e-09, 1.5e-09, 1.8e-09, 2.2e-09, 2.7e-09, 3.3e-09, 4.7e-09, 6.8e-09,
	1e-08, 1.5e-08, 2.2e-08, 2.7e-08, 3.3e-08, 3.9e-08, 4.7e-08, 5.6e-08, 6.8e-08, 1e-07
	]

	capacitors_electrolytic:[
	1e-07, 1.2e-07, 1.5e-07, 2.2e-07, 3.3e-07, 4.7e-07, 8.2e-07, 1e-06, 2.2e-06, 3.3e-06, 4.7e-06, 1e-05, 2.2e-05, 3.3e-05, 4e-05, 4.7e-05, 8e-05, 0.0001, 0.00022, 0.00033, 0.00047, 0.001, 0.0022, 0.0033, 0.0047
	]
}

var formulae = {
	voltage_div:{
		formula: "[Vcc] * (R1/(R1+R2)) = [Vout]",
		restrictions: [
		]
	},

	lm317:{
		formula: "1.25*(1+(R2/R1)) = [Vout]",
		restrictions: [
			"R1 >= 100",
			"R1 <= 1000",
			"R2 <= 10000"
		]
	},

	lm2576adj:{
		formula: "1.23*(1+(R2/R1)) = [Vout]",
		restrictions: [
			"R1 >= 1000",
			"R1 <= 5000"
		]
	}
}