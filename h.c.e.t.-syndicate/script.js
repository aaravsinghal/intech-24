document.addEventListener('DOMContentLoaded', function() {
    const agentForm = document.getElementById('addAgentForm');
    const missionForm = document.getElementById('addMissionForm');
    const agentList = document.getElementById('agents');
    const missionList = document.getElementById('missions');
    const agentsDropdown = document.getElementById('assignedAgent');
    const completedMissionsList = document.getElementById('completedMissions');

    const agentsData = JSON.parse(localStorage.getItem('agentsData')) || [];
    const missionsData = JSON.parse(localStorage.getItem('missionsData')) || [];
    const completedMissionsData = JSON.parse(localStorage.getItem('completedMissionsData')) || [];

    function getRank(missionsCompleted) {
        if (missionsCompleted >= 100) return 'Boss';
        if (missionsCompleted >= 90) return 'VP';
        if (missionsCompleted >= 60) return 'Secretary';
        if (missionsCompleted >= 50) return 'Director';
        if (missionsCompleted >= 20) return 'Core';
        if (missionsCompleted >= 5) return 'Treasurer';
        return 'Agent';
    }

    function saveData() {
        localStorage.setItem('agentsData', JSON.stringify(agentsData));
        localStorage.setItem('missionsData', JSON.stringify(missionsData));
        localStorage.setItem('completedMissionsData', JSON.stringify(completedMissionsData));
    }

    function addAgent(name, missionsCompleted) {
        const rank = getRank(missionsCompleted);
        const agent = { name, missionsCompleted, rank };
        agentsData.push(agent);
        saveData();
        renderAgents();
        updateAgentsDropdown(1);
    }

    function addMission(name, dangerLevel, assignedAgent, description) {
        const mission = { name, dangerLevel, assignedAgent, description, status: 'Active' };
        missionsData.push(mission);
        saveData();
        renderMissions();
    }

    function renderAgents() {
        agentList.innerHTML = '';
        agentsData.forEach((agent, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                ${agent.name} - Rank: ${agent.rank}
                <button onclick="changeRank(${index})">Change Rank</button>
                <button onclick="deleteAgent(${index})">Delete</button>
            `;
            agentList.appendChild(listItem);
        });
    }

    function renderMissions() {
        missionList.innerHTML = '';
        missionsData.forEach((mission, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                ${mission.name} - Danger Level: ${mission.dangerLevel} - Assigned Agent: ${mission.assignedAgent}
                <button onclick="markMissionOver(${index})">Mark as Over</button>
            `;
            missionList.appendChild(listItem);
        });
    }

    function renderCompletedMissions() {
        completedMissionsList.innerHTML = '';
        completedMissionsData.forEach(mission => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                ${mission.name} - Danger Level: ${mission.dangerLevel} - Assigned Agent: ${mission.assignedAgent} - Description: ${mission.description}
            `;
            completedMissionsList.appendChild(listItem);
        });
    }

    function getAvailableAgents(dangerLevel) {
        switch (dangerLevel) {
            case 1:
                return agentsData.filter(agent => ['Agent', 'Treasurer', 'Core', 'Director', 'Secretary', 'VP', 'Boss'].includes(agent.rank));
            case 2:
                return agentsData.filter(agent => ['Treasurer', 'Core', 'Director', 'Secretary', 'VP', 'Boss'].includes(agent.rank));
            case 3:
                return agentsData.filter(agent => ['Core', 'Director', 'Secretary', 'VP', 'Boss'].includes(agent.rank));
            case 4:
                return agentsData.filter(agent => ['Director', 'Secretary', 'VP', 'Boss'].includes(agent.rank));
            case 5:
                return agentsData.filter(agent => ['VP', 'Boss'].includes(agent.rank));
            default:
                return [];
        }
    }

    function updateAgentsDropdown(dangerLevel) {
        const availableAgents = getAvailableAgents(dangerLevel);
        agentsDropdown.innerHTML = '<option value="" disabled selected>Select Agent</option>';
        availableAgents.forEach(agent => {
            const option = document.createElement('option');
            option.textContent = `${agent.name} (${agent.rank})`;
            option.value = agent.name;
            agentsDropdown.appendChild(option);
        });
    }

    agentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const agentName = this.agentName.value;
        const missionsCompleted = parseInt(this.missionsCompleted.value);
        addAgent(agentName, missionsCompleted);
        this.reset();
    });

    missionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const missionName = this.missionName.value;
        const dangerLevel = parseInt(this.dangerLevel.value);
        const missionDescription = this.missionDescription.value;
        const assignedAgent = this.assignedAgent.value;
        addMission(missionName, dangerLevel, assignedAgent, missionDescription);
        this.reset();
        updateAgentsDropdown(1);
    });

    missionForm.dangerLevel.addEventListener('input', function() {
        const dangerLevel = parseInt(this.value);
        if (dangerLevel >= 1 && dangerLevel <= 5) {
            updateAgentsDropdown(dangerLevel);
        }
    });

    window.changeRank = function(index) {
        const newRank = prompt(`Enter new rank for ${agentsData[index].name}:`);
        if (newRank) {
            agentsData[index].rank = newRank;
            saveData();
            renderAgents();
        }
    };

    window.deleteAgent = function(index) {
        agentsData.splice(index, 1);
        saveData();
        renderAgents();
        updateAgentsDropdown(1);
    };

    window.markMissionOver = function(index) {
        missionsData[index].status = 'Over';
        completedMissionsData.push(missionsData[index]);
        missionsData.splice(index, 1);
        saveData();
        renderMissions();
        renderCompletedMissions();
    };

    renderAgents();
    renderMissions();
    renderCompletedMissions();
    updateAgentsDropdown(1);
});

document.addEventListener('DOMContentLoaded', function() {
    const completedMissionsList = document.getElementById('completedMissions');

    const completedMissionsData = JSON.parse(localStorage.getItem('completedMissionsData')) || [];

    function renderCompletedMissions() {
        completedMissionsList.innerHTML = '';
        completedMissionsData.forEach(mission => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                ${mission.name} - Danger Level: ${mission.dangerLevel} - Assigned Agent: ${mission.assignedAgent} - Description: ${mission.description}
            `;
            completedMissionsList.appendChild(listItem);
        });
    }

    renderCompletedMissions();
});
document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    function sendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendButton.addEventListener('click', function() {
        const message = messageInput.value.trim();
        if (message !== '') {
            sendMessage(message, 'sender');
            // Here you can add logic to send the message to other agents or store it.
            // For this simple version, we're just displaying it in the chat.
            messageInput.value = '';
        }
    });

    // Example receiving a message (just for demonstration)
    setTimeout(function() {
        sendMessage('Hey, agents! Make sure to complete the mission briefing by 3 PM today.', 'receiver');
    }, 1000);
});
