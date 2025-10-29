// GATE Frontend JavaScript
// This code handles user interactions and talks to your backend server

const SERVER_URL = '/api';

// ===== LANDING PAGE (index.html) =====
if (document.getElementById('searchBtn')) {
    const searchBtn = document.getElementById('searchBtn');
    const careerInput = document.getElementById('careerInput');
    const browseBtn = document.getElementById('browseBtn');
    const careerDropdown = document.getElementById('careerDropdown');

    // Handle search button click
    searchBtn.addEventListener('click', () => {
        const career = careerInput.value.trim();
        if (career) {
            // Save career and go to results page
            localStorage.setItem('selectedCareer', career);
            window.location.href = 'results.html';
        } else {
            alert('Please enter a career name');
        }
    });

    // Allow Enter key to search
    careerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    // Handle browse button click
    browseBtn.addEventListener('click', () => {
        const career = careerDropdown.value;
        if (career) {
            localStorage.setItem('selectedCareer', career);
            window.location.href = 'results.html';
        } else {
            alert('Please select a career from the dropdown');
        }
    });
}

// ===== RESULTS PAGE (results.html) =====
if (document.getElementById('content')) {
    const career = localStorage.getItem('selectedCareer');
    
    if (!career) {
        window.location.href = 'index.html';
    } else {
        generateCareerContent(career);
    }
}

async function generateCareerContent(career) {
    try {
        // Show loading message
        document.getElementById('loading').style.display = 'block';
        document.getElementById('content').style.display = 'none';

        // Call your backend server
        const response = await fetch(`${SERVER_URL}/generate-career`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ career })
        });

        if (!response.ok) {
            throw new Error('Failed to generate content');
        }

        const data = await response.json();
        
        // Store the full content for microlearning page
        localStorage.setItem('careerContent', data.content);
        
        // Display the content
        displayCareerContent(career, data.content);
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loading').innerHTML = 
            '<p style="color: red;">Sorry, there was an error generating content. Please make sure your server is running and try again.</p>';
    }
}

function displayCareerContent(career, content) {
    // Hide loading, show content
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';

    // Set career title
    document.getElementById('careerTitle').textContent = career;

    // Parse the content (this is simplified - Claude's response format may vary)
    // We'll display the raw content for now
    const sections = parseCareerContent(content);
    
    document.getElementById('careerOverview').innerHTML = sections.overview || '<p>Loading overview...</p>';
    document.getElementById('requiredSkills').innerHTML = sections.skills || '<p>Loading skills...</p>';
    document.getElementById('selfAssessment').innerHTML = sections.assessment || '<p>Loading questions...</p>';

    // Handle microlearning button
    document.getElementById('startMicrolearning').addEventListener('click', () => {
        window.open('microlearning.html', '_blank');
    });
}

function parseCareerContent(content) {
    // Simple parser - looks for section headers
    // This is basic and may need adjustment based on Claude's actual output
    
    const sections = {
        overview: '',
        skills: '',
        assessment: '',
        project: ''
    };

    // Try to extract sections
    const overviewMatch = content.match(/CAREER OVERVIEW[\s\S]*?(?=REQUIRED SKILLS|$)/i);
    const skillsMatch = content.match(/REQUIRED SKILLS[\s\S]*?(?=SELF-ASSESSMENT|$)/i);
    const assessmentMatch = content.match(/SELF-ASSESSMENT[\s\S]*?(?=MICROLEARNING PROJECT|$)/i);
    
    if (overviewMatch) sections.overview = formatText(overviewMatch[0].replace(/CAREER OVERVIEW/i, ''));
    if (skillsMatch) sections.skills = formatText(skillsMatch[0].replace(/REQUIRED SKILLS/i, ''));
    if (assessmentMatch) sections.assessment = formatText(assessmentMatch[0].replace(/SELF-ASSESSMENT QUESTIONS?/i, ''));

    return sections;
}

function formatText(text) {
    // Convert markdown-style bullets to HTML
    text = text.trim();
    text = text.replace(/^- (.+)$/gm, '<li>$1</li>');
    if (text.includes('<li>')) {
        text = '<ul>' + text + '</ul>';
    }
    text = text.replace(/\n\n/g, '</p><p>');
    if (!text.startsWith('<ul>')) {
        text = '<p>' + text + '</p>';
    }
    return text;
}

// ===== MICROLEARNING PAGE (microlearning.html) =====
if (document.getElementById('projectContent')) {
    const career = localStorage.getItem('selectedCareer');
    const content = localStorage.getItem('careerContent');
    
    if (!career || !content) {
        document.getElementById('loading').innerHTML = 
            '<p>No project data found. Please go back and select a career.</p>';
    } else {
        displayProjectContent(career, content);
    }
}

function displayProjectContent(career, content) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('projectContent').style.display = 'block';
    
    document.getElementById('projectCareerTitle').textContent = career + ' - Microlearning Project';
    
    // Extract project sections
    const projectMatch = content.match(/MICROLEARNING PROJECT[\s\S]*/i);
    
    if (projectMatch) {
        const projectText = projectMatch[0];
        
        // Extract subsections
        const overviewMatch = projectText.match(/PROJECT OVERVIEW[\s\S]*?(?=TASKS|$)/i);
        const tasksMatch = projectText.match(/TASKS[\s\S]*?(?=RESULTING ARTIFACT|$)/i);
        const artifactMatch = projectText.match(/RESULTING ARTIFACT[\s\S]*?(?=CAREER CONNECTION|$)/i);
        const connectionMatch = projectText.match(/CAREER CONNECTION[\s\S]*?(?=QUALITY CHECKLIST|$)/i);
        
        document.getElementById('projectInstructions').innerHTML = 
            '<p>This project should take approximately 60 minutes to complete. Work through each section at your own pace.</p>';
        
        if (overviewMatch) {
            document.getElementById('projectOverview').innerHTML = 
                formatText(overviewMatch[0].replace(/PROJECT OVERVIEW/i, ''));
        }
        
        if (tasksMatch) {
            document.getElementById('projectTasks').innerHTML = 
                formatText(tasksMatch[0].replace(/TASKS/i, ''));
        }
        
        if (artifactMatch) {
            document.getElementById('projectArtifact').innerHTML = 
                formatText(artifactMatch[0].replace(/RESULTING ARTIFACT/i, ''));
        }
        
        if (connectionMatch) {
            document.getElementById('careerConnection').innerHTML = 
                formatText(connectionMatch[0].replace(/CAREER CONNECTION/i, ''));
        }
    }
}