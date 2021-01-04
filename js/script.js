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
    const url = 'info/' + key + '.json';
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

    // Change tabindex
    updateFocus(true);
    document.getElementById('closePopup').setAttribute('tabindex', 1);

    // Add link button(s)
    const buttonContainer = popup.getElementsByClassName('button-container')[0];
    buttonContainer.textContent = '';
    let i = 0;
    while (info.links[i]) {
        let link = document.createElement('a');
        link.textContent = info.links[i].title;
        link.href = info.links[i].url;
        link.target = '_blank';
        link.setAttribute('tabindex', i + 2);
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

    // Clear elements
    popup.getElementsByClassName('title')[0].textContent = "";
    popup.getElementsByClassName('description')[0].textContent = "";
    popup.getElementsByClassName('image-container')[0].textContent = "";
    popup.getElementsByClassName('button-container')[0].textContent = "";

    // Change tabindex
    updateFocus(false);
    document.getElementById('closePopup').setAttribute('tabindex', -1);
}

/**
 * Makes only the popup focusable when it's open
 * @param {boolean} isPopupOpen 
 */
function updateFocus(isPopupOpen) {
    const elements = document.querySelectorAll('a, input, textarea, button, iframe');
    if (isPopupOpen) {
        for (e of elements) e.setAttribute('tabindex', -1);
    } else {
        for (e of elements) e.removeAttribute('tabindex');
    }
}

/**
 * Send email
 */
function sendMessage() {
    // Update UI
    const banner = document.getElementById('send-fail');
    banner.classList.add('hide');

    document.getElementById('send-button').disabled = true;

    // Start AJAX request
    const request = new XMLHttpRequest();
    const data = `name=${document.getElementsByName('name')[0].value}&email=${document.getElementsByName('email')[0].value}&message=${document.getElementsByName('message')[0].value}&g-recaptcha-response=${document.getElementsByName('g-recaptcha-response')[0].value}`;
    const url = 'https://send.wesleybranton.com/send.php';
    request.open('POST', url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onload = function() {
        if (request.status == 200) return messageSuccess();
        return messageFail(request.status);
    };
    request.send(data);
}

/**
 * Handle successful email sent
 */
function messageSuccess() {
    const form = document.getElementById('form-contact');
    const banner = document.getElementById('send-success');
    form.parentNode.removeChild(form);
    banner.classList.remove('hide');
}

/**
 * Handle failed email sent
 * @param {number} status 
 */
function messageFail(status) {
    const banner = document.getElementById('send-fail');
    let error;

    if (status == 401) error = 'reCAPTCHA check failed';
    else if (status == 403) error = 'Bad request';
    else if (status == 500) error = 'Server error';

    document.getElementById('send-fail-reason').textContent = error;
    document.getElementById('send-fail-error').textContent = `Error code ${status}`;

    banner.classList.remove('hide');
    document.getElementById('send-button').disabled = false;
}

/**
 * Trigger project hover when project button is focused
 * @param {Object} event 
 */
function expandProject(event) {
    event.target.parentNode.parentNode.classList.add('expand');
}

/**
 * Clear project hover when project button is unfocused
 * @param {Object} event 
 */
function collapseProject(event) {
    event.target.parentNode.parentNode.classList.remove('expand');
}

// Add event listeners
document.getElementById('project-show').value = 'all';
document.getElementById('project-show').addEventListener('change', updateProjects);
document.getElementById('closePopup').addEventListener('click', closePopup);
document.getElementById('form-contact').addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
    return false;
});
let projectLinks = document.querySelectorAll('.project-desc > a');
for (l of projectLinks) {
    l.addEventListener('focus', expandProject);
    l.addEventListener('blur', collapseProject);
}
