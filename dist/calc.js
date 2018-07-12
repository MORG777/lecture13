var buttons = document.getElementsByTagName('button');
var Result = '';
if(buttons && buttons.length) {
    for(var i=0; i<buttons.length; i++) {
        var btn = buttons[i];
        btn.addEventListener('click', function(event){
            var btn = event.target;
            
            var text = btn.childNodes[0].data;
            Result += text;
            document.getElementById('formula').innerHTML = Result;
            try {
                document.getElementById('result').innerHTML = eval(Result);
            } catch (e) {

            }
        });
    }
}

function showResult(){
    document.getElementById('formula').innerHTML = eval(Result);
    document.getElementById('result').innerHTML = '';
}