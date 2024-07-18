document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("spinButton").addEventListener("click", startSpin);
    document.getElementById("spinCount").addEventListener("input", updateSpinCount);
    document.getElementById("forceWinCheckbox").addEventListener("change", toggleForceWin);
  });
  
  let spinCount = 1;
  let round = 0;
  let forceWin = false;
  
  function updateSpinCount() {
    spinCount = document.getElementById("spinCount").value;
    document.getElementById("spinCountValue").textContent = spinCount;
  }
  
  function startSpin() {
    resetReels();
    const spinInterval = setInterval(() => {
      if (forceWin) {
        forceWinningNumbers();
      } else {
        spinReels();
      }
      setTimeout(() => {
        clearInterval(spinInterval);
        stopReels();
      }, 2000);
    }, 3000);
  }
  
  function resetReels() {
    round++;
    const reels = document.querySelectorAll(".reel");
    reels.forEach((reel) => {
      const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
      const shuffledNumbers = shuffle(numbers.concat(numbers, numbers)); // Repeat numbers to ensure smooth scrolling
  
      reel.innerHTML = `<div class="spin">${shuffledNumbers
        .map((num) => {
          return num === 1
            ? `<div class="number"><div><img src="images/tigrinho.jpg" alt="Tigrinho" style="width: 80px; height: 80px;"></div></div>`
            : `<div class="number"><div>${num}</div></div>`;
        })
        .join("")}</div>`;
  
      const spinDiv = reel.querySelector(".spin");
      spinDiv.style.animation = "spin 1s linear infinite";
    });
  }
  
  function spinReels() {
    const reels = document.querySelectorAll(".reel");
    reels.forEach((reel) => {
      const spinDiv = reel.querySelector(".spin");
      spinDiv.style.animation = "spin 1s linear infinite";
    });
  }
  
  function stopReels() {
    const reels = document.querySelectorAll(".reel");
    reels.forEach((reel) => {
      const spinDiv = reel.querySelector(".spin");
      spinDiv.style.animation = "none"; // Parar a animação
      const finalNumber = Math.round(Math.random() * 8) + 1;
      const numberDivs = Array.from(reel.querySelectorAll(".number"));
      numberDivs.forEach((div, index) => {
        if (index % 3 === 0) {
          div.innerHTML =
            finalNumber === 1
              ? `<div><img src="images/tigrinho.jpg" alt="Tigrinho" style="width: 80px; height: 80px;"></div>`
              : `<div>${finalNumber}</div>`;
          div.classList.remove("winner");
        }
      });
      checkResult(finalNumber, reel);
    });
  }
  
  function checkResult(finalNumber, reel) {
    const result = `Rodada ${round}:`;
    let outcome = "Perdeu";
    let resultClass = "lose";
  
    const numberDivs = reel.querySelectorAll(".number");
    const rows = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]; // Definir linhas para verificação
  
    const winningLines = rows.filter((row) => {
      const tigrinhoCount = row.reduce((count, index) => {
        const isTigrinho = numberDivs[index].innerHTML.includes("tigrinho.jpg");
        if (isTigrinho) {
          numberDivs[index].classList.add("winner");
        }
        return count + (isTigrinho ? 1 : 0);
      }, 0);
      return tigrinhoCount === 2; // Verifica se há exatamente 2 imagens do Tigrinho na linha
    });
  
    if (winningLines.length > 0) {
      outcome = "Ganhou!";
      resultClass = "win";
      triggerFireworks(); // Chama a função de fogos de artifício se ganhou
    }
  
    const historyList = document.getElementById("results");
    const resultItem = document.createElement("li");
    resultItem.textContent = `${result} ${outcome} - Número: ${finalNumber}`;
    resultItem.classList.add(resultClass);
    historyList.appendChild(resultItem);
  }
  
  function forceWinningNumbers() {
    const reels = document.querySelectorAll(".reel");
    reels.forEach((reel) => {
      const numberDivs = reel.querySelectorAll(".number");
      const rows = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]; // Definir linhas para verificação
  
      rows.forEach((row) => {
        const nonTigrinhoIndexes = row.filter((index) => !numberDivs[index].innerHTML.includes("tigrinho.jpg"));
        if (nonTigrinhoIndexes.length > 0) {
          const randomIndex = nonTigrinhoIndexes[Math.floor(Math.random() * nonTigrinhoIndexes.length)];
          numberDivs[randomIndex].innerHTML = `<div><img src="images/tigrinho.jpg" alt="Tigrinho" style="width: 80px; height: 80px;"></div>`;
          numberDivs[randomIndex].classList.add("winner");
        }
      });
    });
  }
  
  function toggleForceWin() {
    forceWin = document.getElementById("forceWinCheckbox").checked;
  }
  
  // Função shuffle para embaralhar números
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
  
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  
    return array;
  }
  
  // Função para iniciar a animação de fogos de artifício
  function triggerFireworks() {
    const fireworksContainer = document.getElementById("fireworks");
    fireworksContainer.innerHTML = ""; // Limpa qualquer conteúdo anterior
  
    // Cria efeito visual exagerado para vitória
    const fireworksCount = 30;
    for (let i = 0; i < fireworksCount; i++) {
      const firework = document.createElement("div");
      firework.classList.add("firework");
      firework.style.left = `${Math.random() * 100}vw`;
      firework.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      fireworksContainer.appendChild(firework);
    }
  
    fireworksContainer.style.display = "block";
  
    setTimeout(() => {
      fireworksContainer.style.display = "none";
    }, 3000); // Oculta os fogos de artifício após 3 segundos
  }
  