function ECalculator(divId, engineerMode){


    var _this = this;

    _this.divId = divId;
    _this.engineerMode = engineerMode !== undefined ? engineerMode : false ;

    _this.resultDiv = undefined;
    _this.formulaDiv = undefined;
    _this.historyDiv = undefined;

    
    /**
     * formula string
     */
    _this.formulaString = '';



    /**
     * some kind of history
     */
    _this.actors = [];


    /**
     * 
     */
    _this.result = null;

    /**
     * just container for complex numbers
     */
    _this.numCell = '';

    /**
     * add number to result
     */
    _this.plusAction = function(firstActor, secondActor) {
        return firstActor + secondActor;
    }

    /**
     * 
     */
    _this.minusAction = function(firstActor, secondActor) {
        return firstActor - secondActor;
    }

    /**
     * 
     */
    _this.multiAction = function(firstActor, secondActor) {
        return firstActor * secondActor;
    }

    /**
     * 
     */
    _this.delimiterAction = function(firstActor, secondActor) {
        return firstActor / secondActor;
    } 
    
    /**
     * 
     */
    _this.sqrtAction = function(firstActor, secondActor) {
        secondActor = secondActor ? secondActor : 2 ;
        return Math.pow(firstActor, 1/secondActor);
    }

    /**
     * 
     */
    _this.lnAction = function(firstActor) {
        return Math.log(firstActor);
    }

    /**
     * 
     */
    _this.factorialAction = function(firstActor) {
        var res = 1;
        for(var i = 1; i <= firstActor; i++) {
            res = res * i;
        }
        return res;
    }

    /**
     * 
     */
    _this.powAction = function(firstActor, secondActor){
        secondActor = secondActor ? secondActor : 2 ;
        return Math.pow(firstActor, secondActor);
    }



    /**
     * show results in field
     */
    _this.displayResult = function() {

        _this.formulaDiv.innerHTML = _this.actors.join(' ');
        
        if(_this.result != NaN && parseFloat(_this.result)) {
            _this.resultDiv.innerHTML = _this.result;
        }
        _this.historyDiv.innerHTML = _this.actors.join('<br/>');

    }

    /**
     * reset numCell
     */
    _this.clearNumCell = function() {
        _this.numCell = '';
    }

    /**
     * if more than one digit in number
     */
    _this.updateNumCell = function(symbol) {

        symbol = typeof symbol === 'string' ? symbol : symbol.target.childNodes[0].data ;
        

        _this.numCell += symbol;
        _this.displayResult();
        _this.formulaDiv.innerHTML = _this.formulaDiv.innerHTML + _this.numCell;
        
    }

    /**
     * 
     */
    _this.pushNumCellToActors = function() {
        if(_this.numCell && parseFloat(_this.numCell)) {
            _this.actors.push( parseFloat(_this.numCell) );
            _this.numCell = '';
        }
    }

    /**
     * initiate calculator
     */
    _this.init = function() {

        _this.buildCalculator(_this.divId, _this.engineerMode);

        /**
         * attach number button click
         */
        var num_btns = document.querySelectorAll('#' + _this.divId + ' .number');
        if(num_btns && num_btns.length) {
            for(var i = 0; i < num_btns.length; i++) {
                num_btns[i].addEventListener('click', _this.updateNumCell);
            }
        }

        /**
         * attach math actions button click
         */
        var act_btns = document.querySelectorAll('#' + _this.divId + ' .m_action');
        if(act_btns && act_btns.length) {
            for(var i=0; i < act_btns.length; i++) {
                act_btns[i].addEventListener('click',  _this.mathAction);
            }
        }

        /**
         * attach events for equal and clear btns
         */
        var eq_btn = document.querySelectorAll('#' + _this.divId + ' .showResult')[0];
        eq_btn.addEventListener('click', _this.calculate)

        var clear_btn = document.querySelectorAll('#' + _this.divId + ' .clear')[0];
        clear_btn.addEventListener('click', _this.reset)
    }
    /**
     * @returns boolean true if last history record was math action
     */
    _this.checkLas_thistoryIsAction = function() {
        if(!_this.actors || !_this.actors.length) {
            return false;
        } else {
            var lastAct = _this.actors[ _this.actors - 1 ];
            return _this.availableHandlers.hasOwnProperty( lastAct );
        }
    }

    /**
     * 
     */
    _this.mathAction = function( action ) {
        
        action = typeof action === 'string' ? action : action.target.childNodes[0].data;

        _this.pushNumCellToActors();

        if(_this.checkLas_thistoryIsAction()) {
            // rewrite last action with new one
            _this.actors[ _this.actors.length - 1 ] = action;
        } else {
            _this.actors.push(action);
        }
        _this.calculate();
    }

    /**
     * 
     */
    _this.availableHandlers = {
        '+' : _this.plusAction,      // calc summ
        '-' : _this.minusAction,     // calc diff
        '*' : _this.multiAction,     // multiply action
        '/' : _this.delimiterAction, // delimiter action
        '√' : _this.sqrtAction,      // sqrt
        'ln': _this.lnAction,        // ln
        'n!': _this.factorialAction, // factorial 
        'x^2' : _this.powAction,     // pow    



    };
    // actions, requires 2 parameters  
    _this.twoActorsActions = {
        '+': '',    
        '-': '',
        '*': '',
        '/': '',
    };


    /**
     * 
     */
    _this.calculate = function () {
        if (_this.numCell && _this.numCell != '') {
            _this.pushNumCellToActors();
        }
        /** == Simple calculator
        try {
            _this.result = eval(_this.actors.join(''));
        } catch (e) {

        }
        */
        _this.result = _this.actors[0];
        
        // first actor is already in result
        for(var i = 1; i < _this.actors.length; i++) {
            if(_this.availableHandlers.hasOwnProperty(_this.actors[i])) {
                // call math handler
                if(_this.twoActorsActions.hasOwnProperty(_this.actors[i])) {
                    // use 2 numbers and skip next stage
                    _this.result = _this.availableHandlers[ _this.actors[i] ](_this.result, _this.actors[++i]);
                } else {
                    _this.result = _this.availableHandlers[ _this.actors[i] ](_this.result);
                }
                
            }
        }


        _this.displayResult();
    }

    _this.reset = function() {
        _this.actors = [];
        _this.result = 0;
        _this.numCell = '';
        _this.displayResult();
        _this.resultDiv.innerHTML='';
    }

    /**
     * some kind of Builder pattern
     */
    _this.buildCalculator = function(containerId, engineerMode) {
        var html = `
        <div class="calcWrapper">
            <div class="history"></div>
            <div class="formula"></div>
            <div class="result"></div>
            <div class="buttons">
                <div class="btn_row">
                    <button class="clear">C</button>
                </div>` +
                ( engineerMode === true ?
                `<div class="ing_mode btn_row">
                    <button class="m_action">√</button>
                    <button class="m_action">ln</button>
                    <button class="m_action">n!</button>
                    <button class="m_action">x^2</button>
                </div>` : '' ) +
                `<div class="btn_row">
                    <button class="number">7</button>
                    <button class="number">8</button>
                    <button class="number">9</button>
                    <button class="m_action action_plus">+</button><br/>
                </div>
                <div class="btn_row">
                    <button class="number">4</button>
                    <button class="number">5</button>
                    <button class="number">6</button>
                    <button class="m_action action_minus">-</button><br/>
                </div>
                <div class="btn_row">
                    <button class="number">1</button>
                    <button class="number">2</button>
                    <button class="number">3</button>
                    <button class="m_action action_multiply">*</button><br/>
                </div>
                <div class="btn_row">
                    <button class="number">0</button>
                    <button class="number">.</button>
                    <button class="m_action action_ceil">/</button>
                    <input type="button" value="=" class="showResult" /><br/>
                </div>
            </div>
        </div>`;

        document.getElementById(containerId).innerHTML = html;

        _this.resultDiv = document.querySelectorAll('#' + _this.divId + ' .result')[0];
        _this.formulaDiv = document.querySelectorAll('#' + _this.divId + ' .formula')[0];
        _this.historyDiv = document.querySelectorAll('#' + _this.divId + ' .history')[0];
        

    }

  
}
