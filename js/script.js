/**
 * Change what projects are displayed on the list based on user selection
 * @param {Object} e 
 */
function updateProjects(e) {
    const list = document.getElementById('project-list');
    list.className = e.target.value;
}

/**
 * Handle "Learn more" button click
 * @param {string} key 
 */
function openPopup(key) {
    // Display loading screen
    const popup = document.getElementById('popup');
    popup.className = 'loading';
    popup.style.display = 'block';

    // Start AJAX request
    const request = new XMLHttpRequest();
    const url = 'https://wesleybranton.github.io/Developer-Homepage/info/' + key + '.json';
    request.open('GET', url, true);
    request.responseType = 'json';
    request.onload = createPopup;
    request.onerror = closePopup;
    request.send();
    
    return false;
}

/**
 * Populate and display project popup
 * @param {Object} request 
 */
function createPopup(request) {
    const info = request.target.response;
    const popup = document.getElementById('popup');

    // Add general information
    popup.getElementsByClassName('title')[0].textContent = info.title;
    popup.getElementsByClassName('description')[0].textContent = info.description;

    // Add link button(s)
    const buttonContainer = popup.getElementsByClassName('button-container')[0];
    buttonContainer.textContent = '';
    let i = 0;
    while (info.links[i]) {
        let link = document.createElement('a');
        link.textContent = info.links[i].title;
        link.href = info.links[i].url;
        link.target = '_blank';
        buttonContainer.appendChild(link);
        i++;
    }

    // Add image(s)
    const imageContainer = popup.getElementsByClassName('image-container')[0];
    imageContainer.textContent = '';
    i = 0;
    while (info.images[i]) {
        let image = document.createElement('img');
        image.src = info.images[i];
        imageContainer.appendChild(image);
        i++;
    }

    // Display popup
    popup.className = 'done';
    return false;
}

/**
 * Close project popup
 */
function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
}

// Add event listeners
document.getElementById('project-show').value = 'all';
document.getElementById('project-show').addEventListener('change', updateProjects);
document.getElementById('closePopup').addEventListener('click', closePopup);
