let usernameMapping = {};
let currentTimer = null;
const scrollAmount = 40; 

function updateProfilePicture(username) {
    const fullUsername = usernameMapping[username] || username;
    const url = `https://r6.tracker.network/r6siege/profile/ubi/${fullUsername}/overview`;

    window.electron.axios.get(url)
        .then(response => {
            const parsedHTML = window.electron.parseHTML(response.data);
        const imgSrc = parsedHTML.attr('.user-avatar__image', 'src');

            if (imgSrc) {
                const pfp = document.querySelector('#profile .pfp');
                pfp.src = imgSrc;
            } else {
                console.error('Profile picture not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching profile picture:', error);
        });
}

document.getElementById('userlist').addEventListener('click', (event) => {
    if (event.target && event.target.matches('div')) {
        const username = event.target.textContent.trim();
        updateProfilePicture(username);
    }
});

function showForm(formId) {
    const forms = ['login-form', 'removing', 'qr-import-form', 'edit-user-form'];
    const buttons = ['add-account', 'remove-account', 'import-accounts', 'qr-import', 'edit-users'];

    let formVisible = document.getElementById(formId).style.opacity === '1';

    forms.forEach(id => {
        document.getElementById(id).style.opacity = '0';
        document.getElementById(id).style.zIndex = '-1';
    });
    buttons.forEach(id => {
        const button = document.getElementById(id);
        button.classList.add('faded');
        button.classList.remove('hidden');
    });

    if (formVisible) {
        document.getElementById(formId).style.opacity = '0';
        document.getElementById(formId).style.zIndex = '-1';
        
    } else {
        document.getElementById(formId).style.opacity = '1';
        document.getElementById(formId).style.zIndex = '999';
        buttons.forEach(id => {
            if (id !== formId) {
                document.getElementById(id).classList.add('hidden');
            }
        });
    }
}

document.getElementById('add-account').addEventListener('click', () => {
    showForm('login-form');
});

document.getElementById('remove-account').addEventListener('click', () => {
    showForm('removing');
});

document.getElementById('qr-import').addEventListener('click', () => {
    showForm('qr-import-form');
});

document.getElementById('edit-users').addEventListener('click', () => {
    showForm('edit-user-form');
});

document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('factor');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
});

document.getElementById('key').addEventListener('click', function(event) {
    // event.preventDefault();

    const username = document.getElementById('text').value;
    const email = document.getElementById('email').value;
    const secret = document.getElementById('factor').value;

    if (username && email && secret) {
        const userDetails = {
            username: username,
            email: email,
            secret: secret
        };

        console.log("Adding user:", userDetails);
     
        saveAccountData(userDetails);

        location.reload();
        updateCodeAndTimer(secret);
        
    } else {
        showNotification("Please fill in all fields.");
    }
});

