$(document).ready(function(){
    $("input[type='submit']").click(function(){
        tag = $("input[type='text']").val();
        if(tag === ""){
            alert("please fill the require field");
        }
        else{
            window.location.href = "./search.html"+"?tag="+tag;
        }
    });
});
