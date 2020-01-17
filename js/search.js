


var page = 1;
var page_limit = 1;
var cors = 'https://cors-owner.herokuapp.com/';
var serpKey = "e1fc43afca1840182686116921ebf544";
var count = 0;
var pageNum = 15;



$(document).ready(function(){
    var tag = "";
    if(getAllUrlParams(window.location.href).tag){
        tag = getAllUrlParams(window.location.href).tag;
        tag = tag.replace(/%20/g," ");
    }
    if(tag != "" && tag!='undefined'){
        $("input[type='text']").val(tag);
        twitterListScrapper(tag);
    }
    $("input[type='submit']").click(function(){
        tag = $("input[type='text']").val();
        if(tag === ""){
            alert("please fill the require field");
        }
        else{
            $(".w-form-fail").css("display","none");
            twitterListScrapper(tag);
        }
    });

    function twitterListScrapper(tag){
        var query1 = 'site:twitter.com+inurl:lists+inurl:members+inurl:'+tag;
        var KEY = 'AIzaSyAJ1YgSPZqW3L9DYj0Dt3-7SIS-9DkdY_o';
        var CSE = '008339465705695129377:am1dhr088yu';
        var api = "https://www.googleapis.com/customsearch/v1?key="
                  + KEY + "&cx=" + CSE + "&q=" + query1;

     
        
        count = 0;
        page = 1;

        var query = 'site:twitter.com inurl:lists -inurl:members -inurl:subscribers inurl:'+tag+'&num='+pageNum;
        
        var serpStack = 'https://api.serpstack.com/search?access_key='+serpKey+'&page=1&query='+query;
        
        var result_holder = $(".results-holder");
        result_holder.html('<div class="load-more"><div>');
        var search_result = 'Showing results for <span class="search-term">'+tag+'</span>';
        
        var load_more = $(".load-more");
        load_more.html('<i class="fa fa-spinner fa-spin fa-3x"></i>');

        $(".results-amount").html(search_result);
        $(".number-of-results").text(count);
        $(".search-term").text(tag);
    
        
        try{
            $(".number-of-results").text(count);
            $(".search-term").text(tag);
            page ++;
            $.get(serpStack,function(response){
                
                // console.log(response);
                if(response.organic_results){
                    var page_result = response.organic_results;
                    if(response.pagination){
                        page_limit = Object.keys(response.pagination.other_page_urls).length + 1;
                    }
    
                    page_result.forEach(result => {
                        // console.log(result);
                        var fetch_url = cors + result.url;
                        fetch(fetch_url, {muteHttpExceptions: true})
                        .then((res)=>res.text())
                        .then((text)=>{
                            const otherDoc = document.implementation.createHTMLDocument("Foo").documentElement;
                            // console.log(text);
                            otherDoc.innerHTML = text;
                            
                            listDetails = otherDoc.querySelector(".js-list-details");
                            if(listDetails){
                                
                                count ++;
                                $(".number-of-results").text(count);
            
                                name = listDetails.querySelector(".js-list-name").innerText;
                                avatar = listDetails.querySelector(".avatar").src;
                                avatar_lg = avatar.replace("_normal","_400x400");
                                description = listDetails.querySelector(".description").innerText;
                                stats = listDetails.querySelector(".stats");
                                members = stats.getElementsByTagName("strong")[0].innerText;
                                subscribers = stats.getElementsByTagName("strong")[1].innerText;
                
                                // console.log("link",result.url);
                                // console.log("name",name);
                                // console.log("avatar",avatar);
                                // console.log("description",description);
                                // console.log("members",members);
                                // console.log("subscribers",subscribers);
            
                                var result_html = '<div class="result"><div class="top-content"><div class="img" style="background-image:url('+avatar_lg+
                                    '"></div><div class="list-name">'+name+
                                    '</div></div><div class="list-stats"><div class="half left"><div><strong class="bold">'+members+
                                    '</strong> members</div></div><div class="half"><div><strong class="bold">'+subscribers+
                                    '</strong> subscribers</div></div></div><div class="lower-content"><a href="'+result.url+
                                    '" class="list-link">'+result.url+'</a><p class="list-description">'+description+
                                    '</p><div ms-hide="download-gate" class="premium-div"><a onClick="memberDetails(\''+result.url+'\')" class="download-cta w-button">Download List</a></div>'+
                                    '<div ms-hide-element="true" class="free-div"><img src="images/icons8-error-64.png" width="32" alt="" class="warning">'+
                                    '<div>You need to be on the premium plan to download this list. <a href="join.html" class="color-link">Join now</a></div>'+
                                    '</div></div></div>';

                                load_more.before(result_html);
                                if(page<=page_limit){
                                    var laod_more_html = '<a onClick="loadMore(\''+ tag+'\')" class="load w-button">Load more</a>';
                                    load_more.html(laod_more_html);
                                }
                                else{
                                    load_more.html("");
                                }
                            }
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                    });
                }
                else{
                    load_more.html("");
                }
            })
            .catch(error=>{
                console.log(error);
            })
    
        }
        catch(error){
            console.log(error);
        }
        
    }
    

});
function loadMore(tag){

    var query = 'site:twitter.com inurl:lists -inurl:members -inurl:subscribers inurl:'+tag+'&num='+pageNum;
        
    var serpStack = 'https://api.serpstack.com/search?access_key='+serpKey+'&page='+page+'&query='+query;

    var load_more = $(".load-more");
    load_more.html('<i class="fa fa-spinner fa-spin fa-3x"></i>');

    page ++;
    $.get(serpStack,function(response){
        var page_result = response.organic_results;
        page_result.forEach(result => {
            // console.log(result);
            var fetch_url = cors + result.url;
            fetch(fetch_url, {muteHttpExceptions: true})
            .then((res)=>res.text())
            .then((text)=>{
                const otherDoc = document.implementation.createHTMLDocument("Foo").documentElement;
                // console.log(text);
                otherDoc.innerHTML = text;
                
                listDetails = otherDoc.querySelector(".js-list-details");
                if(listDetails){
                    
                    count ++;
                    $(".number-of-results").text(count);

                    name = listDetails.querySelector(".js-list-name").innerText;
                    avatar = listDetails.querySelector(".avatar").src;
                    avatar_lg = avatar.replace("_normal","_400x400");
                    description = listDetails.querySelector(".description").innerText;
                    stats = listDetails.querySelector(".stats");
                    members = stats.getElementsByTagName("strong")[0].innerText;
                    subscribers = stats.getElementsByTagName("strong")[1].innerText;
    
                    console.log("link",result.url);
                    console.log("name",name);
                    console.log("avatar",avatar);
                    console.log("description",description);
                    console.log("members",members);
                    console.log("subscribers",subscribers);

                    var result_html = '<div class="result"><div class="top-content"><div class="img" style="background-image:url('+avatar_lg+
                    '"></div><div class="list-name">'+name+
                    '</div></div><div class="list-stats"><div class="half left"><div><strong class="bold">'+members+
                    '</strong> members</div></div><div class="half"><div><strong class="bold">'+subscribers+
                    '</strong> subscribers</div></div></div><div class="lower-content"><a href="'+result.url+
                    '" class="list-link">'+result.url+'</a><p class="list-description">'+description+
                    '</p><div ms-hide="download-gate" class="premium-div"><a onClick="memberDetails(\''+result.url+'\')" class="download-cta w-button">Download List</a></div>'+
                    '<div ms-hide-element="true" class="free-div"><img src="images/icons8-error-64.png" width="32" alt="" class="warning">'+
                    '<div>You need to be on the premium plan to download this list. <a href="join.html" class="color-link">Join now</a></div>'+
                    '</div></div></div>';
                    
                    load_more.before(result_html);

                    if(page<=page_limit){
                        var laod_more_html = '<a onClick="loadMore(\''+ tag+'\')" class="load w-button">Load more</a>';
                        load_more.html(laod_more_html);
                    }
                    else{
                        load_more.html("");
                    }
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        });
    })
    .catch(errorr=>{
        console.log(errorr);
    });
}
async function memberDetails(url){

  var members;
  var subscribers;
    
  //Twitter Oauth 1.0 credentials
  var consumer_key = '4gom0xAXsMsnx9G03o4sW0yaF';
  var consumer_secret = 'GSF0v4gNbVvAb4Z2h7PV90VZOslt3pdghO2KH5AZqtzKTUwUWD';
  var user_token = '1018446367-UX77lcltwgtytQCAM3YJqBjnmwTribhRtvBv1QB';
  var user_secret = 'MH67yM9osJCw5DcgDZDyr9NYSbJ2UNJRcWNMIN4mRnAVl';
  var oauth_method = 'HMAC-SHA1';
  var oauth_version = '1.0';
  var time_stamp = Math.round(+new Date()/1000);
  var nonce  = randomString(10);

  var indexOfLists = url.indexOf("/lists");
  var owner_screen_name= url.substr(20, indexOfLists-20);
  var slug = url.substr((indexOfLists+7));
  var count = 5000;

  var rows = [['List URL','List name','Type','Twitter handle','Name','Location','Description','Profile URL','Followers','Following','Statuses']]

  // get members
  var api = 'https://api.twitter.com/1.1/lists/members.json';
  var query = 'slug='+slug+'&owner_screen_name='+owner_screen_name+'&count='+count;
  var parameter_string = "count="+count+"&oauth_consumer_key="+consumer_key+"&oauth_nonce="+nonce
  +"&oauth_signature_method="+oauth_method+"&oauth_timestamp="+time_stamp+"&oauth_token="+user_token+"&oauth_version="+oauth_version
  +"&owner_screen_name="+owner_screen_name+"&slug="+slug;
  var base = "GET&"+encodeURIComponent(api)+"&"+encodeURIComponent(parameter_string);

  var secret = consumer_secret + "&" + user_secret;
  var signature = CryptoJS.HmacSHA1(base,secret);
  var oauth_signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(signature));
  var Authorization = "OAuth oauth_consumer_key=\""+consumer_key+"\",oauth_token=\""+user_token+"\",oauth_signature_method=\""+oauth_method+"\",oauth_timestamp=\""+time_stamp+"\",oauth_nonce=\""+nonce+"\",oauth_version=\""+oauth_version+"\",oauth_signature=\""+oauth_signature+"\"";
  
  var settings = {
      "async": true,
      "crossDomain": true,
      "url": cors+api+'?'+query,
      "method": "GET",
      "headers": {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Authorization": Authorization,
        "Accept": "*/*",
        "Cache-Control": "no-cache"
      }
  }

  $.ajax(settings).done(function (response) {

      group = response.users;
      var members = [];
        
      for(var j = 0; j < group.length; j++){
        var member = group[j];    
        rows.push([
          url,
          slug,
          'member',
          '@'+member.screen_name,
          member.name,
          member.location,
          member.description,
          'https://www.twitter.com/'+member.screen_name,
          member.followers_count,
          member.friends_count,
          member.statuses_count
        ]);
      }

                    // get subscribers
            api = 'https://api.twitter.com/1.1/lists/subscribers.json';
            query = 'slug='+slug+'&owner_screen_name='+owner_screen_name+'&count='+count;
            parameter_string = "count="+count+"&oauth_consumer_key="+consumer_key+"&oauth_nonce="+nonce
        +"&oauth_signature_method="+oauth_method+"&oauth_timestamp="+time_stamp+"&oauth_token="+user_token+"&oauth_version="+oauth_version
        +"&owner_screen_name="+owner_screen_name+"&slug="+slug;
            base = "GET&"+encodeURIComponent(api)+"&"+encodeURIComponent(parameter_string);

            secret = consumer_secret + "&" + user_secret;
            signature = CryptoJS.HmacSHA1(base,secret);
            oauth_signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(signature));
            Authorization = "OAuth oauth_consumer_key=\""+consumer_key+"\",oauth_token=\""+user_token+"\",oauth_signature_method=\""+oauth_method+"\",oauth_timestamp=\""+time_stamp+"\",oauth_nonce=\""+nonce+"\",oauth_version=\""+oauth_version+"\",oauth_signature=\""+oauth_signature+"\"";
        
            settings = {
            "async": true,
            "crossDomain": true,
            "url": cors+api+'?'+query,
            "method": "GET",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Authorization": Authorization,
                "Accept": "*/*",
                "Cache-Control": "no-cache"
            }
        }

        $.ajax(settings).done(function (response) {
            subscribers = response.users;
                
            for(var j = 0; j < subscribers.length; j++){
                var subscriber = subscribers[j];    
                rows.push([
                url,
                slug,
                'subscriber',
                '@'+subscriber.screen_name,
                subscriber.name,
                subscriber.location,
                subscriber.description,
                'https://www.twitter.com/'+subscriber.screen_name,
                subscriber.followers_count,
                subscriber.friends_count,
                subscriber.statuses_count
                ]);
            }

            var filename = slug+".csv";
            exportToCsv(filename,rows);
        });
    });
}
function getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  
    // we'll store the parameters here
    var obj = {};
  
    // if query string exists
    if (queryString) {
  
      // stuff after # is not part of query string, so get rid of it
      queryString = queryString.split('#')[0];
  
      // split our query string into its component parts
      var arr = queryString.split('&');
  
      for (var i = 0; i < arr.length; i++) {
        // separate the keys and the values
        var a = arr[i].split('=');
  
        // set parameter name and value (use 'true' if empty)
        var paramName = a[0];
        var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
  
        // (optional) keep case consistent
        paramName = paramName.toLowerCase();
        if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
  
        // if the paramName ends with square brackets, e.g. colors[] or colors[2]
        if (paramName.match(/\[(\d+)?\]$/)) {
  
          // create key if it doesn't exist
          var key = paramName.replace(/\[(\d+)?\]/, '');
          if (!obj[key]) obj[key] = [];
  
          // if it's an indexed array e.g. colors[2]
          if (paramName.match(/\[\d+\]$/)) {
            // get the index value and add the entry at the appropriate position
            var index = /\[(\d+)\]/.exec(paramName)[1];
            obj[key][index] = paramValue;
          } else {
            // otherwise add the value to the end of the array
            obj[key].push(paramValue);
          }
        } else {
          // we're dealing with a string
          if (!obj[paramName]) {
            // if it doesn't exist, create property
            obj[paramName] = paramValue;
          } else if (obj[paramName] && typeof obj[paramName] === 'string'){
            // if property does exist and it's a string, convert it to an array
            obj[paramName] = [obj[paramName]];
            obj[paramName].push(paramValue);
          } else {
            // otherwise add the property
            obj[paramName].push(paramValue);
          }
        }
      }
    }
  
    return obj;
  }

  function exportToCsv(filename, rows) {
    var processRow = function(row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], {
        type: 'text/csv;charset=utf-8;'
    });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

function randomString(len) {
    var text = "";
    
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    for (var i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
  }
  