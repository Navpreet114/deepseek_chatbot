let abortController = null;
let isGenerating = false;

async function sendMessage() {
    const inputBox = document.getElementById('input-box');
    const chatBox = document.getElementById('chat-box');
    const stopBtn = document.getElementById('stop-btn');
    const prompt = inputBox.value.trim();

   
    if (!prompt) return;

    
    if (isGenerating) {
        stopGeneration();
    }

  
    chatBox.innerHTML += `<div class="user-message">You: ${prompt}</div>`;

    try {
        abortController = new AbortController();
        isGenerating = true;

        const response = await fetch('http://localhost:3000/api/chat-stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
            signal: abortController.signal
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        
        const botDiv = document.createElement('div');
        botDiv.className = 'bot-message';
        botDiv.textContent = 'AI: ';  
        chatBox.appendChild(botDiv);

  
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;  

         
            botDiv.textContent += decoder.decode(value, { stream: true });

       
            chatBox.scrollTop = chatBox.scrollHeight;
        }

    } catch (error) {
        if (error.name !== 'AbortError') {
            chatBox.innerHTML += `<div class="bot-message" style="color:red;">${error.message}</div>`;
        }
    } finally {
        stopBtn.disabled = true;
        isGenerating = false;
    }
}

function stopGeneration() {
    if (abortController) {
        abortController.abort();
    }
    isGenerating = false;
    document.getElementById('stop-btn').disabled = true;
}