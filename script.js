document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskInput = document.getElementById('task-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsSection = document.getElementById('results-section');
    const inputSection = document.querySelector('.input-section');
    const header = document.querySelector('header');
    const promptChips = document.querySelectorAll('.prompt-chip');
    const robotBg = document.getElementById('robot-bg');
    // Add a specific element to display loading/error messages
    const messageArea = document.createElement('div'); // Create a div for messages
    messageArea.id = 'message-area';
    inputSection.parentNode.insertBefore(messageArea, resultsSection); // Insert it before results section

    let allTools = []; // Array to hold tools loaded from JSON

    // --- Fetch Tool Data ---
    function loadToolData() {
        fetch('tools_database.json')
            .then(response => {
                if (!response.ok) {
                    // More specific error based on status code
                    throw new Error(`HTTP error! Status: ${response.status} - Could not fetch file.`);
                }
                return response.json(); // Try to parse JSON
            })
            .then(data => {
                allTools = data;
                console.log(`Successfully loaded ${allTools.length} tools from JSON.`);
                analyzeBtn.disabled = false;
                analyzeBtn.textContent = 'Analyze Task';
                messageArea.textContent = ''; // Clear loading message
                messageArea.style.display = 'none'; // Hide message area
            })
            .catch(error => {
                console.error("Error loading or parsing tools_database.json:", error);
                // Display error message prominently BUT keep input visible
                messageArea.innerHTML = `<p class="error-message">Could not load the tool database. Please check the file path/name is correct and the JSON format is valid.</p><p class="error-details">(${error.message})</p>`;
                messageArea.style.display = 'block'; // Show message area
                analyzeBtn.disabled = true;
                analyzeBtn.textContent = 'Error Loading Tools';
                // DO NOT hide the input section here
                // inputSection.style.display = 'none'; // REMOVED THIS LINE
            });
    }

    // --- Initialize ---
    analyzeBtn.disabled = true; // Disable button initially
    analyzeBtn.textContent = 'Loading Tools...';
    messageArea.textContent = 'Loading tool database...'; // Initial loading message
    messageArea.style.display = 'block';
    loadToolData(); // Load data when the page is ready

    // Insights (keep as before)
    const insights = [
        "Automating this could save you 3-5 hours/week.",
        "This task is highly suitable for AI automation.",
        "Reduce errors by up to 90% by automating this.",
        "Teams report 40% higher satisfaction automating tasks like this.",
        "This is among the top 100 most automatable business processes.",
        "Focus on higher-value work by automating this process."
    ];

    // --- Event Listeners ---
    analyzeBtn.addEventListener('click', analyzeTask);

    promptChips.forEach(chip => {
        chip.addEventListener('click', () => {
            taskInput.value = chip.dataset.prompt;
        });
    });

    // Function to switch view to the initial search screen
    function showSearchScreen() {
        resultsSection.style.display = 'none';
        resultsSection.innerHTML = '';
        inputSection.style.display = 'block';
        header.style.display = 'block';
        robotBg.style.display = 'block'; // Show robot again
        messageArea.style.display = 'none'; // Hide message area on reset
        taskInput.value = '';
        taskInput.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Main function to analyze the task
    function analyzeTask() {
        const taskDescription = taskInput.value.trim();

        if (!taskDescription) {
            alert("Please describe a task first!");
            return;
        }
        // Only proceed if tools loaded successfully
        if (allTools.length === 0) {
             alert("Tool data could not be loaded. Cannot analyze task.");
             return;
        }

        inputSection.style.display = 'none';
        robotBg.style.display = 'none'; // Hide robot on results page
        messageArea.style.display = 'none'; // Hide message area when showing results

        const matchedTools = findMatchingTools(taskDescription);
        const score = calculateScore(matchedTools, taskDescription);
        displayResults(taskDescription, matchedTools, score);
        // Scroll results into view AFTER they are rendered
        // Use setTimeout to ensure rendering is complete
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100); // Small delay
    }

    // --- Function to find matching tools (MODIFIED FOR JSON - same as before) ---
    function findMatchingTools(taskDescription) {
        const lowerCaseTask = taskDescription.toLowerCase();
        const taskWords = lowerCaseTask.split(/\s+/).filter(w => w.length > 2);

        const scoredTools = allTools.map(tool => {
            let matchScore = 0;
            const lowerCaseName = tool.name.toLowerCase();
            const lowerCaseDesc = tool.description.toLowerCase();
            const lowerCaseCats = tool.category ? tool.category.join(' ').toLowerCase() : '';

            if (lowerCaseTask.includes(lowerCaseName)) {
                matchScore += 5;
            } else {
                 const nameWords = lowerCaseName.split(' ');
                 taskWords.forEach(taskWord => {
                     if (nameWords.some(nameWord => nameWord.includes(taskWord))) {
                         matchScore += 1.5;
                     }
                 });
            }

            taskWords.forEach(taskWord => {
                if (lowerCaseCats.includes(taskWord)) {
                    matchScore += 2;
                }
            });

            taskWords.forEach(taskWord => {
                if (lowerCaseDesc.includes(taskWord)) {
                    matchScore += 1;
                }
            });

             if (/\b(email|schedule|meeting|calendar|note|summary|content|social|media|data|analysis|customer|support|research|report|automate|automation|productivity|code|image|video|audio|writing)\b/.test(lowerCaseTask)) {
                  if (taskWords.some(word => lowerCaseCats.includes(word) || lowerCaseDesc.includes(word) || lowerCaseName.includes(word) )) {
                       matchScore += 1;
                  }
             }

            return { ...tool, matchScore };
        });

        return scoredTools
            .filter(tool => tool.matchScore >= 2)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 2);
    }

    // --- Function to calculate automatable score (same as before) ---
    function calculateScore(matchedTools, taskDescription) {
        const lowerCaseTask = taskDescription.toLowerCase();
        let score = 30;

        if (matchedTools.length > 0) {
            score = 65;
             score += matchedTools[0].matchScore * 2.5;
             if (matchedTools.length > 1) {
                 score += matchedTools[1].matchScore * 1;
             }
        } else {
             if (/\b(automate|streamline|manage|create|schedule|send|analyze|report|generate|summarize|edit|optimize)\b/.test(lowerCaseTask)) {
                 score = 45 + Math.floor(Math.random() * 15);
             } else {
                 score = 30 + Math.floor(Math.random() * 15);
             }
        }

        score += Math.max(0, 5 - Math.abs(taskDescription.length - 50) / 10);
        score = Math.max(25, Math.min(score, 98));
        score = Math.round(score + (Math.random() * 6 - 3));
        score = Math.max(25, Math.min(score, 99));
        return score;
    }


    // --- Function to display results (same as before) ---
    function displayResults(taskDescription, matchedTools, score) {
        const randomInsight = insights[Math.floor(Math.random() * insights.length)];

        let resultsHTML = `
            <div class="results-display-area">
                <div class="original-task-display">${taskDescription}</div>
                <div class="automatable-score-display">
                    <div class="score-value-display">${score}%</div>
                    <div class="score-label-display">Automatable</div>
                </div>
                <div class="insight-display">${randomInsight}</div>
        `;

        if (matchedTools.length > 0) {
            resultsHTML += `
                <h3 class="results-tools-heading">Recommended AI Tools</h3>
                <div class="tools-container-display">
            `;

            matchedTools.forEach(tool => {
                const categories = tool.category && Array.isArray(tool.category) ? tool.category.join(' ') : 'General';
                const toolUrl = tool.url || `https://www.google.com/search?q=${encodeURIComponent(tool.name + ' AI tool')}`;
                const linkTarget = tool.url ? '_blank' : '_blank';

                resultsHTML += `
                    <div class="tool-card-display">
                        <a href="${toolUrl}" target="${linkTarget}" class="tool-card-link">
                            <div class="tool-name-display">${tool.name}</div>
                            <div class="tool-description-display">${tool.description}</div>
                            <div class="tool-keywords-display">${categories}</div>
                        </a>
                    </div>
                `;
            });

            resultsHTML += `</div>`;
        } else {
            resultsHTML += `
                <div class="no-tools-message">
                    <p>We couldn't find specific AI tools matching this exact task description in our database. Try rephrasing, or explore general automation platforms.</p>
                </div>
            `;
        }

        resultsHTML += `
            <button class="search-again-btn" id="search-again-btn">Search Again</button>
        `;
        resultsHTML += `</div>`;

        resultsSection.innerHTML = resultsHTML;
        resultsSection.style.display = 'block';

        const searchAgainBtn = document.getElementById('search-again-btn');
        if (searchAgainBtn) {
            searchAgainBtn.addEventListener('click', showSearchScreen);
        } else {
            console.error("Search Again button not found after rendering results.");
        }
    }

});