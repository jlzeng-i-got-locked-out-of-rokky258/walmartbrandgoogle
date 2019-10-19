window.addEventListener('load',()=> {
    let elements = document.querySelectorAll("main *");
    for (let el of elements) {
        let amount = Math.floor((Math.random() * 2 - 1) / 2); 
        el.style.transform = `rotate(${amount}deg)`;
    }
})