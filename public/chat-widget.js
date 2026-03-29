// Chat Widget Implementation for SmartFlux Website
(function() {
    // Configuration - Your webhook URL
    const CONFIG = {
        WEBHOOK_URL: 'https://initn8n-c7f5bqcjbndegxbq.swedencentral-01.azurewebsites.net/webhook/c9224d60-00bf-49a8-8071-57a6d0fbf07e'
    };

    // Inject widget HTML
    function injectWidgetHTML() {
        const widgetHTML = `
            <div id="chat-widget" class="fixed bottom-4 right-4 z-50" style="font-family: inherit;">
                <div id="chat-container" class="bg-black border-2 border-black text-white rounded-2xl shadow-lg transition-all duration-400 ease-in-out flex flex-col" style="background: black; width: 380px; height: 64px; overflow: hidden;">
                    
                    <!-- Compact Button View -->
                    <div id="compact-view" class="transition-all duration-300 ease-in-out" style="height: 64px; flex-shrink: 0;">
                        <div class="px-6 py-4 cursor-pointer hover:bg-gray-900 transition-colors duration-200 border-b-2 border-gray-800" style="height: 64px; display: flex; align-items: center; justify-content: space-between;">
                            <div class="flex items-center gap-3">
                                <span class="font-bold text-base">Chat with a smartflux.sites AI agent</span>
                            </div>
                            <!-- Arrow/Close button -->
                            <div id="toggle-button" class="text-gray-400 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-gray-800 transition-all leading-none">
                                <svg id="arrow-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="transition: transform 0.3s ease;">
                                    <path d="M10 6 L14 10 L10 14 M10 10 L6 10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-90 10 10)"/>
                                </svg>
                            </div>
                        </div>
                        <div id="greeting-text" class="px-6 text-xs text-gray-400 transition-all duration-300 ease-in-out" style="line-height:1.4; height: 0; opacity: 0; overflow: hidden; display: none;">
                            <div style="padding-bottom: 12px;">Hello! I'm here to help. How can I assist you with smartflux AI solutions today?</div>
                        </div>
                    </div>
                    
                    <!-- Expanded Chat View -->
                    <div id="chat-view" class="flex-col transition-all duration-300 ease-in-out flex-1" style="display: none; opacity: 0; overflow: hidden;">
                        
                        <!-- Messages Area -->
                        <div id="chat-messages" class="flex-1 p-4 overflow-y-auto text-white" style="background-color: #000; height: 372px;"></div>
                        
                        <!-- Input Area (Fixed at bottom) -->
                        <div class="p-4 border-t-2 border-gray-800 flex-shrink-0" style="background-color: #000;">
                            <div class="flex gap-2">
                                <input type="text" id="chat-input" placeholder="Type your message..." 
                                    class="flex-1 bg-gray-900 border-2 border-gray-800 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                                <button id="send-btn"
                                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm whitespace-nowrap flex-shrink-0">
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        `;

        // Remove existing widget if it exists
        const existingWidget = document.getElementById('chat-widget');
        if (existingWidget) {
            existingWidget.remove();
        }

        // Insert widget at end of body
        document.body.insertAdjacentHTML('beforeend', widgetHTML);

        // Initialize functionality
        initChatWidget();
    }

    // Initialize widget functionality
    function initChatWidget() {
        const chatContainer = document.getElementById('chat-container');
        const compactView = document.getElementById('compact-view');
        const chatView = document.getElementById('chat-view');
        const toggleButton = document.getElementById('toggle-button');
        const arrowIcon = document.getElementById('arrow-icon');
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const chatMessages = document.getElementById('chat-messages');
        const greetingText = document.getElementById('greeting-text');

        // Generate a unique session ID for this chat session
        const sessionID = 'chat_session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        let isExpanded = false;
        let welcomeMessageAdded = false;

        function openChat() {
            if (isExpanded) return;
            isExpanded = true;
            
            // Rotate arrow to point down
            arrowIcon.style.transform = 'rotate(180deg)';
            
            // Remove hover effect and cursor from header
            const headerDiv = compactView.querySelector('div');
            if (headerDiv) {
                headerDiv.style.cursor = 'default';
                headerDiv.classList.remove('hover:bg-gray-900');
            }
            
            // Start expanding the container from button size to full chat size
            setTimeout(() => {
                chatContainer.style.height = '500px';
            }, 100);
            
            setTimeout(() => {
                // Show chat view
                chatView.style.display = 'flex';
                chatView.style.opacity = '0';
                
                // Trigger reflow
                void chatView.offsetHeight;
                
                // Fade in chat view
                setTimeout(() => {
                    chatView.style.opacity = '1';
                }, 50);
            }, 350);
            
            // Add welcome message only once
            if (!welcomeMessageAdded) {
                setTimeout(() => {
                    addMessage('Hello! I\'m here to help. How can I assist you with smartflux AI solutions today?', false);
                    welcomeMessageAdded = true;
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 600);
            }
            
            setTimeout(() => {
                if (chatInput) {
                    chatInput.focus();
                }
            }, 650);
        }

        function closeChat() {
            if (!isExpanded) return;
            isExpanded = false;
            
            // Rotate arrow back to point up
            arrowIcon.style.transform = 'rotate(0deg)';
            
            // Restore hover effect and cursor to header immediately
            const headerDiv = compactView.querySelector('div');
            if (headerDiv) {
                headerDiv.style.cursor = 'pointer';
                headerDiv.classList.add('hover:bg-gray-900');
            }
            
            // Fade out chat view
            chatView.style.opacity = '0';
            
            setTimeout(() => {
                chatView.style.display = 'none';
                
                // Shrink container back to button size
                chatContainer.style.height = '64px';
            }, 200);
        }

        // Event listeners
        if (compactView) {
            compactView.addEventListener('click', function(e) {
                // Only open if clicking on the header area, not the toggle button
                if (e.target.closest('#toggle-button')) {
                    return;
                }
                e.stopPropagation();
                if (!isExpanded) {
                    openChat();
                }
            });
        }

        if (toggleButton) {
            toggleButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (isExpanded) {
                    closeChat();
                } else {
                    openChat();
                }
            });
        }

        function addMessage(text, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `mb-3 ${isUser ? 'text-right' : 'text-left'}`;
            messageDiv.innerHTML = `<div class="inline-block p-3 rounded-lg ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-100 border border-gray-700'} max-w-[85%] break-words shadow-sm text-sm">${text}</div>`;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        async function sendMessage(message) {
            addMessage(message, true);

            // Show animated thinking indicator
            const thinkingDiv = document.createElement('div');
            thinkingDiv.className = `mb-3 text-left`;
            thinkingDiv.innerHTML = `<div class="inline-block p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 typing-indicator text-sm">...</div>`;
            chatMessages.appendChild(thinkingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Animate the dots
            let dotCount = 0;
            const maxDots = 3;
            const typingInterval = setInterval(() => {
                dotCount = (dotCount + 1) % (maxDots + 1);
                const dots = '.'.repeat(Math.max(1, dotCount));
                const typingElement = thinkingDiv.querySelector('.typing-indicator');
                if (typingElement) {
                    typingElement.textContent = dots;
                }
            }, 300);

            try {
                const response = await fetch(CONFIG.WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        sessionID: sessionID,
                        timestamp: new Date().toISOString(),
                        source: window.location.pathname
                    })
                });

                let responseText;
                const contentType = response.headers.get('content-type');

                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();

                    // Handle array format from n8n: [{"output": "..."}]
                    if (Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('output')) {
                        responseText = data[0].output;
                    } else {
                        // Fallback for standard formats
                        responseText = data.response || data.message || data.text ||
                                     (data.output) || // Direct output key
                                     JSON.stringify(data); // Complete fallback
                    }
                } else {
                    responseText = await response.text();
                }

                // Clear typing animation and remove indicator
                clearInterval(typingInterval);
                if (thinkingDiv && thinkingDiv.parentNode) {
                    thinkingDiv.parentNode.removeChild(thinkingDiv);
                }
                addMessage(responseText || 'Sorry, I couldn\'t process your message.', false);

            } catch (error) {
                // Clear typing animation and add error message
                clearInterval(typingInterval);
                if (thinkingDiv && thinkingDiv.parentNode) {
                    thinkingDiv.parentNode.removeChild(thinkingDiv);
                }
                addMessage('Sorry, I\'m having trouble connecting. Please try again later.', false);
                console.error('Chat error:', error);
            }
        }

        function handleSend() {
            const message = chatInput.value.trim();
            if (message) {
                sendMessage(message);
                chatInput.value = '';
                chatInput.focus();
            }
        }

        if (sendBtn && chatInput) {
            sendBtn.addEventListener('click', handleSend);
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                }
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectWidgetHTML);
    } else {
        injectWidgetHTML();
    }

})();