/*
function testFileOperations() {
    const filePath = window.electron.path.join('src', 'json', 'accounts.json');
    console.log('File Path:', filePath);  // Debug: Log the file path

    // Read the existing data from the file
    window.electron.fs.readFile(filePath, 'utf8')
        .then(data => {
            console.log('Read data:', data);  // Debug: Log the data read from the file

            let jsonArray;

            // Parse the existing data
            try {
                jsonArray = JSON.parse(data);
                if (!Array.isArray(jsonArray)) {
                    throw new Error('Parsed data is not an array.');
                }
            } catch (parseError) {
                console.error('Failed to parse JSON data:', parseError);
                jsonArray = [];  // Initialize with an empty array if parsing fails
            }

            // Append the new data
            const newEntry = {
                "username": "pls",
                "email": "pls@akinotsuru.com",
                "secret": "egegege"
            };
            jsonArray.push(newEntry);

            // Write the updated array back to the file
            return window.electron.fs.writeFile(filePath, JSON.stringify(jsonArray, null, 2), 'utf8');
        })
        .then(() => {
            console.log('Write test succeeded.');  // Confirm successful write
        })
        .catch(err => {
            console.error('An error occurred:', err);  // Handle any errors during read/write operations
        });
}
testFileOperations();
*/
/*
async function saveAccountData(userDetails) {
    const filePath = window.electron.path.join('src', 'json', 'accounts.json');
    
    console.log('File Path:', filePath);  // Debug: Log the file path

    try {
        // Read the existing data from the file
        const data = await window.electron.fs.readFile(filePath, 'utf8');
        console.log('Read data:', data);  // Debug: Log the data read from the file

        let accounts = [];

        // Parse the existing data
        try {
            accounts = JSON.parse(data);
            if (!Array.isArray(accounts)) {
                console.error("JSON data is not an array. Resetting to empty array.");
                accounts = [];
            }
        } catch (parseError) {
            console.error("Error parsing JSON data:", parseError);
            accounts = [];  // Initialize with an empty array if parsing fails
        }

        // Check for duplicates based on a unique property, e.g., 'email'
        const isDuplicate = accounts.some(account => account.username === userDetails.username);
        if (isDuplicate) {
            alert("ERROR: duplicate.");
            return;  // Exit the function if a duplicate is found
        }

        // Add new user to the list
        accounts.push(userDetails);

        // Write the updated array back to the file
        await window.electron.fs.writeFile(filePath, JSON.stringify(accounts, null, 4), 'utf8');
        console.log("Account data saved successfully.");

        // Optionally, call loadAndDisplayUsers if you want to update the UI
        loadAndDisplayUsers();
    } catch (error) {
        console.error("An error occurred:", error);  // Handle any errors during read/write operations
    }
}
*/
async function saveAccountData(userDetails) {
    const accountsJSON = window.localStorage.getItem('accounts');
    let accounts = [];

    if (accountsJSON) {
        try {
            accounts = JSON.parse(accountsJSON);
            if (!Array.isArray(accounts)) {
                console.error("JSON data is not an array. Resetting to empty array.");
                accounts = [];
            }
        } catch (parseError) {
            console.error("Error parsing JSON data:", parseError);
            accounts = [];
        }
    }

    const isDuplicate = accounts.some(account => account.username === userDetails.username);
    if (isDuplicate) {
        showNotification("ERROR: duplicate.");
        return;
    }

    accounts.push(userDetails);
    window.localStorage.setItem('accounts', JSON.stringify(accounts, null, 4));
    console.log("Account data saved successfully.");

    loadAndDisplayUsers();
}

document.addEventListener('DOMContentLoaded', loadAndDisplayUsers);

/*
function loadAndDisplayUsers() {
    const filetext = `
    
    ]`;

    try {
        const accounts = JSON.parse(filetext);
        const userlistDiv = document.getElementById('userlist').querySelector('p');
        const userDropdown = document.getElementById('user-dropdown');

        userlistDiv.innerHTML = '';
        userDropdown.innerHTML = '';

        accounts.forEach(account => {
            const userNameElement = document.createElement('div');
            let truncatedName = account.username;

            if (truncatedName.length > 9) {
                truncatedName = truncatedName.substring(0, 9) + '...';
            }

            usernameMapping[truncatedName] = account.username;
            userNameElement.textContent = truncatedName;
            userNameElement.style.cursor = 'pointer';
            userNameElement.style.opacity = ".8";
            userNameElement.addEventListener('mouseover', () => {
                userNameElement.style.opacity = '1';
            });
            userNameElement.addEventListener('mouseout', () => {
                userNameElement.style.opacity = '.8';
            });

            userNameElement.addEventListener('click', () => {
                updateCodeAndTimer(account.secret);
                const codeLabel = document.getElementById('codeLabel');
                codeLabel.style.top = '67px';
                codeLabel.style.left = '16px';
                codeLabel.style.animation = 'none';
                codeLabel.style.paddingBottom = '1.47rem';
            });

            userlistDiv.appendChild(userNameElement);

            const optionElement = document.createElement('option');
            optionElement.value = account.username;
            optionElement.textContent = account.username;
            userDropdown.appendChild(optionElement);
        });

    } catch (parseError) {
        console.error("Error parsing JSON data:", parseError);
    }
}
*/
/*
function loadAndDisplayUsers() {
    const filePath = window.electron.path.join('src', 'json','accounts.json' );

    window.electron.fs.readFile(filePath, 'utf8')
        .then(data => {
            if (data) {
                try {
                    const accounts = JSON.parse(data);
                    const userlistDiv = document.getElementById('userlist').querySelector('p');
                    const userDropdown = document.getElementById('user-dropdown');

                    userlistDiv.innerHTML = '';
                    userDropdown.innerHTML = '';

                    accounts.forEach(account => {
                        const userNameElement = document.createElement('div');
                        let truncatedName = account.username;

                        if (truncatedName.length > 9) {
                            truncatedName = truncatedName.substring(0, 9) + '...';
                        }

                        usernameMapping[truncatedName] = account.username;
                        userNameElement.textContent = truncatedName;
                        userNameElement.style.cursor = 'pointer';
                        userNameElement.style.opacity = ".8";
                        userNameElement.addEventListener('mouseover', () => {
                            userNameElement.style.opacity = '1';
                        });
                        userNameElement.addEventListener('mouseout', () => {
                            userNameElement.style.opacity = '.8';
                        });

                        userNameElement.addEventListener('click', () => {
                            updateCodeAndTimer(account.secret);
                            const codeLabel = document.getElementById('codeLabel');
                            codeLabel.style.top = '67px';
                            codeLabel.style.left = '16px';
                            codeLabel.style.animation = 'none';
                            codeLabel.style.paddingBottom = '1.47rem';
                        });

                        userlistDiv.appendChild(userNameElement);

                        const optionElement = document.createElement('option');
                        optionElement.value = account.username;
                        optionElement.textContent = account.username;
                        userDropdown.appendChild(optionElement);
                    });

                } catch (parseError) {
                    console.error("Error parsing JSON data:", parseError);
                }
            }
        })
        .catch(err => {
            console.error("An error occurred while handling the file:", err);
        });
}
*/

