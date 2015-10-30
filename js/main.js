$(function(){
    /* STATES
        0 - Main Thermostat State
        1 - Set time Thermostat state
    */
    
    /* TIME-STATES
        0- Hour
        1- MIN
        2- AM/PM
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
    var knob_val = 235;
    var time_state = 0;
    var $ok_button = $('.ok-button');
    
    // Lock Switch button logic
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
    
    
    // Control Knob Button Logic
    $control.knobKnob({
        snap : 10,
        value: knob_val,
        turn: function(ratio){
            //lock = $lock_switch.is(":checked");
            if(state == 0 && !lock){
                console.log(ratio);
                var t = $temp_display_big.text();
                t = parseInt(t);
                $temp_display_big.text(Math.round(40 + (50*ratio)).toString());
            }
            
            else if (state == 1 && !lock && time_state == 0){
                $('#set-time-hour').text(Math.round(ratio*11 + 1).toString());
            }
            
            else if (state == 1 && !lock && time_state == 1){
                if(Math.round(ratio*59) < 10){
                     $('#set-time-min').text("0" + Math.round(ratio*59).toString());    
                }
                
                else{
                     $('#set-time-min').text(Math.round(ratio*59).toString());
                }
            }
            
            else if (state == 1 && !lock && time_state == 2){
                if(Math.round(ratio*10) % 2 == 0){
                    $('#AMPM').text("AM");
                }
                
                else{
                    $('#AMPM').text("PM");
                }
            }
        }
    });
    
    
    // HCOFF button Logic
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
    
    // Set-time-button logic
    $set_time_btn.click(function(e){
        e.preventDefault;
        if (!lock && state == 0){
            state = 1;
            time_state = 0;
            $('#state0').hide(); 
            $('#state1').show();
            $('#set-time-hour').addClass("blinker");
        }
    });
    
    
    $ok_button.click(function(e){
        e.preventDefault;
        if(!lock && state == 1){
            if (time_state == 0){
                $('#set-time-hour').removeClass("blinker");
                $('#set-time-min').addClass("blinker");
                time_state = 1;
                
            }
            else if (time_state == 1){
                $('#set-time-min').removeClass("blinker");
                $('#AMPM').addClass("blinker");
                time_state = 2;
            }
            
            else if (time_state == 2){
                time_state = 0;
                state = 0;
                $('#AMPM').removeClass("blinker");
                var time = $('#set-time-hour').text() + ":" + $('#set-time-min').text() + " " + $('#AMPM').text();
                $('#time').text(time);
                $('#state0').show(); 
                $('#state1').hide();
            }
        }
    });
                
        
});
    