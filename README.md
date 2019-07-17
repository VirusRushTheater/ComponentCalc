# Component calculator #
This is a toolkit to aid in choosing a good combination of passive components (resistors, capacitors, inductors) for any purpose you want.

Often, when choosing components you need to specify values that follow ratio rather than a value in particular, such as in voltage dividers, RC filters or LC oscillators.

## Want to try it? ##
Go to https://virusrushtheater.github.io/ComponentCalc/

## How to use it ##
1. Identify the components you need. Say, you want a voltage divider. In that case you need two resistors: Label them as R1 and R2.
2. Identify the components you got in your toolbox and put them in the fields that appear in the *Toolbox* section in the bottom of the page. *Often you need to order these components from a store. In that case it's suggested to use standard component values: A power of 10 multiplied by a series of predefined values: E6 and E12 are the most common.*
3. Define the mathematical relations they must follow.
4. Define a restriction for each component (optional)
5. Press the "Calculate" button.
6. Matches will appear below, each with a compliance percentage. The closest all components reach to 100%, the better combination it is.

## How to write the "functions" ##
Just label your components as R1, R2, C1, C2, L1, L2, etc.
For example if you want to make a voltage divider that give a total resistance of 10kΩ use two functions:
* `R1 + R2 = 10k`
* `R1 / (R1 + R2) = 0.8`

## Will I update it? ##
I doubt that I update this project any longer. I would like to make it a desktop application because, as the calculations become orders of magnitude more complex the more components you want to include in your calculations, I'd like to use the full power of multiple CPUs, several threads and graphic cards to achieve that. In other words, it would be more suited for a C++ project than a Javascript one.

However, if you don't need anything too complex, use this instead, it's fitted for that purpose.

## Appendix: Common component values ##
Common component values to copy and paste into the *Toolbox* section.
### Electrolytic and Tantalum capacitors (E6 series) ###
```
1.0uF 1.5uF 2.2uF 3.3uF 4.7uF 6.8uF 10uF 15uF 22uF 33uF 47uF 68uF 100uF 150uF 220uF 330uF 470uF 680uF 1000uF 1500uF 2200uF 3300uF 4700uF 6800uF
```
### Ceramic capacitors (E12 series) ###
```
1.0pF 1.2pF 1.5pF 1.8pF 2.2pF 2.7pF 3.3pF 3.9pF 4.7pF 5.6pF 6.8pF 8.2pF 10pF 12pF 15pF 18pF 22pF 27pF 33pF 39pF 47pF 56pF 68pF 82pF 100pF 120pF 150pF 180pF 220pF 270pF 330pF 390pF 470pF 560pF 680pF 820pF 1.0nF 1.2nF 1.5nF 1.8nF 2.2nF 2.7nF 3.3nF 3.9nF 4.7nF 5.6nF 6.8nF 8.2nF 10nF 12nF 15nF 18nF 22nF 27nF 33nF 39nF 47nF 56nF 68nF 82nF 100nF 
```
### Carbon 1/4W Resistors (E12 series) ###
```
1.0 1.2 1.5 1.8 2.2 2.7 3.3 3.9 4.7 5.6 6.8 8.2 10 12 15 18 22 27 33 39 47 56 68 82 100 120 150 180 220 270 330 390 470 560 680 820 1.0k 1.2k 1.5k 1.8k 2.2k 2.7k 3.3k 3.9k 4.7k 5.6k 6.8k 8.2k 10k 12k 15k 18k 22k 27k 33k 39k 47k 56k 68k 82k 100k 120k 150k 180k 220k 270k 330k 390k 470k 560k 680k 820k 1.0M 1.2M 1.5M 1.8M 2.2M 2.7M 3.3M 3.9M 4.7M 5.6M 6.8M 8.2M 10M 
```