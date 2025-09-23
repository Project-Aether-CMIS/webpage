currentIndex=0;
$(function(){
    const welcomeTextList = ["Welcome to Project Aether", "ようこそ。Project Aetherの世界へ", "Bienvenue au Project Aether", "Willkommen bei Project Aether", "Bienvenido a Project Aether", "Benvenuto in Project Aether", "欢迎来到Project Aether", "환영합니다, Project Aether에 오신 것을 환영합니다"];
    function updateWelcomeText(){
        currentIndex = (currentIndex + 1) % welcomeTextList.length;
        const selectedText = welcomeTextList[currentIndex];
        $('.page_title').fadeOut(1000).delay(1000).queue(function(){
            $(this).text(selectedText).fadeIn(1000).dequeue();
        })
        
    }
    setInterval(updateWelcomeText, 5000);
});