let isEditing = false; // Track the edit mode state

// Toggle edit mode
document.getElementById('edit-users').addEventListener('click', () => {
    isEditing = !isEditing;
    toggleEditForm(isEditing);
});

function toggleEditForm(editMode) {
    const editForm = document.getElementById('edit-user-form');
    const userlistDiv = document.getElementById('edit-user-list');

    if (editMode) {
        editForm.style.opacity = '1';
        userlistDiv.innerHTML = ''; // Clear the current list

        const accountsJSON = window.localStorage.getItem('accounts');
        if (accountsJSON) {
            const accounts = JSON.parse(accountsJSON);
            accounts.forEach((account, index) => {
                const userElement = document.createElement('div');
                userElement.innerHTML = `
                    <label id="editableLabel" for="user"><i class="fa-solid fa-user iconlabel"></i></label>
                    <input type="text" value="${account.username}" data-index="${index}" id="editable">
                    <button class="move-up move-icon"><i class="fa-solid fa-up"></i></button>
                    <button class="move-down move-icon"><i class="fa-solid fa-down"></i></button> 
                `;
                userlistDiv.appendChild(userElement);

                // Add event listeners for reordering
                userElement.querySelector('.move-up').addEventListener('click', () => moveUp(index));
                userElement.querySelector('.move-down').addEventListener('click', () => moveDown(index));
            });

            document.querySelector('.scrollable-container').style.maxHeight = `${newMaxHeight}px`;
            editForm.style.top = `${newTop}px`;
        }
    } else {
        editForm.style.opacity = '0';
    }
}

function moveUp(index) {
    const accountsJSON = window.localStorage.getItem('accounts');
    if (accountsJSON) {
        const accounts = JSON.parse(accountsJSON);
        if (index > 0) {
            [accounts[index - 1], accounts[index]] = [accounts[index], accounts[index - 1]];
            window.localStorage.setItem('accounts', JSON.stringify(accounts, null, 4));
            toggleEditForm(true); // Refresh the form to reflect changes
        }
    }
}

function moveDown(index) {
    const accountsJSON = window.localStorage.getItem('accounts');
    if (accountsJSON) {
        const accounts = JSON.parse(accountsJSON);
        if (index < accounts.length - 1) {
            [accounts[index], accounts[index + 1]] = [accounts[index + 1], accounts[index]];
            window.localStorage.setItem('accounts', JSON.stringify(accounts, null, 4));
            toggleEditForm(true); // Refresh the form to reflect changes
        }
    }
}

document.getElementById('save-changes').addEventListener('click', () => {
    const userlistDiv = document.getElementById('edit-user-list').children;
    const accountsJSON = window.localStorage.getItem('accounts');
    if (accountsJSON) {
        let accounts = JSON.parse(accountsJSON);
        for (let i = 0; i < userlistDiv.length; i++) {
            const newUsername = userlistDiv[i].querySelector('input').value.trim();
            accounts[i].username = newUsername;
        }
        window.localStorage.setItem('accounts', JSON.stringify(accounts, null, 4));
        loadAndDisplayUsers(); // Update the main list display
        toggleEditForm(false); // Close the form
    }
});

