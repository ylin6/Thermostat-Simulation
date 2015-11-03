$(function(){
    /* STATES
        0 - Main Thermostat State
        1 - Set time Thermostat state
        2 - Set Programming
    */
    
    /* TIME-STATES
        0- Hour
        1- MIN
        2- AM/PM
    */
    
    /* PROGRAMMING-STATES
        0-CYLCLE
        1-TIME-Hour
        2-TIME-MIN
        3-TIME-AMPM
        4-HCOFF
    */
    
    /* PERIODS
        0-MORNING
        1-DAY
        2-EVENING
        3-NIGHT
    */
    
    var month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
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
    var program_state = 0;
    var period = 0;
    
    
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
        snap : 0,
        value: knob_val,
        turn: function(ratio){
            //lock = $lock_switch.is(":checked");
            if(state == 0 && !lock){
                console.log(ratio);
                var t = $temp_display_big.text();
                t = parseInt(t);
                $temp_display_big.text(Math.round(50 + (49*ratio)).toString());
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
            
            else if (state == 2 && !lock && program_state == 0){
                if(Math.round(ratio*10) % 2 == 0){
                    $('#span1').removeClass('grayscale');
                    $('#span4').addClass('grayscale');
                    $('#morning-temp > div').text("75");
                    $('#day-temp > div').text("78");
                    $('#eve-temp > div').text("72");
                    $('#night-temp > div').text("71");
                }
                
                else{
                    $('#span4').removeClass('grayscale');
                    $('#span1').addClass('grayscale');
                    $('#morning-temp > div').text("72");
                    $('#day-temp > div').text("70");
                    $('#eve-temp > div').text("73");
                    $('#night-temp > div').text("75");
                }
            }
            
            else if (state == 2 && !lock && program_state == 1){
                $('#span1').text(Math.round(ratio*11 + 1).toString());
            }
            
            else if (state == 2 && !lock && program_state == 2){
                if(Math.round(ratio*59) < 10){
                    $('#span3').text("0" + Math.round(ratio*59).toString());    
                }
                
                else{
                    $('#span3').text(Math.round(ratio*59).toString());
                }
            }
            
            else if (state == 2 && !lock && program_state == 3){
                if(Math.round(ratio*10) % 2 == 0){
                    $('#span4').text("AM");
                }
                
                else{
                    $('#span4').text("PM");
                }
            }
            
            else if (state == 2 && !lock && program_state == 4){
                $('#span2').text(Math.round(40 + (50*ratio)).toString());
            }
        }
    });
    
    
    // HCOFF button Logic
    $HCOFF_BTN.click(function(e){
        e.preventDefault;
        //lock = $lock_switch.is(":checked");
        console.log(lock);
        if((!lock && state == 0) || (!lock && state == 2 && program_state == 4)){
            if(hcoff == 1){
               if(program_state == 4){
                   $('#span3 > img').attr('src', "./images/close.png");
               }
                
               console.log("Changed to Off");
               $display.removeClass("black"); 
               $display.addClass("grey");
               hcoff = 2;
            }
            
            else if (hcoff == 2){
                if(program_state == 4){
                    $('#span3 > img').attr('src', "./images/fire.png");
                }
                
                console.log("Change to Hot");
                $display.addClass("red");
                $display.removeClass("grey");
                hcoff = 0;
            }
            
            else if (hcoff == 0){
                if(program_state == 4){
                   $('#span3 > img').attr('src', "./images/snowflake.png");
                } 
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
    
    $program.click(function(e){
        e.preventDefault
        if(!lock && state == 0){
            state = 2;
            $('#time-temp').hide();
            $('#instructions').show();
            $('.programming-options').css("font-size","25px");
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
        
        else if (!lock && state == 2 && (program_state == 0 || program_state == 4)){
            if(program_state == 4){
                if(period == 0){
                    $('#morning-temp > div').text($('#span2').text());
                    $('#morning > img').attr('src', $('#span3 > img').attr('src'));
                }
                
                else if (period == 1){
                    $('#day-temp > div').text($('#span2').text());
                    $('#daytime > img').attr('src', $('#span3 > img').attr('src'));
                }
                
                else if (period == 2){
                     $('#eve-temp > div').text($('#span2').text());
                     $('#eve > img').attr('src', $('#span3 > img').attr('src'));
                }
                
                else if (period == 3){
                    $('#night-temp > div').text($('#span2').text());
                    $('#eve > img').attr('src', $('#span3 > img').attr('src')); 
                }
                
                if(period < 3){
                    period +=1;
                }

                else{
                    program_state = 0;
                    state = 0;
                    period = 0;
                    $('#span2').removeClass("program-temp");
                    $('#instructions').hide();
                    $('#time-temp').show();
                    $('#instruction').text("SELECT CYCLE");
                    $('#span1').text("WEEKDAY");
                    $('#span2').html("&nbsp");
                    $('#span3').html("&nbsp");
                    $('#span4').text("WEEKEND");
                    $('#span1').addClass("grayscale");
                    return;
                }
            }
            
            program_state = 1;
            $('.programming-options').css("font-size","35px");
            $('#instruction').text("SET START TIME");
            $('#span1').addClass("blinker");
            $('#span2').removeClass('blinker');
            $('#span2').removeClass('program-temp');
            $('#span1').removeClass("grayscale");
            $('#span4').removeClass("grayscale");
            $('#span2').text(":");
            if (period == 0){
                $display.removeClass("red"); 
                $display.removeClass("grey"); 
                $display.addClass("black");
                $('#daytime').addClass("grayscale");
                $('#eve').addClass("grayscale");
                $('#night').addClass("grayscale");
                $('#span1').text("6");
                $('#span3').text("30");
                $('#span4').text(" AM");
            }
            
            else if (period == 1){
                $display.removeClass("red"); 
                $display.removeClass("grey"); 
                $display.addClass("black");
                $('#span1').text("11");
                $('#span3').text("30");
                $('#span4').text(" AM");
                $('#daytime').removeClass("grayscale");
            }
            
            else if (period == 2){
                $display.removeClass("black"); 
                $display.removeClass("grey"); 
                $display.addClass("red");
                $('#span1').text("6");
                $('#span3').text("30");
                $('#span4').text(" PM");
                $('#eve').removeClass("grayscale");
            }
            
            else if (period == 3){
                $display.removeClass("red"); 
                $display.removeClass("grey"); 
                $display.addClass("black");
                $('#span1').text("10");
                $('#span3').text("30");
                $('#span4').text(" PM");
                $('#night').removeClass("grayscale");
            }
            
            
        }
        
        else if(!lock && state == 2 && program_state == 1){
            $('#span4').removeClass("grayscale");
            $('#span1').removeClass("blinker");
            $('#span3').addClass("blinker");
            program_state = 2;
        }
        
        else if (!lock && state ==2 && program_state == 2){
            $('#span3').removeClass("blinker");
            $('#span4').addClass("blinker");
            program_state = 3;
        }
        
        else if (!lock && state ==2 && program_state == 3){
            var time = $('#span1').text() + ":" + $('#span3').text() + " " + $('#span4').text();
            if(period == 0){
                $('#period-time-morning').text(time);
            }
            
            else if (period == 1){
                $('#period-time-day').text(time);
            }
            
            else if (period == 2){
                $('#period-time-eve').text(time);
            }
            
            else if (period == 3){
                $('#period-time-night').text(time);
            }
            
            program_state = 4;
            $('#instruction').text("SET TEMPERATURE AND MODE");
            $('#span1').empty();
            $('#span4').empty();
            $('#span3').empty();
            $('#span2').addClass("blinker");
            $('#span4').removeClass("blinker");
            $('#span2').addClass('program-temp');
            $('#span3').append("<img src=\"./images/snowflake.png\" width = \"20px\">");
            
            if(period == 0){
                $('#span2').text($('#morning-temp > div').text());
            }
            
            else if(period == 1){
                $('#span2').text($('#day-temp > div').text());
            }
            
            else if(period == 2){
                $('#span2').text($('#eve-temp > div').text());
            }
            
            else if(period == 3){
                $('#span2').text($('#night-temp > div').text());
            }
        }
        
                
    });
                
        
});
    