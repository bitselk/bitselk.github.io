let obfuscated = document.querySelectorAll(".obfuscated");
var possible = "!@#$%^&*()_=-`~";

function randText(length) {
    var text = "";
  
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    
    return text;
}
  

setInterval(function() {
    obfuscated.forEach(obj => {
        obj.textContent = randText(obj.textContent.length);
    })
}, 40);