document.getElementById('cancel-edit').addEventListener('click', () => {
    toggleEditForm(false); // Close the form without saving
});

function loadAndDisplayUsers() {
    const accountsJSON = window.localStorage.getItem('accounts');
    
    if (accountsJSON) {
        try {
            const accounts = JSON.parse(accountsJSON);
            const userlistDiv = document.getElementById('userlist').querySelector('p');
            const userDropdown = document.getElementById('user-dropdown');
            const scrollsElements = document.querySelectorAll('.scrolls');
            const userlistContainer = document.querySelector('.userlist-container');

            if (accounts.length > 4) {
                userlistContainer.style.setProperty('--fade-opacity', '1');
                scrollsElements.forEach(element => {
                    element.style.opacity = '.6'; // Set initial opacity
                    element.addEventListener('mouseover', () => element.style.opacity = '1');
                    element.addEventListener('mouseout', () => element.style.opacity = '.6');
                });
            } else {
                userlistContainer.style.setProperty('--fade-opacity', '0');
                scrollsElements.forEach(element => {
                    element.style.opacity = '0'; // Set initial opacity
                    element.addEventListener('mouseover', () => element.style.opacity = '1');
                    element.addEventListener('mouseout', () => element.style.opacity = '0');
                });
            }

            scrollsElements.forEach(element => {
                element.style.opacity = accounts.length > 4 ? '.6' : '0'; // Set initial opacity

                // Add hover effect
                element.addEventListener('mouseover', () => {
                    element.style.opacity = '1';
                });
                element.addEventListener('mouseout', () => {
                    element.style.opacity = accounts.length > 4 ? '.6' : '0'; // Reset opacity on mouse out
                });
            });

            userlistDiv.innerHTML = '';
            userDropdown.innerHTML = '';

            accounts.forEach(account => {
                const userNameElement = document.createElement('div');
                let truncatedName = account.username;

                if (truncatedName.length > 9) {
                    truncatedName = truncatedName.substring(0, 9) + '...';
                }

                usernameMapping[truncatedName] = account.username;
                userNameElement.textContent = truncatedName;
                userNameElement.style.cursor = 'pointer';
                userNameElement.style.opacity = ".8";
                userNameElement.dataset.original = truncatedName;
                
                userNameElement.addEventListener('mouseover', () => {
                    userNameElement.style.opacity = '1';
                });
                userNameElement.addEventListener('mouseout', () => {
                    userNameElement.style.opacity = '.8';
                });

                userNameElement.addEventListener('click', () => {
                    updateCodeAndTimer(account.secret);
                    const codeLabel = document.getElementById('codeLabel');
                    codeLabel.style.top = '67px';
                    codeLabel.style.left = '16px';
                    codeLabel.style.animation = 'none';
                    codeLabel.style.paddingBottom = '1.58rem';
                    codeLabel.style.cursor = 'pointer';
                    codeLabel.style.opacity = '0'; 
                    
                    setTimeout(() => {
                        codeLabel.style.transition = 'opacity .7s ease';
                        codeLabel.style.opacity = '1';
                    }, 100); 
                });

                userlistDiv.appendChild(userNameElement);

                const optionElement = document.createElement('option');
                optionElement.value = account.username;
                optionElement.textContent = account.username;
                userDropdown.appendChild(optionElement);
            });

        } catch (parseError) {
            console.error("Error parsing JSON data:", parseError);
        }
    }
}

let codeLabelInitialized = false;

function updateCodeAndTimer(secret) {
    const { code, remainingTime } = generateCode(secret);
    const codeLabel = document.getElementById('codeLabel');
    const timerBar = document.getElementById('timerBar');

    if (codeLabel) {
        if (!codeLabelInitialized) {
            // Initialize content only once
            codeLabel.innerHTML = `
                <span class="code-text">${code}</span>
                <span class="underline"></span>
            `;
            codeLabelInitialized = true;
        } else {
            // Update the code content
            const codeTextElement = codeLabel.querySelector('.code-text');
            if (codeTextElement) {
                codeTextElement.textContent = code;
            }
        }
    }

    const step =  window.electron.authenticator.options.step || 30; 
    const percentageRemaining = (remainingTime / step) * 100;

    if (timerBar) {
        timerBar.style.width = `${percentageRemaining}%`;
        
        const redValue = Math.floor(146 + (percentageRemaining / 100) * (255 - 146));
        const greenValue = Math.floor(44 + (percentageRemaining / 100) * (255 - 44));
        const blueValue = Math.floor(44 + (percentageRemaining / 100) * (255 - 44));

        timerBar.style.backgroundColor = `rgb(${redValue}, ${greenValue}, ${blueValue})`;
    }

    if (currentTimer) {
        cancelAnimationFrame(currentTimer);
    }

    currentTimer = requestAnimationFrame(() => updateCodeAndTimer(secret));
}

