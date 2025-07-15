// Seleciona as respostas
const blocosArrastaveis = document.getElementsByClassName('resposta');
// Seleciona as perguntas
const dropTargets = document.querySelectorAll('.drop-target');
//estabelece as coordenadas iniciais 
let currentDraggingBlock = null;
let offsetX = 0;
let offsetY = 0;

// Checa a colisão entre dois elementos (se True = está colidindo)
function isColliding(rect1, rect2) {
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

// Função para lidar com a soltura do bloco
function handleBlockDrop() {
    if (!currentDraggingBlock) return;

    const draggableRect = currentDraggingBlock.getBoundingClientRect();
    let colidiuCorretamente = false;
    // Para armazenar o alvo correto ou o último alvo colidido
    let targetFound = null; 

   // Retira as classes de verificação das hitboxes
    dropTargets.forEach(target => {
        target.classList.remove('correct-drop', 'incorrect-drop');
    });

    dropTargets.forEach(target => {
        const targetRect = target.getBoundingClientRect();

        if (isColliding(draggableRect, targetRect)) {
            const draggableValue = currentDraggingBlock.dataset.value;
            const expectedValue = target.dataset.expectedValue;

            // Remove classes de feedback anteriores do bloco arrastável
            currentDraggingBlock.classList.remove('correct', 'incorrect');
            
            if (draggableValue === expectedValue) {
                console.log(`Correto!`);
                
                // Adiciona classes de feedback visual em caso de Correto
                currentDraggingBlock.classList.add('correct');
                target.classList.add('correct-drop');

                // ENCAIXA O BLOCO NA HITBOX
                if (currentDraggingBlock.parentNode) {
                    currentDraggingBlock.parentNode.removeChild(currentDraggingBlock);
                }
                target.appendChild(currentDraggingBlock);
                currentDraggingBlock.style.position = 'static'; 
                currentDraggingBlock.style.left = ''; 
                currentDraggingBlock.style.top = '';  

                colidiuCorretamente = true;
                // Marca que uma colisão correta ocorreu
                targetFound = target; 
            } else {
                console.log(`Incorreta!`);
                // Adicione classes de feedback visual em caso de Incorreto
                currentDraggingBlock.classList.add('incorrect');
                target.classList.add('incorrect-drop');
                // Marca que uma colisão (mesmo que incorreta) ocorreu
                targetFound = target; 
            }
        }
    });

    // Se o bloco não colidiu corretamente (ou não colidiu com nada)
    if (!colidiuCorretamente) {
        currentDraggingBlock.classList.remove('correct', 'incorrect'); // Limpa o feedback do bloco
        
    }

    // Limpa a referência do bloco arrastável
    currentDraggingBlock = null;
}

// Separa cada um dos blocos arrastáveis e adiciona o Listener
Array.from(blocosArrastaveis).forEach(bloco => {
    bloco.addEventListener('mousedown', (e) => {
        currentDraggingBlock = bloco;
        currentDraggingBlock.style.position = 'absolute';
        currentDraggingBlock.style.zIndex = '1000';
        
        offsetX = e.clientX - currentDraggingBlock.getBoundingClientRect().left;
        offsetY = e.clientY - currentDraggingBlock.getBoundingClientRect().top;
        
        e.preventDefault();
    });

});

document.addEventListener('mousemove', (e) => {
    if (!currentDraggingBlock) return;
// Faz o bloco assumir a posição do cursor enquanto é arrastado
    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;

    const maxX = window.innerWidth - currentDraggingBlock.offsetWidth;
    const maxY = window.innerHeight - currentDraggingBlock.offsetHeight;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    currentDraggingBlock.style.left = `${newX}px`;
    currentDraggingBlock.style.top = `${newY}px`;
});



// Após os eventos de soltura
document.addEventListener('mouseup', handleBlockDrop);
document.addEventListener('touchend', handleBlockDrop); 

// --- Evento de 'touchend' (quando o toque termina) ---
document.addEventListener('touchend', () => {
    if (currentDraggingBlock) {
        currentDraggingBlock = null;
    }
});