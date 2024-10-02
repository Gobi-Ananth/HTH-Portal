document.addEventListener('DOMContentLoaded', async (event) => {

    // Simulate user login status and team status
    var user = {};
    var team = {};
    var userLoggedIn = false; 
    var userInTeam = false;

    // Function to check if the user is Authenticated
    async function checkuserLoggedIn() {
        try {
            const response = await fetch('/api/user/get-data', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                user = await response.json();
                userLoggedIn = true;
            } 
        } catch (error) {
            console.error('Error:', error);
        }
    };

    await checkuserLoggedIn();

    // Function to check if the user is in Team
    async function checkuserInTeam() {
        try {
            const response = await fetch('/api/team/get-data', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                team = await response.json();
                userInTeam = true;
            } 
        } catch (error) {
            console.error('Error:', error);
        }
    };

    await checkuserInTeam();
 
    // Function to check if the user is logged in
    function isLoggedIn() {
        return userLoggedIn;
    }

    // Function to check if the user is in a team
    function isInTeam() {
        return userInTeam;
    }

    // Function to fetch user name from the backend
    function fetchUserName() {
        // Simulate fetching user name from the backend
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(user.name);
            }, 1000);
        });
    }

    // Function to fetch team members from the backend
    function fetchTeamMembers() {
        // Simulate fetching team members from the backend
        var membersList = membersList = team.teamDetails.members.map(member => member.name);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(membersList);
            }, 1000);
        });
    }

    // Get the main content and login container divs
    var mainContent = document.getElementById('main-content');
    var loginContainer = document.getElementById('login-container');
    var userNameSpan = document.getElementById('user-name');

    // Conditionally display the main content or login container
    if (isLoggedIn()) {
        mainContent.style.display = 'block';
        fetchUserName().then((userName) => {
            userNameSpan.textContent = userName;
        });
    } else {
        loginContainer.style.display = 'flex';
    }

    // Get the popup
    var popup = document.getElementById("popup");
    var popupContent = document.querySelector(".popup-content");

    // Get the <span> element that closes the popup
    var closePopup = document.getElementById("close-popup");

    // Get the divs that will trigger the popup
    var topLeftTwoLeft = document.querySelector(".top-left-two .left");
    var topRight = document.querySelector(".top-right");
    var bottomLeft = document.querySelector(".bottom-left");

    // Function to show the popup with specific content
    function showPopup(content) {
        popupContent.innerHTML = `
            <span id="close-popup" class="close-popup">&times;</span>
            ${content}
        `;
        popup.style.display = 'block';

        // Re-attach the close event listener
        document.getElementById('close-popup').onclick = function() {
            popup.style.display = 'none';
        };
    }

    // Check if elements exist before adding event listeners
    if (topLeftTwoLeft) {
        topLeftTwoLeft.onclick = function() {
            if (isLoggedIn() && isInTeam()) {
                fetchTeamMembers().then((teamMembers) => {
                    let teamContent = `
                <div class="popup-wrapper"> 
                        <div class="header team-header">
                            <h1>${team.teamDetails.team_name}</h1>
                            <h2>Team Code: ${team.teamDetails.team_id}</h2>
                        </div>
                        <div class="content team-content">
                            <ul>
                    `;
                    teamMembers.forEach(member => {
                        teamContent += `<li>${member}</li>`;
                    });
                    teamContent += `
                            </ul>
                            <input type="text" class="ppt-link-input" id="ppt-link" placeholder="Enter PPT link">
                            <button id="submit-ppt" class="submit-ppt-btn">Submit</button>
                        </div>
                </div>
                    `;
                    showPopup(teamContent);

                    // Add event listener for submitting PPT link
                    document.getElementById('submit-ppt').onclick = async function() {
                        var pptLink = document.getElementById('ppt-link').value;
                        if (pptLink) {
                            // Simulate saving to backend
                            try {
                                const response = await fetch('/api/team/submit-idea', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ "idea": pptLink }),
                                });
                                if (!response.ok) {
                                    const errorData = await response.json();
                                    return alert(errorData.message);
                                }
                            } catch (error) {
                                return alert('An error occurred while submitting idea.');
                            }
                            alert(`PPT link submitted: ${pptLink}`);
                            popup.style.display = 'none';
                            location.reload();
                        }
                    };
                });
            } else {
                showPopup(`
                    <div class="popup-wrapper"> 
                        <div class="header">
                            <h1>Create or Join a Team</h1>
                        </div>
                        <div class="content">
                            <a href="#" id="create-team" class="btn">Create Team</a>
                            <a href="#" id="join-team" class="btn">Join Team</a>
                        </div>
                    </div>
                `);

                // Add event listener for "Create Team" button
                document.getElementById('create-team').onclick = function() {
                    showPopup(`
                        <div class="popup-wrapper">
                            <div class="header">
                                <h1>Create a Team</h1>
                            </div>
                            <div class="content">
                                <input type="text" id="team-name" placeholder="Enter team name">
                                <button id="submit-team">Create Team</button>
                             </div>
                        </div>
                    `);

                    // Add event listener for submitting team name
                    document.getElementById('submit-team').onclick = async function() {
                        var teamName = document.getElementById('team-name').value;
                        if (teamName) {
                            // Simulate saving to backend
                            try {
                                const response = await fetch('/api/team/create-team', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ "team_name": teamName }),
                                });
                                if (response.ok) {
                                    const data = await response.json();
                                    userInTeam = true;
                                } else {
                                    const errorData = await response.json();
                                    return alert(errorData.message);
                                }
                            } catch (error) {
                                return alert('An error occurred while creating the team.');
                            }
                            alert(`Team created: ${teamName}`);
                            popup.style.display = 'none';
                            location.reload();
                        }
                    };
                };

                // Add event listener for "Join Team" button
                document.getElementById('join-team').onclick = function() {
                    showPopup(`
                        <div class="popup-wrapper">
                            <div class="header">
                                <h1>Join a Team</h1>
                            </div>
                            <div class="content">
                                <input type="text" id="team-code" placeholder="Enter team code">
                                <button id="submit-code">Join Team</button>
                            </div>
                        </div>
                    `);

                    // Add event listener for submitting team code
                    document.getElementById('submit-code').onclick = async function() {
                        var teamCode = document.getElementById('team-code').value;
                        if (teamCode) {
                            // Simulate checking the team code and joining the team
                            try {
                                const response = await fetch('/api/team/join-team', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ "team_id": teamCode }),
                                });
                                if (response.ok) {
                                    const data = await response.json();
                                    userInTeam = true;
                                } else {
                                    const errorData = await response.json();
                                    return alert(errorData.message);
                                }
                            } catch (error) {
                                return alert('An error occurred while joining the team.');
                            }
                            alert(`Joined team with code: ${teamCode}`);
                            popup.style.display = 'none';
                            location.reload();
                        }
                    };
                };
            }
        }
    }

    if (topRight) {
        topRight.onclick = function() {
            let problemsContent = `
                <div class="header problems-container">
                    <h1>Problems</h1>
                </div>
                <div class="content problems-container">
                    <ul class="problems">
            `;
            jsonData.forEach(problem => {
                problemsContent += `
                    <li>
                        <h2>${problem.topic}</h2>
                        <p>${problem.description}</p>
                    </li>
                `;
            });
            problemsContent += `
                    </ul>
                </div>
            `;
            showPopup(problemsContent);
        }
    }

    // When the user clicks anywhere outside of the popup, close it
    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = "none";
        }
    }
});

//Login
function handleLogin() {
    window.location.href = "http://localhost:1000/api/user/auth/google";
};