const wordInput = document.querySelector('.word-input');
const wordDisplay = document.querySelector('.word-display');
const scoreDisplay = document.querySelector('.score');
const timeDisplay = document.querySelector('.time');
const btn = document.querySelector('.btn');
const gameTime = 9;

let score = 0;
let time = 9;  // 제한시간 setInterval로 구현
let isPlaying = false; // 게임 진행 중인지를 의미
let timeInterval;
let words = [];
let checkInterval;


init(); // 렌더링이 되면 단어들 불러오기
function getWords() {
    axios.get('https://random-word-api.herokuapp.com/word?number=100')
        .then(function (response) {
            response.data.forEach((word) => {
                if (word.length <= 10) {
                    words.push(word);
                }
            })
            btnChange('게임시작');
        })
        .catch(function (error) {
            console.log(error);
        })
    btnChange('게임시작');
}

function init() {
    btnChange('게임준비')
    getWords();
    wordInput.addEventListener('keyup', (e) => {
        if (isPlaying) {
            if (e.keyCode === 13) { // 엔터를  눌렀을때
                if (e.target.value.toLowerCase() === wordDisplay.innerText.toLowerCase()) {
                    score += 1;
                    scoreDisplay.innerText = score; // 점수가 오른 걸 반영
                    wordInput.value = '';  // 한 번 입력한 뒤에는 초기화
                    const randomIndex = Math.floor(Math.random() * words.length);
                    wordDisplay.innerText = words[randomIndex];
                }
            }
        }
    })
}


btn.addEventListener('click', (e) => { // 게임 시작 버튼
    if (isPlaying) {
        return;
    }
    if (btn.innerText === '게임시작') {
        const randomIndex = Math.floor(Math.random() * words.length);
        wordDisplay.innerText = words[randomIndex];
    }
    wordInput.value = '';
    score = 0 ;
    wordInput.focus();
    isPlaying = true;
    time = gameTime;
    timeInterval = setInterval(countDown, 1000); // 1초마다 카운트 다운을 실행
    scoreDisplay.innerText = 0;
    btnChange('게임중')
    checkInterval = setInterval(checkStatus, 50);
})


function countDown() { //게임이 시작하면 카운트다운도 
    time > 0 ? time -= 1 : isPlaying = false;
    timeDisplay.innerText = time;
    if (!isPlaying) {
        clearInterval(timeInterval);
    }
}

function btnChange(text) { // 게임이 시작이냐 중단이냐에 따라 버튼의 스타일 변경
    btn.innerText = text;
    text === '게임시작' ? btn.classList.remove('loading') : btn.classList.add('loading')
} 

function checkStatus() { // 게임이 끝났는지 확인
    if (!isPlaying && time === 0) {
        btnChange('게임시작');
        clearInterval(checkInterval);
    }
}
