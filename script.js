// script.js

// Lista inicial de palavras e suas traduções (português -> espanhol)
let words = [
	{ portuguese: "Pagar", spanish: "Abonar" },
    { portuguese: "Adubo", spanish: "Abono" },
    { portuguese: "Agasalhado", spanish: "Abrigado" },
    { portuguese: "Passar óleo", spanish: "Aceitar" },
    { portuguese: "Azeite, óleo", spanish: "Aceite" },
    { portuguese: "Lembrar-se", spanish:"Acordarse"}
];

let selectedCards = [];
let matchedPairs = 0;

// Função para exibir o formulário de edição das palavras
function showWordEditor() {
    const wordList = document.getElementById("word-list");
    wordList.innerHTML = ''; // Limpa a área de edição

    words.forEach((word, index) => {
        const wordDiv = document.createElement("div");
        wordDiv.classList.add("word-pair");

        // Preenche os campos com o formato "português;espanhol"
        wordDiv.innerHTML = `
            <input type="text" id="word-${index}" placeholder="português;espanhol" value="${word.portuguese};${word.spanish}" />
        `;

        wordList.appendChild(wordDiv);
    });

    // Adiciona a opção de adicionar novas palavras
    const addButton = document.createElement("button");
    addButton.textContent = "Adicionar Palavra";
    addButton.onclick = addNewWord;
    wordList.appendChild(addButton);
}

// Função para adicionar uma nova palavra
function addNewWord() {
    words.push({ portuguese: "", spanish: "" });
    showWordEditor();
}

// Função para iniciar o jogo
function startGame() {
    // Atualiza a lista de palavras com base nas edições feitas pelo usuário
    words = words.map((word, index) => {
        const wordPair = document.getElementById(`word-${index}`).value.split(";");
        return {
            portuguese: wordPair[0] ? wordPair[0].trim() : "",
            spanish: wordPair[1] ? wordPair[1].trim() : ""
        };
    });

    // Limpa o status e as combinações
    matchedPairs = 0;
    selectedCards = [];
    document.getElementById("status").textContent = '';

    // Embaralha e gera o tabuleiro do jogo
    const shuffledWords = shuffleWords(words);
    generateGameBoard(shuffledWords);
}

// Função para embaralhar as palavras e suas traduções
function shuffleWords(wordList) {
    const cards = [];
    wordList.forEach(word => {
        cards.push({ text: word.portuguese, language: "portuguese" });
        cards.push({ text: word.spanish, language: "spanish" });
    });

    // Embaralha os cartões
    return cards.sort(() => Math.random() - 0.5);
}

// Função para gerar o tabuleiro do jogo
function generateGameBoard(cards) {
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = ''; // Limpa o tabuleiro

    cards.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-text", card.text);
        cardElement.setAttribute("data-language", card.language);
        cardElement.setAttribute("data-index", index);

        cardElement.addEventListener("click", () => flipCard(cardElement));

        gameContainer.appendChild(cardElement);
    });
}

// Função para virar os cartões
function flipCard(cardElement) {
    if (cardElement.classList.contains("flipped") || cardElement.classList.contains("matched")) {
        return;
    }

    cardElement.classList.add("flipped");
    cardElement.textContent = cardElement.getAttribute("data-text");
    selectedCards.push(cardElement);

    if (selectedCards.length === 2) {
        checkForMatch();
    }
}

// Função para verificar se os dois cartões virados formam um par
function checkForMatch() {
    const card1 = selectedCards[0];
    const card2 = selectedCards[1];

    const text1 = card1.getAttribute("data-text");
    const text2 = card2.getAttribute("data-text");

    const language1 = card1.getAttribute("data-language");
    const language2 = card2.getAttribute("data-language");

    if (language1 !== language2 && isTranslation(text1, text2)) {
        card1.classList.add("matched");
        card2.classList.add("matched");
        matchedPairs++;

        if (matchedPairs === words.length) {
            document.getElementById("status").textContent = "Parabéns! Você encontrou todos os pares!";
        }
    } else {
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            card1.textContent = '';
            card2.textContent = '';
        }, 1000);
    }

    selectedCards = [];
}

// Função para verificar se dois textos são traduções correspondentes
function isTranslation(text1, text2) {
    const word = words.find(w => (w.portuguese === text1 && w.spanish === text2) || (w.portuguese === text2 && w.spanish === text1));
    return !!word;
}

// Função para alternar a visibilidade da área de edição
function toggleEditSection() {
    const editSection = document.getElementById("edit-section");

    if (editSection.style.display === "none" || editSection.style.display === "") {
        editSection.style.display = "block";
    } else {
        editSection.style.display = "none";
    }
}

// Função para exibir os autores
function showAuthors() {
        alert("Alunos: Vitor, Isaac, João G. Kenji, Miguel F. e Miguel K.\nColégio VIP - 6º B");

}

// Inicializa o editor de palavras na primeira carga
showWordEditor();
