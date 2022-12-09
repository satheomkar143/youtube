const tabsBox = document.querySelector(".tabs-box");
const arrow = document.querySelectorAll(".icon i");
let isDragging = false;

const dragging = (e)=>{

  if(isDragging){
    console.log("dragging");
    tabsBox.classList.add("dragging");
    tabsBox.scrollLeft -= e.movementX;
    handleIcon();
  }
}

tabsBox.addEventListener("mousemove", dragging);
tabsBox.addEventListener("mousedown", ()=>{isDragging=true});
tabsBox.addEventListener("mouseup", ()=>{
  isDragging=false;
  tabsBox.classList.remove("dragging");
});

arrow.forEach(icon => {
  icon.addEventListener("click", ()=>{
    console.log(icon.id);
    tabsBox.scrollLeft += icon.id === "left" ? -200:200;
    setTimeout(() => handleIcon(),50);
  })
});

const handleIcon = () =>{
  let scrollVal = Math.round(tabsBox.scrollLeft);
  let maxScrollVal =tabsBox.scrollWidth -tabsBox.clientWidth;
  
  arrow[0].parentElement.style.display = scrollVal > 0 ? "flex" : "none"; 
  arrow[1].parentElement.style.display = maxScrollVal > scrollVal ? "flex" : "none"; 
  
}