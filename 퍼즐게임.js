"use strict";

const container = document.querySelector(".image-container");
const startButton = document.querySelector(".start-button");
const gameText = document.querySelector(".game-text");
const playTime = document.querySelector(".play-time");
const tileCount = 16;
const dragged = {
  // 드래그 된 요소
  el: null,
  class: null,
  index: null,
};

let tiles = [];
let isPlaying = false;
let timeInterval = null;
let time = 0;

function setGame() {
  isPlaying = true;
  time = 0;
  gameText.style.display = 'none';
  clearInterval(timeInterval);
  timeInterval = setInterval(() => {
    playTime.innerText = time;
    time += 1;
  }, 1000);
  container.innerHTML = ""; // 시작할때마다 초기화
  tiles = createImageTiles(); // 처음은 제자리에
  tiles.forEach((tile) => container.appendChild(tile));
  setTimeout(() => {
    container.innerHTML = "";
    shuffle(tiles).forEach((tile) => {
      container.appendChild(tile);
    });
  }, 3000); // 1초 뒤에 섞임
}

function createImageTiles() {
  // 타일 이미지 만들기
  const tempArray = [];
  Array(tileCount)
    .fill()
    .forEach((e, i, a) => {
      //리스트 태그들을 자바스크립트로 생성
      const li = document.createElement("li");
      li.setAttribute("data-index", i);
      li.setAttribute('draggable',true);
      li.classList.add(`list${i}`);
      tempArray.push(li);
    });
  return tempArray;
}

// 퍼즐 순서 섞기
function shuffle(array) {
  let lastIndex = array.length - 1;
  while (lastIndex > 0) {
    const randomIndex = Math.floor(Math.random() * (lastIndex + 1));
    [array[lastIndex], array[randomIndex]] = [
      array[randomIndex],
      array[lastIndex],
    ];
    lastIndex -= 1;
  }
  return array;
}

function checkStatus() {
    // 몇개 모양을 맞췄는지
    const currentList = [...container.children];
    const unMatchedList = currentList.filter((child, index) => {
      return Number(child.getAttribute("data-index")) !== index;
    });
    if (unMatchedList.length === 0) {
      gameText.style.display = "block";
      isPlaying = false;
      clearInterval(timeInterval);
    }
  }

container.addEventListener("dragstart", (e) => {
  if (!isPlaying) return;
  const obj = e.target;
  dragged.el = obj;
  dragged.class = obj.className;
  dragged.index = [...obj.parentNode.children].indexOf(obj);
}); // parentNode.children 하면 자식요소들이 객체에 담김

container.addEventListener("dragover", (e) => {
  e.preventDefault(); //드래그 되는 동안은 이벤트 발생 x
});

container.addEventListener("drop", (e) => {
  const obj = e.target;
  if (obj.className !== dragged.class) {
    // 다른곳으로 이동하면
    let originPlace;
    let isLast = false;

    if (dragged.el.nextSibling) {
      // 다음이 있으면
      originPlace = dragged.el.nextSibling;
    } else {
      originPlace = dragged.el.previousSibling;
      isLast = true;
    }
    const droppedIndex = [...obj.parentNode.children].indexOf(obj);
    dragged.index > droppedIndex
      ? obj.before(dragged.el)
      : obj.after(dragged.el);
    isLast ? originPlace.after(obj) : originPlace.before(obj);
  }
  checkStatus();
});

startButton.addEventListener("click", () => {
    setGame();
  });



