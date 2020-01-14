$(document).ready(function(){
    
    $("input[id='searchTop']").click(function(){

        tag = $("input[id='Search']").val();
        if(tag === ""){
            // alert("please fill the require field");
        }
        else{
            window.location.href = "./search"+"?tag="+tag;
        }
    });

    $("input[id='searchBottom']").click(function(){

        tag = $("input[id='Search-2']").val();
        if(tag === ""){
            // alert("please fill the require field");
        }
        else{
            window.location.href = "./search"+"?tag="+tag;
        }
    });
});