function generateCode(secret) {
    if (!secret) {
        return { code: "N/A", remainingTime: "N/A" };
    }

    const code =  window.electron.authenticator.generate(secret);
    const step =  window.electron.authenticator.options.step || 30; 
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = step - (currentTime % step);

    return { code, remainingTime };
}

document.getElementById('remove-user-button').addEventListener('click', function(event) {
    event.preventDefault(); 

    const selectedUsername = document.getElementById('user-dropdown').value;

    if (selectedUsername) {
        removeUser(selectedUsername);
    } else {
        showNotification("Please select a user to remove.");
    }
});
/*
function removeUser(username) {
    const filePath = window.electron.path.join('src', 'json','accounts.json' );

    window.electron.fs.readFile(filePath, 'utf8')
        .then(data => {
            if (data) {
                let accounts = [];
                try {
                    accounts = JSON.parse(data);
                } catch (parseError) {
                    console.error("Error parsing JSON data:", parseError);
                    return;
                }

                const updatedAccounts = accounts.filter(account => account.username !== username);

                return window.electron.fs.writeFile(filePath, JSON.stringify(updatedAccounts, null, 4), 'utf8');
            }
        })
        .then(() => {
            console.log("User removed successfully.");
            loadAndDisplayUsers();
        })
        .catch(err => {
            console.error("An error occurred while handling the file:", err);
        });
}

*/
function removeUser(username) {
    const accountsJSON = window.localStorage.getItem('accounts');
    let accounts = [];

    if (accountsJSON) {
        try {
            accounts = JSON.parse(accountsJSON);
            if (!Array.isArray(accounts)) {
                console.error("JSON data is not an array.");
                return;
            }
        } catch (parseError) {
            console.error("Error parsing JSON data:", parseError);
            return;
        }

        const updatedAccounts = accounts.filter(account => account.username !== username);
        window.localStorage.setItem('accounts', JSON.stringify(updatedAccounts, null, 4));
        console.log("User removed successfully.");
        loadAndDisplayUsers();
    }
}

document.getElementById('import-accounts').addEventListener('click', () => {
    document.getElementById('file-input').click();
});
/*
document.getElementById('qr-import').addEventListener('click', () => {
    document.getElementById('qr-image').click();
});
*/

document.getElementById('qr-import-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const fileInput = document.getElementById('qr-image');
    const file = fileInput.files[0];

    if (username && file) {
        try {
            const qrCodeData = await readQRCode(file);
            const userDetails = {
                username: username,
                secret: qrCodeData,
                email: ''  // Assuming email is not provided through QR code
            };

            console.log("Adding user:", userDetails);
            saveAccountData(userDetails);

            location.reload();  // Refresh the page or update the UI as needed
        } catch (error) {
            console.error("Error processing QR code:", error);
        }
    } else {
        showNotification("Please fill in all fields and upload a QR code image.");
    }
});

function readQRCode(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0, img.width, img.height);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const qrCodeData = jsQR(imageData.data, imageData.width, imageData.height);
                if (qrCodeData) {
                    resolve(qrCodeData.data);
                } else {
                    reject(new Error('No QR code found.'));
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}
/*
document.getElementById('file-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedAccounts = JSON.parse(e.target.result);
                if (Array.isArray(importedAccounts)) {
                    importAccounts(importedAccounts);
                } else {
                    alert('Invalid JSON format. Expected an array of accounts.');
                }
            } catch (error) {
                console.error('Error parsing JSON file:', error);
                alert('Error parsing JSON file.');
            }
        };
        reader.readAsText(file);
    } else {
        alert('Please select a valid JSON file.');
    }
});

function importAccounts(importedAccounts) {
    const filePath = window.electron.path.join('src', 'json','accounts.json' );

    window.electron.fs.readFile(filePath, 'utf8')
        .then(data => {
            let existingAccounts = [];

            if (data) {
                try {
                    existingAccounts = JSON.parse(data);
                } catch (parseError) {
                    console.error("Error parsing existing accounts file:", parseError);
                    return;
                }
            }

            const updatedAccounts = [...existingAccounts, ...importedAccounts];
            const uniqueAccounts = Array.from(new Map(updatedAccounts.map(account => [account.username, account])).values());

            return window.electron.fs.writeFile(filePath, JSON.stringify(uniqueAccounts, null, 4), 'utf8');
        })
        .then(() => {
            console.log("Accounts imported successfully.");
            loadAndDisplayUsers();
        })
        .catch(err => {
            console.error("An error occurred while handling the file:", err);
        });
}
*/

