$(function(){
    /* STATES
        0 - Main Thermostat State
    */
    
    var lock = 0;
    var state = 0;
    var hcoff = 1; // H-0, C-1, OFF-2
    var $lock_switch = $('#lock-switch');
    var $control = $('#control'); 
    var $program = $('#program-button');
    var $set_time_btn = $('#set-time-button');
    var $HCOFF_BTN = $('#HCOFF-button'); 
    var $display = $('#display');
    var $temp_display_big = $('#temp-display-big');
    var $program_chart = $('.program');
    $lock_switch.change(
        function(){
            if (this.checked) {
                lock = 1;
                $program_chart.animate({
                    opacity: "0.2",
                });
                $program_chart.addClass("darker");
                
            }
        
            else{
                lock = 0;
                $program_chart.animate({
                    opacity: "1.0"
                });
                $program_chart.removeClass("darker");
            }
    });
    
    $control.knobKnob({
        snap : 10,
        value: 235,
        turn: function(ratio){
            //lock = $lock_switch.is(":checked");
            if(state == 0 && !lock){
                console.log(ratio);
                var t = $temp_display_big.text();
                t = parseInt(t);
                $temp_display_big.text(Math.round(40 + (50*ratio)).toString());
            }
        }
    });
    
    $HCOFF_BTN.click(function(e){
        e.preventDefault;
        //lock = $lock_switch.is(":checked");
        console.log(lock);
        if(!lock && state == 0){
            if(hcoff == 1){
               console.log("Changed to Off");
               $display.removeClass("black"); 
               $display.addClass("grey");
               hcoff = 2;
            }
            
            else if (hcoff == 2){
                console.log("Change to Hot");
                $display.addClass("red");
                $display.removeClass("grey");
                hcoff = 0;
            }
            
            else if (hcoff == 0){
                console.log("Change to Cool");
                $display.removeClass('red');
                $display.addClass('black');
                hcoff =1;
            }
        }
    });
        
});
    