import ECalculator from './calculator/engeener';
import switchTheme from './ThemeSwitcher';

var calcE = new ECalculator('Engineer', true);
calcE.init();


var calcS = new ECalculator('Simple', false);
calcS.init();