document.getElementById('file-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedAccounts = JSON.parse(e.target.result);
                if (Array.isArray(importedAccounts)) {
                    importAccounts(importedAccounts);
                } else {
                    console.error("Imported data is not an array.");
                }
            } catch (parseError) {
                console.error("Error parsing imported file:", parseError);
            }
        };
        reader.readAsText(file);
    } else {
        showNotification("Please upload a valid JSON file.");
    }
});

function importAccounts(accounts) {
    const accountsJSON = window.localStorage.getItem('accounts');
    let existingAccounts = [];

    if (accountsJSON) {
        try {
            existingAccounts = JSON.parse(accountsJSON);
            if (!Array.isArray(existingAccounts)) {
                console.error("JSON data is not an array. Resetting to empty array.");
                existingAccounts = [];
            }
        } catch (parseError) {
            console.error("Error parsing JSON data:", parseError);
            existingAccounts = [];
        }
    }

    const combinedAccounts = existingAccounts.concat(accounts);
    window.localStorage.setItem('accounts', JSON.stringify(combinedAccounts, null, 4));
    console.log("Accounts imported successfully.");
    loadAndDisplayUsers();
}

document.getElementById('scroll-up').addEventListener('click', () => {
    const userlist = document.getElementById('userlist');
    userlist.scrollBy({
        top: -scrollAmount, 
        left: 0,
        behavior: 'smooth' 
    });
});

document.getElementById('scroll-down').addEventListener('click', () => {
    const userlist = document.getElementById('userlist');
    userlist.scrollBy({
        top: scrollAmount, 
        left: 0,
        behavior: 'smooth' 
    });
});

document.getElementById('open-r6tracker').addEventListener('click', () => {
    const iframe = document.getElementById('r6s');
    
    if (window.matchMedia('(max-width: 700px)').matches) {
        iframe.style.width = '10px';
        iframe.style.opacity = '0';
    }
    else if (iframe.style.width === '340px' || iframe.style.width === '') {
        iframe.style.width = '10px';
        iframe.style.opacity = '0';
    } else {
        iframe.style.width = '340px';
        iframe.style.opacity = '1';
    }
});

window.addEventListener('resize', () => {
    const iframe = document.getElementById('r6s');
    
    if (window.matchMedia('(max-width: 700px)').matches) {
        iframe.style.width = '10px';
        iframe.style.opacity = '0';
    } else if(iframe.width >= 30){
        iframe.style.width = '340px';
        iframe.style.opacity = '1'; 
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const codeLabel = document.getElementById('codeLabel');

    codeLabel.addEventListener('click', async () => {
        const isImageVisible = codeLabel.querySelector('img') !== null;
        if (isImageVisible) {
            return;
        }

        const codeText = codeLabel.textContent.trim();
        if (codeText) {
            try {
                await navigator.clipboard.writeText(codeText);
                showNotification("Code copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy code:", err);
            }
        } else {
            showNotification("No code to copy.");
        }
    });
});

let isVisible = false;

document.getElementById('about').addEventListener('click', () => {
    const aboutSection = document.getElementById('about-section');
    // Toggle the opacity based on the current state
    isVisible = !isVisible;
    aboutSection.style.opacity = isVisible ? '1' : '0';
});

function showNotification(message) {
    const notif = document.getElementById('notifications');
    const notifText = document.getElementById('notif-text');
    const notifIcon = document.querySelector('#notifications i')

    notifText.textContent = message;
    notif.style.top = '30px';
    setTimeout(() => {
        notifIcon.style.transform = 'scale(1.4)';
        notifIcon.style.color = 'white';
    }, 300); 
    notifIcon.style.transform = 'scale(1)';

    setTimeout(() => {
        notifText.textContent = '';
        notif.style.top = '-30px';
        notifIcon.style.color = 'rgba(255, 255, 255, 0.05)';
    }, 2500); 
}