document.addEventListener('DOMContentLoaded', function() {
    // Initialize mouse events and activities
    setupMouseActivities();
    
    // Add CSS animations classes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .fade-in {
            animation: fadeIn 0.6s ease-out forwards;
        }
        
        .slide-in {
            animation: slideIn 0.5s ease-out forwards;
        }
    `;
    document.head.appendChild(style);
    
    // Setup mouse activity event handlers
    function setupMouseActivities() {
        const mouseLearningContainer = document.querySelector('.mouse-learning-container');
        const activityTabs = mouseLearningContainer.querySelectorAll('.activity-tab');
        const activityContainers = mouseLearningContainer.querySelectorAll('.activity-container');
        const startButtons = mouseLearningContainer.querySelectorAll('.start-activity-btn');
        
        // Activity tab switching
        activityTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const activity = tab.getAttribute('data-activity');
                
                // Update active tab
                activityTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show selected activity
                activityContainers.forEach(container => {
                    container.classList.remove('active');
                    if (container.classList.contains(`${activity}-activity`)) {
                        container.classList.add('active');
                    }
                });
            });
        });
        
        // Click activity implementation
        const clickGameArea = mouseLearningContainer.querySelector('.click-game-area');
        const clickScoreDisplay = clickGameArea.querySelector('.score');
        const clickTimerDisplay = clickGameArea.querySelector('.timer');
        
        let clickScore = 0;
        let clickTimer = 30; 
        let clickInterval;
        let currentTarget;
        
        startButtons[0].addEventListener('click', () => {
            startClickActivity();
            startButtons[0].disabled = true;
        });
        
        function startClickActivity() {
            // Reset the game
            clickScore = 0;
            clickTimer = 30; 
            clickScoreDisplay.textContent = clickScore;
            clickTimerDisplay.textContent = clickTimer;
            
            // Clear any existing targets and completion messages
            if (currentTarget) {
                currentTarget.remove();
                currentTarget = null;
            }
            
            // Remove any existing completion message
            const existingCompletionMessage = clickGameArea.querySelector('.completion-message');
            if (existingCompletionMessage) {
                existingCompletionMessage.remove();
            }
            
            // Start the timer
            clickInterval = setInterval(() => {
                clickTimer--;
                clickTimerDisplay.textContent = clickTimer;
                
                if (clickTimer <= 0) {
                    endClickActivity();
                }
            }, 1000);
            
            // Create the first target
            createClickTarget();
        }
        
        function createClickTarget() {
            if (currentTarget) {
                currentTarget.remove();
            }
            
            // Create a new target
            currentTarget = document.createElement('div');
            currentTarget.className = 'click-target';
            
            // Random position within game area bounds
            const gameAreaRect = clickGameArea.getBoundingClientRect();
            const targetSize = 70; 
            
            const maxX = gameAreaRect.width - targetSize;
            const maxY = gameAreaRect.height - targetSize - 40; 
            
            const randomX = Math.floor(Math.random() * maxX);
            const randomY = Math.floor(Math.random() * maxY) + 40; 
            
            currentTarget.style.left = `${randomX}px`;
            currentTarget.style.top = `${randomY}px`;
            
            // Less size variation
            const sizeVariation = Math.floor(Math.random() * 10); 
            currentTarget.style.width = `${targetSize + sizeVariation}px`;
            currentTarget.style.height = `${targetSize + sizeVariation}px`;
            
            // Add the target to the game area
            clickGameArea.appendChild(currentTarget);
            
            // Add click event
            currentTarget.addEventListener('click', handleTargetClick);
        }
        
        function handleTargetClick() {
            // Prevent multiple clicks
            currentTarget.removeEventListener('click', handleTargetClick);
            
            // Visual feedback for successful click
            currentTarget.classList.add('clicked');
            
            // Increase score
            clickScore++;
            clickScoreDisplay.textContent = clickScore;
            
            // Update progress bar
            updateProgressBar();
            
            // Create a new target after a short delay
            setTimeout(() => {
                if (clickTimer > 0) {
                    createClickTarget();
                }
            }, 300);
        }
        
        function endClickActivity() {
            clearInterval(clickInterval);
            
            if (currentTarget) {
                currentTarget.remove();
                currentTarget = null;
            }
            
            // Show completion message
            const completionMessage = document.createElement('div');
            completionMessage.className = 'completion-message';
            completionMessage.innerHTML = `
                <h3>Atividade Concluída!</h3>
                <p>Sua pontuação: ${clickScore}</p>
                <p>${getScoreMessage(clickScore)}</p>
            `;
            clickGameArea.appendChild(completionMessage);
            
            // Re-enable start button
            startButtons[0].disabled = false;
            startButtons[0].textContent = 'Tentar Novamente';
        }
        
        // Double-click activity implementation
        const doubleClickArea = mouseLearningContainer.querySelector('.doubleclick-game-area');
        const doubleClickScoreDisplay = doubleClickArea.querySelector('.score');
        const doubleClickTimerDisplay = doubleClickArea.querySelector('.timer');
        const folderItems = doubleClickArea.querySelectorAll('.folder-item');
        
        let doubleClickScore = 0;
        let doubleClickTimer = 30;
        let doubleClickInterval;
        let activeFolder = null;
        
        startButtons[1].addEventListener('click', () => {
            startDoubleClickActivity();
            startButtons[1].disabled = true;
        });
        
        function startDoubleClickActivity() {
            // Reset the game
            doubleClickScore = 0;
            doubleClickTimer = 30;
            doubleClickScoreDisplay.textContent = doubleClickScore;
            doubleClickTimerDisplay.textContent = doubleClickTimer;
            
            // Reset all folders
            folderItems.forEach(folder => {
                folder.setAttribute('data-status', 'inactive');
                folder.classList.remove('active', 'success');
            });
            
            // Remove any existing completion message
            const existingCompletionMessage = doubleClickArea.querySelector('.completion-message');
            if (existingCompletionMessage) {
                existingCompletionMessage.remove();
            }
            
            // Start the timer
            doubleClickInterval = setInterval(() => {
                doubleClickTimer--;
                doubleClickTimerDisplay.textContent = doubleClickTimer;
                
                if (doubleClickTimer <= 0) {
                    endDoubleClickActivity();
                }
            }, 1000);
            
            // Activate the first folder
            activateRandomFolder();
        }
        
        function activateRandomFolder() {
            // Deactivate previous folder if exists
            if (activeFolder) {
                activeFolder.setAttribute('data-status', 'inactive');
                activeFolder.classList.remove('active');
            }
            
            // Get inactive folders
            const inactiveFolders = Array.from(folderItems).filter(
                folder => folder.getAttribute('data-status') !== 'success'
            );
            
            if (inactiveFolders.length === 0) {
                // All folders are successful, reset all except the last one
                folderItems.forEach((folder, index) => {
                    if (index !== folderItems.length - 1) {
                        folder.setAttribute('data-status', 'inactive');
                        folder.classList.remove('active', 'success');
                    }
                });
                
                // Get the first folder
                activeFolder = folderItems[0];
            } else {
                // Get a random inactive folder
                const randomIndex = Math.floor(Math.random() * inactiveFolders.length);
                activeFolder = inactiveFolders[randomIndex];
            }
            
            // Activate the folder
            activeFolder.setAttribute('data-status', 'active');
            activeFolder.classList.add('active');
        }
        
        // Add event listeners to folder items
        folderItems.forEach(folder => {
            folder.addEventListener('dblclick', () => {
                const status = folder.getAttribute('data-status');
                if (status === 'active') {
                    // Success!
                    folder.setAttribute('data-status', 'success');
                    folder.classList.remove('active');
                    folder.classList.add('success');
                    
                    // Increase score
                    doubleClickScore++;
                    doubleClickScoreDisplay.textContent = doubleClickScore;
                    
                    // Update progress bar
                    updateProgressBar();
                    
                    // Activate next folder
                    if (doubleClickTimer > 0) {
                        setTimeout(activateRandomFolder, 500);
                    }
                }
            });
            
            // Add single click feedback (but don't count it as success)
            folder.addEventListener('click', () => {
                const status = folder.getAttribute('data-status');
                if (status === 'active') {
                    folder.classList.add('clicked');
                    setTimeout(() => {
                        folder.classList.remove('clicked');
                    }, 200);
                }
            });
        });
        
        function endDoubleClickActivity() {
            clearInterval(doubleClickInterval);
            
            // Deactivate active folder
            if (activeFolder) {
                activeFolder.setAttribute('data-status', 'inactive');
                activeFolder.classList.remove('active');
            }
            
            // Show completion message
            const completionMessage = document.createElement('div');
            completionMessage.className = 'completion-message';
            completionMessage.innerHTML = `
                <h3>Atividade Concluída!</h3>
                <p>Sua pontuação: ${doubleClickScore}</p>
                <p>${getScoreMessage(doubleClickScore)}</p>
            `;
            doubleClickArea.appendChild(completionMessage);
            
            // Re-enable start button
            startButtons[1].disabled = false;
            startButtons[1].textContent = 'Tentar Novamente';
        }
        
        // Drag and drop activity implementation
        const dragGameArea = mouseLearningContainer.querySelector('.drag-game-area');
        const dragItems = dragGameArea.querySelectorAll('.drag-item');
        const dropZones = dragGameArea.querySelectorAll('.drop-zone');
        const dragScoreDisplay = dragGameArea.querySelector('.score');
        
        let dragScore = 0;
        let dragActivityActive = false;
        
        startButtons[2].addEventListener('click', () => {
            startDragActivity();
            startButtons[2].disabled = true;
        });
        
        function startDragActivity() {
            // Reset the game
            dragScore = 0;
            dragScoreDisplay.textContent = dragScore;
            dragActivityActive = true;
            
            // Remove any existing completion message
            const existingCompletionMessage = dragGameArea.querySelector('.completion-message');
            if (existingCompletionMessage) {
                existingCompletionMessage.remove();
            }
            
            // Reset all items and zones
            dragItems.forEach(item => {
                item.classList.remove('placed', 'wrong');
                item.style.opacity = 1;
                item.style.pointerEvents = 'auto';
                
                // Return to original container if it was moved
                const dragItemsContainer = dragGameArea.querySelector('.drag-items-container');
                dragItemsContainer.appendChild(item);
            });
            
            dropZones.forEach(zone => {
                zone.classList.remove('filled', 'highlight');
            });
            
            // Setup drag and drop events
            setupDragDropEvents();
        }
        
        function setupDragDropEvents() {
            // Setup drag events for items
            dragItems.forEach(item => {
                item.addEventListener('dragstart', handleDragStart);
                item.addEventListener('dragend', handleDragEnd);
            });
            
            // Setup drop events for zones
            dropZones.forEach(zone => {
                zone.addEventListener('dragover', handleDragOver);
                zone.addEventListener('dragenter', handleDragEnter);
                zone.addEventListener('dragleave', handleDragLeave);
                zone.addEventListener('drop', handleDrop);
            });
        }
        
        function handleDragStart(e) {
            if (!dragActivityActive) return;
            
            // Add dragging class
            this.classList.add('dragging');
            e.dataTransfer.setData('text/plain', this.getAttribute('data-item-type'));
            
            // For better drag image
            setTimeout(() => {
                this.style.opacity = '0.4';
            }, 0);
        }
        
        function handleDragEnd() {
            // Remove dragging class
            this.classList.remove('dragging');
            this.style.opacity = '1';
        }
        
        function handleDragOver(e) {
            if (!dragActivityActive) return;
            
            // Prevent default to allow drop
            e.preventDefault();
        }
        
        function handleDragEnter(e) {
            if (!dragActivityActive) return;
            
            // Add highlight class
            this.classList.add('highlight');
        }
        
        function handleDragLeave() {
            if (!dragActivityActive) return;
            
            // Remove highlight class
            this.classList.remove('highlight');
        }
        
        function handleDrop(e) {
            if (!dragActivityActive) return;
            
            // Prevent default action
            e.preventDefault();
            
            // Remove highlight class
            this.classList.remove('highlight');
            
            // Get dragged item type
            const itemType = e.dataTransfer.getData('text/plain');
            const zoneType = this.getAttribute('data-zone-type');
            
            // Get the dragged item
            const draggedItem = document.querySelector(`.drag-item.dragging`);
            
            // Check if correct zone
            if (itemType === zoneType) {
                // Success!
                this.classList.add('filled');
                draggedItem.classList.add('placed');
                draggedItem.classList.remove('dragging');
                draggedItem.style.pointerEvents = 'none';
                
                // Move the item to the zone
                this.appendChild(draggedItem);
                
                // Increase score
                dragScore++;
                dragScoreDisplay.textContent = dragScore;
                
                // Check if all items are placed
                if (dragScore >= 4) {
                    endDragActivity(true);
                }
                
                // Update progress bar
                updateProgressBar();
            } else {
                // Wrong zone - visual feedback
                draggedItem.classList.add('wrong');
                this.classList.add('wrong');
                
                setTimeout(() => {
                    draggedItem.classList.remove('wrong');
                    this.classList.remove('wrong');
                }, 800);
            }
        }
        
        function endDragActivity(success = false) {
            dragActivityActive = false;
            
            // Show completion message
            const completionMessage = document.createElement('div');
            completionMessage.className = 'completion-message';
            completionMessage.innerHTML = `
                <h3>Atividade Concluída!</h3>
                <p>Itens colocados: ${dragScore}/4</p>
                <p>${success ? 'Excelente trabalho!' : 'Continue praticando!'}</p>
            `;
            dragGameArea.appendChild(completionMessage);
            
            // Re-enable start button
            startButtons[2].disabled = false;
            startButtons[2].textContent = 'Tentar Novamente';
            
            // If successful, celebrate
            if (success) {
                celebrateCompletion(mouseLearningContainer);
            }
        }
        
        // Helper functions
        function getScoreMessage(score) {
            if (score >= 10) return 'Excelente trabalho! Você já é um expert!';
            if (score >= 5) return 'Muito bom! Você está dominando o mouse!';
            if (score >= 3) return 'Bom trabalho! Continue praticando!';
            return 'Continue praticando, você vai melhorar!';
        }
        
        function updateProgressBar() {
            let progress = 0;
            const progressBar = mouseLearningContainer.querySelector('.progress-bar');
            
            // Calculate progress based on active tab
            const activeTab = mouseLearningContainer.querySelector('.activity-tab.active');
            const activityType = activeTab.getAttribute('data-activity');
            
            switch (activityType) {
                case 'click':
                    progress = Math.min(clickScore / 10 * 100, 100); 
                    break;
                case 'doubleclick':
                    progress = Math.min(doubleClickScore / 15 * 100, 100);
                    break;
                case 'drag':
                    progress = (dragScore / 4) * 100;
                    break;
            }
            
            progressBar.style.width = `${progress}%`;
        }
        
        // Function to celebrate completion with confetti
        function celebrateCompletion(container) {
            // Create confetti effect
            for (let i = 0; i < 50; i++) {
                createConfetti(container);
            }
        }
        
        function createConfetti(container) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = getRandomColor();
            confetti.style.borderRadius = '50%';
            confetti.style.top = '-10px';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.transform = 'scale(' + (Math.random() * 0.6 + 0.4) + ')';
            confetti.style.zIndex = '1000';
            container.appendChild(confetti);
            
            // Animate confetti
            const animation = confetti.animate([
                { 
                    top: '-10px', 
                    transform: 'scale(' + (Math.random() * 0.6 + 0.4) + ') rotate(0deg)',
                    opacity: 1 
                },
                { 
                    top: container.offsetHeight + 'px', 
                    transform: 'scale(' + (Math.random() * 0.6 + 0.4) + ') rotate(' + (Math.random() * 360) + 'deg)',
                    opacity: 0 
                }
            ], {
                duration: Math.random() * 2000 + 1500,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            });
            
            animation.onfinish = function() {
                confetti.remove();
            };
        }
        
        function getRandomColor() {
            const colors = ['#8EC6E6', '#a5d4ec', '#4CAF50', '#FFC107', '#E91E63', '#9C27B0'];
            return colors[Math.floor(Math.random() * colors.length)];
        }
    }
    
    // Add additional animation classes
    const extraStyles = document.createElement('style');
    extraStyles.textContent = `
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
        }
        
        @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(142, 198, 230, 0.3); }
            50% { box-shadow: 0 0 20px rgba(142, 198, 230, 0.6); }
            100% { box-shadow: 0 0 5px rgba(142, 198, 230, 0.3); }
        }
    `;
    document.head.appendChild(extraStyles);
});
